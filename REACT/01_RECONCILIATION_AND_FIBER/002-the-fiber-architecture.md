# The Fiber Architecture

## 🎯 The Core Question

Lesson 001 gave you a fast diff. But it has a hidden problem: that diff runs as **one big function call that cannot be stopped once it starts.** If a state change makes React reconcile a large tree, the work runs all the way to the end — and while it runs, **the browser's one main thread is frozen.** No scrolling, no typing, no clicking, no animation. The page is dead until the work finishes.

So the question this lesson answers is: **how do you run a long rendering job in a way that can pause halfway, let the browser handle an urgent keystroke or paint a frame, and then continue exactly where it stopped — without ever showing a broken half-updated screen?**

The answer is a rewrite of React's insides called **Fiber**. Before the mechanism, here is the one idea that makes the whole thing click, because it's the thing most people get stuck on.

---

## 🔑 The one idea to get first: a tree and a "linked list" are the same thing here

In lesson 001 everything was a **tree** — parents, children, siblings. In this lesson you'll hear "linked list," and it feels like a contradiction, because a plain linked list is just a flat `prev → next` line and a tree is clearly not flat.

Here's the resolution: **the tree never goes away. "Linked list" just describes how the tree is wired together in memory.**

A tree is a *shape*. That shape has to be stored somehow. There are two ways to wire it, and they store the **exact same tree**:

**Way A — how you probably picture a tree** (the parent holds an array of all its children):

```js
parent = {
  children: [childA, childB, childC]   // parent points to ALL its kids at once
}
```

**Way B — how Fiber wires it** (each node holds three single pointers):

```js
parent.child   = childA     // parent points ONLY to its FIRST child
childA.sibling = childB      // childA points to the next kid
childB.sibling = childC      // childB points to the next kid
childC.sibling = null        // no more kids

childA.return  = parent      // each kid points back UP to its parent
childB.return  = parent
childC.return  = parent
```

**These are the same tree.** Same parent, same three children, same relationships. Nothing about the shape changed. The only difference: instead of one array holding every child, each node holds a few named pointers — `child` (go down), `sibling` (go sideways), `return` (go back up).

So "linked list" does **not** mean the flat two-pointer line you were picturing. It means *the tree is threaded together with single-step pointers.* Three pointers per node is plenty to describe a full tree with children and siblings.

**Why bother wiring it this way instead of an array?** Because with these three pointers, standing on *any* node, you can always compute the **one single "next node to visit,"** with three simple rules:

1. Is there a `child`? → go down to the child.
2. No child, but a `sibling`? → go sideways to the sibling.
3. No child and no sibling? → follow `return` up to the parent, then go to *that* node's sibling.

Follow those rules over and over and you visit **every node in the tree, one at a time, along a single path.** That single path is the "linked-list" part. You didn't flatten the tree — you gave it an **order to walk, one step at a time.** And "one step at a time" is exactly what lets you *stop* between steps. Hold onto this; it's the whole trick.

---

## 📜 The Origin Story (history & the thinking behind it)

### The old engine: the "stack reconciler"

From 2013 to 2017, React ran reconciliation (lesson 001) as ordinary **recursion**. To reconcile a component, React called a function; to reconcile its children, that function called itself; and so on down the tree. This is now called the **stack reconciler**, because it rode on the **JavaScript call stack** (the built-in structure the language uses to track "which function is running and where to return when it finishes").

Recursion is the natural way to walk a tree, and it's clean — but it has one fatal property: **you don't control the call stack.** Once you call `reconcile(root)`, the JavaScript engine owns the work until it finishes all the way down. You can't say "pause here, I'll come back." You can't say "this part is urgent, do it first." You can't say "we've run for 8ms, hand the thread back to the browser and continue next frame." The recursion runs top to bottom to the end, holding the single main thread the whole time.

### The pain: one thread, and a page that must both compute and stay alive

Here's the physical fact that makes this fatal. **The browser has one main thread, and it does everything on it**: running your JavaScript, computing layout, painting pixels, and reacting to input. These take *turns*. While your JavaScript runs, the browser can't paint and can't respond to clicks or keystrokes. To feel smooth (60 frames per second) the browser needs to paint about **every 16 milliseconds**. So any single chunk of JavaScript that runs longer than ~16ms guarantees a dropped frame; run 100ms and the page visibly freezes for 100ms.

Now combine that with the stack reconciler. A user types in a search box that filters a big list. Each keystroke updates state, which reconciles the whole list. If that reconciliation takes 50ms and can't be interrupted, then **every keystroke freezes the page for 50ms.** The cursor stutters, characters lag, animations hitch. The app feels broken — not because the total work is too much, but because it's done in **one unstoppable blocking burst** that starves everything else. And there was no way to say "the keystroke is urgent, the list can wait" — the old engine treated every update as "do all of it, right now."

### The insight: stop riding the browser's stack — build your own

The React team (this rewrite was led principally by **Andrew Clark** — `acdlite`, whose "React Fiber Architecture" notes are the reference for this lesson — with **Sebastian Markbåge** and others, worked on through 2016 and shipped in **React 16, September 2017**) had a deep realization:

**The problem isn't the diff algorithm — it's that the algorithm lives on the call stack, which we don't control. So take the idea of a call stack, and rebuild it as plain data that we *do* control.**

A call stack is really just a chain of "what am I working on, what were the inputs, and where do I go when I'm done." Normally the engine hides that from you. React's leap: **turn each unit of rendering work into a plain JavaScript object** that stores that same information — plus the `child`/`sibling`/`return` pointers from the top of this lesson. Now the "tree of work" is just data you can walk with a loop, one node at a time — and because it's data, you can **stop the loop whenever you want, remember your place, hand the thread back to the browser, and continue later.**

Each of those objects is a **fiber**.

### Why the name "fiber"?

The name is borrowed from computing. A **thread** is a unit of work the operating system can interrupt at any instant (preemptive). A **fiber** is a lighter unit that is scheduled **cooperatively** — it runs until it *chooses* to yield, then something else runs. React's fibers work exactly like this: each runs for a slice of time and then voluntarily hands the main thread back to the browser. React is doing **cooperative multitasking for rendering**, in your app, on top of the single JavaScript thread. In one line: *a call stack, rebuilt as data you can pause.*

---

## 💢 Why it exists (the pain it solves)

The stack reconciler was **synchronous, recursive, and uninterruptible**: once a render started it ran to the end, blocking the thread, dropping frames, lagging input — with no way to prioritize urgent work. Fiber exists to break that one blocking burst into **many small, resumable pieces**, so React can:

1. **Pause** work partway through the tree and hand the thread back (page stays responsive).
2. **Resume** later from exactly where it stopped.
3. **Throw away** in-progress work that a newer update has made irrelevant.
4. **Prioritize** so a keystroke can jump ahead of a background re-render.

None of that is possible with plain recursion. All of it becomes possible once each unit of work is an object in a threaded tree you walk with a loop.

---

## 🧩 What it is

A **fiber** is a plain JavaScript object representing **one unit of work** — almost always one element/component in the tree (one `<div>`, one `<Counter>`). The **Fiber architecture** is: (a) representing the whole UI as a **tree of fibers threaded with `child`/`sibling`/`return` pointers** so it can be walked one step at a time, and (b) a **work loop** that processes those fibers one by one and can stop between any two of them.

### The shape of one fiber

A fiber carries what a call-stack frame would carry, plus some bookkeeping:

```
fiber = {
  // --- what this unit renders ---
  type,          // 'div', or the function/class of the component
  key,           // the reconciliation key from lesson 001
  stateNode,     // the real thing this manages: the actual DOM node, or the class instance

  // --- the tree, threaded as pointers (the key part) ---
  return,        // parent fiber   (where to go back when done)
  child,         // FIRST child fiber
  sibling,       // NEXT sibling fiber

  // --- inputs & outputs (like a frame's arguments and locals) ---
  pendingProps,  // incoming props for this render
  memoizedProps, // props used in the last committed render
  memoizedState, // last committed state (for a function component: its hooks)

  // --- work bookkeeping ---
  flags,         // what to DO on commit: insert / update / delete (was "effectTag")
  lanes,         // the PRIORITY of pending work here (lesson 003)
  alternate,     // pointer to this fiber's twin in the OTHER tree (double buffering, below)
}
```

### The book: the analogy to hold for the whole lesson

**A book is a tree.** It has Parts → Chapters → Sections → Paragraphs — a clear hierarchy, with children and siblings, exactly like a UI tree.

**But you *read* a book as a single line.** Word after word, page after page, front to back. You go *down* into a chapter, *across* its sections, and when a chapter ends you back *out* to the next chapter. That reading path touches every part of the book's tree, one piece at a time. **The reading order is the "linked-list walk"; the book's structure is the tree. Same book.** This is the `child` (go down) / `sibling` (go across) / `return` (back out) walk, in physical form.

Now the payoff, and it's the whole point of Fiber — **pausing is a bookmark:**

- You're reading (React is doing render work). You can **stop at any moment**, drop a **bookmark** on the page, close the book, and go answer the door (the browser paints a frame, handles a click). Later you reopen to the bookmark and **continue from the exact same spot.**
- That bookmark is the *only* thing React needs to pause: a single variable pointing at "the next fiber to process." Saving your place is free.

And **old recursion** was like a magic spell that forced you to absorb the *entire book in one blink* — you couldn't stop halfway, couldn't put a bookmark in, couldn't answer the door until the whole book was done. That "can't stop" is what froze the page. Fiber swaps the magic-blink for ordinary reading-with-a-bookmark. This is *why* the tree had to be re-wired with pointers: recursion + a `children:[]` array gives you no single "next step" and nowhere to put a bookmark; the threaded tree always has exactly one next step, so there's always a clean spot to stop.

---

## ⚙️ How it works (under the hood)

Fiber splits a render into **two phases**, and the split is the whole point.

### Phase 1 — the render phase (interruptible, no side effects)

This phase builds the new tree and figures out what changed (it *runs* the reconciliation from lesson 001). It happens in the **work loop**, which is just "keep reading until you run low on time, then bookmark and stop":

```js
// Conceptual work loop (React's real one is performUnitOfWork + workLoop):
while (nextFiber !== null && !timeSliceUsedUp()) {
  nextFiber = doOneFiber(nextFiber);   // process ONE node, return the next one
}
// If time ran out, nextFiber still points at where we stopped — that's the bookmark.
```

`doOneFiber` handles one node in two moments as it walks:

**Going *down* (`beginWork`):** run this component (call the function / `render()`), reconcile its children against the old fibers (create / update / mark-for-deletion), and return the **first child** as the next node. So the loop naturally goes deeper via `child`.

**Coming back *up* (`completeWork`):** when a node has no more children to process, "complete" it — for a real DOM element, this is where React builds the actual DOM node **off-screen** and sets its props. Then: if it has a **`sibling`**, that sibling is next (go across); otherwise follow **`return`** up to the parent and complete that (back out).

Down by `child`, across by `sibling`, up by `return` — reading the book, in code. After **each** node, the loop checks the time slice; if it's used up, it stops and hands the thread back, keeping the bookmark. That is the pause recursion could never give.

**The iron rule of this phase: no side effects the user can see.** It may be paused, resumed, restarted, or **thrown away entirely** if a more urgent update arrives. So it must be safe to run more than once. It only ever *decides* what should change — it builds fibers and tags each with `flags` ("this one needs inserting," "this one's text changed") — and touches nothing visible. (This is why React 18 Strict Mode runs your render function twice in development: render is *supposed* to be safe to repeat, so React double-runs it to catch impure code.)

### Phase 2 — the commit phase (synchronous, all changes, cannot pause)

Once the whole new tree is finished, React has a list of fibers tagged with what to do. The **commit phase** walks those tags and **applies every change to the real DOM in one quick, uninterruptible sweep**, then runs your effects (`componentDidMount/Update`, `useLayoutEffect` right away, `useEffect` just after the browser paints).

Commit is deliberately **not** pausable. Why the difference? Because a half-applied set of DOM changes *is* a broken screen — you'd see a page that's partly updated. Deciding what to change can be spread over many frames safely (it's invisible, off-screen); actually *changing the DOM* must happen all at once so the user only ever sees complete frames. This is the seam lesson 001 told you to remember: **decide slowly and pausably; apply all-at-once.**

### Double buffering — two copies of the same tree

Reminder: it was **always** a tree. The "fiber linked list" is that same tree, threaded with pointers. Double buffering just means React keeps **two copies** of it, connected by each fiber's `alternate` pointer:

- The **current** tree — what's on screen right now.
- The **work-in-progress** tree — the new version React is building for the next screen.

Back to the book: **you don't scribble edits on the copy a reader is holding.** You keep a **draft of the next edition**. You make *all* your changes in the draft — messy, half-finished, pages everywhere — and the reader sees none of it. Only when the new edition is **completely done** do you ship it, and it replaces the old one in one clean swap. The reader flips from a finished old edition straight to a finished new edition — **never a half-edited page.**

That's why pausing or abandoning a render is safe: the half-done mess is always in the *draft* (work-in-progress tree); the screen only ever shows a *finished* tree (current). Nothing new appeared in "double buffering" — there are simply two copies of the tree you already had, and React swaps which one is "current" only when the draft is fully finished.

### The two phases together

```
   ┌───────────── RENDER PHASE (pausable, no side effects) ─────────────┐
   │  work loop, one fiber at a time:                                   │
   │    beginWork    → run component, reconcile children, tag flags     │
   │    completeWork → build DOM node OFF-SCREEN, bubble tags up         │
   │    after EACH fiber: time slice used up? → bookmark & yield         │
   │  builds the DRAFT (work-in-progress) tree entirely off-screen       │
   └────────────────────────────────────────────────────────────────────┘
                             │  (whole draft finished)
                             ▼
   ┌───────────── COMMIT PHASE (all-at-once, cannot pause) ─────────────┐
   │  apply all tagged changes to the real DOM in one sweep             │
   │  run refs, componentDidMount/Update, useLayoutEffect                │
   │  SWAP: the draft becomes the "current" tree (ship the new edition)  │
   │  schedule useEffect to run right after the browser paints           │
   └────────────────────────────────────────────────────────────────────┘
```

### Where does Fiber "sit" on the main thread, and why is there no lag?

**Where it sits:** there's no extra thread and no magic. There's **one** JavaScript thread, and the browser runs work on it **by taking turns** (the event loop). The old way, React grabbed the thread and did *all* the render work in one turn, so the browser couldn't paint until React fully finished. Fiber does a **little** work, then **ends its turn early and hands the thread back**; the browser paints and handles input; then it calls React again to do a little more. "Pause" = React's loop stops and its function returns (keeping the bookmark). "Resume" = the browser schedules React again and it reads the bookmark. It's all cooperative turn-taking on one thread.

**Why you don't feel lag**, even though it sounds like a lot of machinery:

- It's **not extra work** — it's the *same* diffing React always did, just sliced into pieces. Slicing adds a little bookkeeping, not a second job.
- Each step (follow a pointer, compare two types) takes **nanoseconds**; a computer does hundreds of millions per second. Even a big app is a few thousand fibers — a sliver of one frame.
- The genuinely expensive thing is **touching the real DOM** (layout + paint). React's whole strategy is to do lots of cheap JS work to do the *minimum* expensive DOM work.
- **Yielding is what prevents lag:** even when total work is large, Fiber gives the thread back before the ~16ms frame deadline, so the browser keeps painting at 60fps. You don't feel a freeze *because* React refuses to hog the thread.
- **Most renders are tiny** anyway (a few nodes changed); the heavy machinery only shows up on big updates — exactly when you'd want it.

### What Fiber unlocked

Because render is now pausable, data-driven work instead of unstoppable recursion, React gained abilities that were literally impossible before:

- **Time-slicing:** spread a big render across many frames, yielding between fibers so the page stays smooth.
- **Priority / interruption:** a newer urgent update (a keystroke) can pause or discard an in-progress low-priority render (the draft is disposable). This is lesson 003.
- **Suspense:** a fiber can "suspend" because its data isn't ready, and React keeps showing the old tree and retries later — possible only because commit is separated from render.

Fiber is the **engine**. The *policies* that use it — what's urgent, when to yield — are lesson 003.

---

## 🛠️ How to implement it

You can't rebuild React here, but you can build its two essential mechanisms: (1) **turning a recursive tree walk into a pausable loop over a threaded tree**, and (2) **double buffering**. Do these and you've got Fiber in your hands.

### Step 1 — Feel the wall: recursion can't stop

```ts
// Recursive walk — cannot be paused. Once called, it runs to the very end.
function walkRecursive(node: any) {
  process(node);                       // "read this node"
  for (const child of node.children) {
    walkRecursive(child);              // engine owns the stack; no way to stop here
  }
}
```

There is genuinely no line you can add that lets the browser paint mid-walk. The control flow belongs to the engine, not you. That's the wall.

### Step 2 — Re-wire the tree as fibers (child / sibling / return)

```ts
type Fiber = {
  value: any;
  child: Fiber | null;    // first child   (go down)
  sibling: Fiber | null;  // next sibling  (go across)
  return: Fiber | null;   // parent        (go back up)
};

// Turn a normal { value, children:[] } tree into a threaded fiber tree.
function toFiber(node: any, parent: Fiber | null): Fiber {
  const fiber: Fiber = { value: node.value, child: null, sibling: null, return: parent };
  let prev: Fiber | null = null;
  for (const childNode of node.children ?? []) {
    const childFiber = toFiber(childNode, fiber);
    if (!prev) fiber.child = childFiber;   // first child hangs off `child`
    else prev.sibling = childFiber;        // the rest are chained via `sibling`
    prev = childFiber;
  }
  return fiber;
}
```

### Step 3 — Walk it as a LOOP with a bookmark (the trick)

```ts
// Depth-first walk as a loop: down via child, across via sibling, up via return.
function nextFiber(fiber: Fiber): Fiber | null {
  if (fiber.child) return fiber.child;           // 1. go down
  let current: Fiber | null = fiber;
  while (current) {
    if (current.sibling) return current.sibling; // 2. go across
    current = current.return;                    // 3. go up, then try sibling again
  }
  return null;                                    // walked the whole tree
}
```

### Step 4 — The pausable work loop (stop on a deadline, resume later)

```ts
let bookmark: Fiber | null = rootFiber;   // "the next fiber to process"

function workLoop(deadline: { timeRemaining(): number }) {
  // Read until we run low on time THIS frame...
  while (bookmark && deadline.timeRemaining() > 1) {
    process(bookmark.value);            // do this one node's work
    bookmark = nextFiber(bookmark);     // move the bookmark forward by ONE
  }
  if (bookmark) {
    // ...out of time but not out of work: yield, continue next idle period.
    requestIdleCallback(workLoop);      // React ships its own scheduler (lesson 003)
  } else {
    commit();                           // whole tree done → apply to DOM all at once
  }
}
requestIdleCallback(workLoop);
```

Because `bookmark` is just a variable pointing at the next fiber, pausing costs nothing: stop the loop, hand the thread back, and next time resume from `bookmark`. **That single change — a loop + a saved bookmark instead of recursion — *is* the Fiber breakthrough.**

### Step 5 — Double buffering in miniature

```ts
type Root = { current: Fiber };            // pointer to the on-screen tree

function render(root: Root, buildDraft: (old: Fiber) => Fiber) {
  const draft = buildDraft(root.current);  // build the new tree OFF-SCREEN
  // ...(the work loop fills in `draft` without touching root.current)...
  commitToDOM(draft);                      // apply all changes at once
  root.current = draft;                    // THE SWAP: the draft becomes "current"
  // the old current tree is now free to be reused as next render's draft
}
```

The user never sees `draft` while it's being built; they only ever see whatever `root.current` points at, and `current` only moves to a *fully finished* tree. That's how an interrupted render never shows a broken screen.

---

## ⚖️ Trade-offs, when to use, and pitfalls

**What Fiber cost, honestly:** more memory (two trees + one object per node) and a far more complex engine than plain recursion. React absorbed that complexity so you don't see it — but it's real, and it's why React's internals are hard to read.

**The render-purity rule — the pitfall that actually reaches you:** because render can be paused, restarted, or thrown away, your render logic (function bodies, `useMemo` calculations, the render half of the lifecycle) **must be pure**: no mutating outside variables, no side effects, no assuming a render will definitely commit. Mutate a ref or a module variable during render and an abandoned or repeated render can corrupt state or double-apply. This is *why* React 18 Strict Mode double-runs render functions in development — to surface impurity on purpose. The rule you already follow ("no side effects in render; put them in `useEffect`") is a *consequence* of Fiber's pausability, not an arbitrary style choice.

**Tearing (a subtle one):** if rendering can pause and resume, an external mutable store could change *between* two reads in the same render, so different parts of the screen show different versions of the same data (a "tear"). That's why React 18 added `useSyncExternalStore` — the safe way to subscribe to an outside store under concurrent rendering. You only need it when wiring up non-React state (Redux, Zustand, etc. use it internally).

**Don't over-conclude "Fiber makes React async":** by default most updates still render synchronously and commit right away. Fiber makes pausing *possible*; the *concurrent features* that actually use it are opt-in (lesson 003). Fiber is necessary for concurrency but not the same as it.

**When this matters to you:** you never call Fiber directly — it's the engine, not an API. It matters when you're reasoning about *why* React behaves as it does: why render must be pure, why effects run after paint, why Strict Mode double-runs things, why a huge synchronous render can still jank the page (work that never yielded), and why concurrent features (lesson 003) are even possible.

---

## 🧠 Q&A Bank

**1. How can the UI be a tree AND a "linked list"?**
It's one tree, wired with pointers. Instead of a parent holding a `children:[]` array, each fiber holds `child` (first child), `sibling` (next sibling), and `return` (parent). Those pointers let you walk the whole tree one node at a time along a single path — that walk is the "linked list." The shape is still a tree.

**2. Why re-wire the tree with pointers at all — what does it buy?**
A single "next node to visit" you can compute at every step, which means you can **stop between any two nodes and bookmark your place.** With recursion over a `children` array there's no single next step and nowhere to bookmark, so you can't pause.

**3. What is a fiber, in one sentence?**
A plain JavaScript object for one unit of rendering work (usually one element/component), holding what to render, its inputs/outputs, its priority, and the `child`/`sibling`/`return` pointers that thread it into the walkable tree.

**4. What was the "stack reconciler" and what was wrong with it?**
Pre-16 React's recursive reconciler that ran on the JS call stack. Recursion can't be paused, so once a render started it ran to the end, blocking the single main thread — freezing scroll, input, and animation, with no way to prioritize urgent updates.

**5. Where do "pause" and "resume" actually happen?**
On the one main thread, by turn-taking. "Pause" = React's work loop stops and its function returns, keeping a bookmark (a variable pointing at the next fiber); the browser then paints/handles input. "Resume" = the browser schedules React again and it continues from the bookmark. No extra threads.

**6. What are the two render phases and how do they differ?**
**Render phase:** builds the draft tree and decides what changed — pausable, restartable, side-effect-free. **Commit phase:** applies all changes to the real DOM and runs effects — synchronous and all-at-once, so the user never sees a half-updated screen.

**7. Why must the render phase have no side effects?**
Because it can be paused, repeated, or thrown away. A side effect during a render that gets discarded or run twice would corrupt state or fire twice. Side effects are deferred to commit / `useEffect`.

**8. What is double buffering here, and what does it prevent?**
Two copies of the same tree: `current` (on screen) and work-in-progress (the draft, built off-screen), linked by `alternate`. React builds the draft off-screen and swaps it in only when it's fully finished — so the user never sees a torn, half-built UI, even if a render was interrupted.

**9. If all this machinery runs on every update, why don't I feel lag?**
It's the same diffing work, just sliced — not extra work. Each step is nanoseconds; even big apps are a few thousand fibers. The expensive part (touching the DOM) is minimized by design, and yielding keeps the browser painting at 60fps. Most renders are tiny anyway.

**10. (History) Who built Fiber, when, and what was the core insight?**
Shipped in React 16 (September 2017), led principally by Andrew Clark (`acdlite`) with Sebastian Markbåge and others. The insight: reconciliation was stuck on the uncontrollable call stack, so they *rebuilt the call stack as data* — each unit of work became a fiber in a threaded tree — turning unstoppable recursion into a pausable loop (cooperative multitasking for rendering).

**11. Why the name "fiber"?**
In computing, a "fiber" is a lightweight unit of execution scheduled *cooperatively* — it runs until it voluntarily yields, unlike a thread the OS can interrupt. React's fibers run for a slice and then yield the thread back to the browser: cooperative multitasking in user space on the one JS thread.

---

## 🛠️ Hands-on Exercise

**Goal:** feel the pause/resume that recursion can't give you.

1. Build a deep tree (say 5,000 nodes) as `{ value, children: [] }`. Write a **recursive** walk that does a little fake work per node (a small busy-loop). Run it and try to type in an `<input>` while it runs — the input freezes.
2. Now convert the tree to fibers (`toFiber` above) and walk it with the **loop + bookmark** (`nextFiber`) inside a `workLoop` that yields via `requestIdleCallback` when time runs low. Do the *same* total work and type in the input again.
3. Observe: the loop version keeps the input responsive because it yields between fibers, even though it does the same total work.

**Hint:** the only real difference between the two is *who owns the control flow* — the JS engine (recursion) or your bookmark variable (loop). Log how many nodes you process per idle callback to *see* the work spread across frames.

---

## ✅ Recap

- It was **always one tree.** Fiber just wires that tree with `child` / `sibling` / `return` pointers so it can be **walked one node at a time** — that walk is the "linked list," not a flat line.
- Walking step-by-step means React can drop a **bookmark** (one variable), **stop**, let the browser breathe, and **continue** later — impossible with old recursion (the "absorb the whole book at once" spell), which is what froze the page.
- A render has two phases: **render** (pausable, restartable, **no side effects** — it only decides) and **commit** (all-at-once — it applies to the DOM).
- **Double buffering** = a **draft copy** of the same tree, built off-screen and swapped in only when finished — so an interrupted render never shows a broken screen.
- It all runs on **one thread taking turns**, and there's no lag because it's the same cheap diffing work, sliced small, with the thread handed back before each frame deadline. Fiber is the **engine**; the priority policy is lesson 003.

---

## 📎 Primary sources (optional)

The lesson above is self-contained — nothing here is required to understand Fiber. For the reader who wants the source material:

- **Andrew Clark (`acdlite`), "React Fiber Architecture"** — the canonical architecture notes (the reference for this lesson): `github.com/acdlite/react-fiber-architecture`.
- **Lin Clark, "A Cartoon Intro to Fiber", React Conf 2017** — the talk that popularized the mental model.
- **React docs** — component/render purity, Strict Mode double-rendering, and `useSyncExternalStore` all document behavior that follows from Fiber.
