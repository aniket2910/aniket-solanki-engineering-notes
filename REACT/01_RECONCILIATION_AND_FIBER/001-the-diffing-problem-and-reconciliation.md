# The Diffing Problem & Reconciliation

## 🎯 The Core Question

You wrote `count` and it was `0`. A user clicks, and now `count` should be `1`. Somewhere on screen is a `<span>0</span>` that must become `<span>1</span>`. **How does React figure out — cheaply, thousands of times a second — the smallest set of real DOM changes that turns the old screen into the new one, without you ever telling it what changed?**

That process has a name: **reconciliation**. It is the algorithm at the heart of React. Everything else — hooks, Suspense, concurrent rendering — is scaffolding around this one idea: *compare two trees, and touch the DOM as little as possible.*

---

## 📜 The Origin Story (history & the thinking behind it)

### The world before: you moved the DOM by hand

To feel why React exists, you have to feel the pain it was born from. Before React (roughly 2010–2013), building a dynamic web UI meant **imperative DOM manipulation**. You didn't describe *what the screen should look like*; you wrote step-by-step instructions to *mutate* it.

With jQuery, a "increment a counter" feature looked like this:

```js
// The old world: you are the reconciliation algorithm.
$("#count").text(newCount);
if (newCount > 10) {
  $("#count").addClass("warning");
} else {
  $("#count").removeClass("warning");
}
if (newCount === 0) {
  $("#reset-btn").prop("disabled", true);
} else {
  $("#reset-btn").prop("disabled", false);
}
```

Notice what you are doing: you are personally computing the *difference* between the old UI and the new one, and applying each patch by hand. For a counter it's annoying. For a trading dashboard with hundreds of interdependent widgets it is a nightmare — a swamp of "when X changes, remember to also update Y and Z." Bugs lived in the gaps: the case you forgot to handle, the class you forgot to remove. The UI and the data **drifted out of sync**, because keeping them in sync was *your* manual job.

The deep problem: **the DOM has no memory of your intent.** It only knows its current state. So every update forced you to reason about "current state → desired state" transitions, by hand, forever.

### The insight: make UI a pure function, and let the machine diff

React's founding idea (Jordan Walke at Facebook, first used internally in Facebook's Ads product around 2011, open-sourced May 2013) was to flip this around. What if you never describe *transitions* at all? What if, on every change, you just re-describe **the entire UI as it should look right now**, as a pure function of your data:

```
UI = f(state)
```

Every time `state` changes, you call `f` again and get a *fresh, complete description* of the whole UI. You, the developer, never touch the DOM. You never think about diffs. You just answer one question — "given this data, what should the screen be?" — over and over.

This is **declarative** UI, and it is gorgeous for the programmer. But it creates one enormous engineering problem, and solving that problem *is* React:

**If the developer hands you a brand-new description of the entire UI on every single keystroke, you cannot naively rebuild the entire DOM every time. The DOM is slow.** Blowing away and recreating thousands of nodes 60 times a second would make the page unusable, and would destroy things the browser holds for you — scroll position, text selection, focus, input state.

So React needs to take *two full UI descriptions* — "what's on screen now" and "what should be on screen next" — and compute the **minimal edit** between them. That comparison is reconciliation. The declarative dream (`UI = f(state)`) is only affordable if the diffing underneath it is fast.

### The theoretical wall: diffing trees is brutally expensive

A UI is a **tree** (a `<div>` containing a `<ul>` containing `<li>`s…). So "find the minimal changes between old UI and new UI" is formally the **tree edit distance** problem: given two ordered, labeled trees, what is the cheapest sequence of insert / delete / relabel operations that turns one into the other?

This is a genuinely studied problem in computer science, and the news is bad. The problem was formalized by **Kuo-Chung Tai in 1979** ("The Tree-to-Tree Correction Problem", *Journal of the ACM*). Decades of work followed. The best *general* algorithms for optimal tree edit distance run in around **O(n³)** time for `n` nodes (the classic Zhang–Shasha algorithm of 1989 is O(n³) in the worst case; later work shaved constants but the cube is roughly the wall).

Do the arithmetic on why that's fatal. A modest UI has ~1,000 nodes. `n³` is **one billion** operations — per render. At 60 renders a second that's 60 billion operations a second just to *diff*. Completely impossible.

React's designers stared at this wall and made the decisive move: **refuse to solve the general problem.** They wrote (this is paraphrased from React's own reconciliation documentation): the state-of-the-art optimal algorithms are O(n³), so instead React implements a **heuristic** O(n) algorithm based on two assumptions that are almost always true of real user interfaces. They traded *provable optimality* for *linear speed* — and it was exactly the right trade, because in real apps those two assumptions hold overwhelmingly often.

That trade — **give up on the perfect diff to get a fast-enough diff** — is the intellectual core of React's algorithm. The rest of this lesson is those two assumptions and what they buy.

---

## 💢 Why it exists (the pain it solves)

Without reconciliation you are back in jQuery-land, hand-patching the DOM and hand-tracking every dependency between your data and your pixels. Reconciliation lets you write `UI = f(state)` — re-describe everything, every time — and *still* get a fast app, because React quietly computes the tiny real diff for you. It removes an entire category of bug (UI drifting out of sync with data) and an entire category of tedious labor (manual DOM surgery).

The specific limitation it removes: **the O(n³) cost of comparing two trees correctly.** By accepting two reasonable assumptions, React turns an impossible cubic problem into a cheap linear walk.

---

## 🧩 What it is

**Reconciliation** is the algorithm React uses to compare a newly produced element tree (what the UI *should* be) against the previously rendered one (what the UI *is*), and to compute the minimal set of mutations to apply to the host tree (the real DOM). It is **not** the DOM update itself — it is the *decision* about what the DOM update should be.

**Precise definition:** given the previous tree and the next tree, reconciliation walks both **level by level, in parallel**, and at each position decides one of: *keep and update this node*, *replace it wholesale*, or *insert / delete / move* it — using node **type** and node **key** as the signals for "is this the same node as before?"

### Mental model: React never touches the real DOM to *think*

React keeps a lightweight in-memory description of the UI — the tree of **React elements** produced by your JSX (`React.createElement(...)` calls). This is the "virtual DOM": plain JavaScript objects, cheap to create and cheap to compare. React does all its *thinking* on these cheap objects, and only at the very end translates its conclusions into a small number of expensive real-DOM operations.

Think of it as: **draft on scrap paper, then make one clean edit to the master copy.** The scrap paper (virtual DOM) is free to scribble on; the master copy (real DOM) is expensive, so you only write to it once you know exactly what to change.

### Real-world analogy: the theatre stage manager

Imagine a stage manager comparing two scene layouts — "the stage as it's set right now" and "the stage as the next scene needs it." A naïve manager tears down the whole set between every scene and rebuilds from scratch: slow, and the audience sees chaos. A smart stage manager walks the two layouts **position by position**:

- Position 1: a chair is there now, a chair is needed next → **leave it, maybe repaint it.** (same type → update in place)
- Position 2: a table is there now, a bookshelf is needed next → **table out, bookshelf in.** (different type → replace)
- The row of identical lamps got reordered → without name-tags, the manager can't tell which lamp is which and pointlessly reshuffles all of them. With a **name-tag on each lamp** (a `key`), the manager instantly sees "lamp C just moved to the front" and moves only that one.

React is the smart stage manager. Node **type** is "chair vs bookshelf." Node **key** is the name-tag on otherwise-identical items in a list.

---

## ⚙️ How it works (under the hood)

Reconciliation rests on the **two assumptions** React chose, which collapse the cubic problem to linear:

**Assumption 1 — Two elements of different types produce entirely different trees.**
If a node was a `<div>` and now it's a `<span>` (or `<Article>` and now `<Comment>`), React does **not** try to cleverly diff their children to salvage matches. It assumes the whole subtree is different, throws the old one away, and builds the new one fresh. This is what lets React skip the expensive cross-subtree matching that makes the general algorithm cubic.

**Assumption 2 — The developer can hint stable identity across renders with a `key`.**
For children in a list, React can't guess which new item corresponds to which old item just from position. A `key` is a promise from you: "this element is *the same logical thing* as the one that had this key last time, even if it moved." Keys turn an ambiguous many-to-many matching problem into a cheap dictionary lookup.

Now the algorithm itself. React walks the two trees together and, **at each pair of nodes in the same position**, applies this decision procedure:

### Step 1 — Compare the element *type* at this position

```
old node type   vs   new node type
```

**Case A — types differ** (`div` → `span`, or `<Foo>` → `<Bar>`):
React tears down the old node and its **entire subtree** (unmounting components, running cleanup, discarding DOM) and mounts the new subtree from scratch. It does **not** look inside to find reusable pieces. A component instance under the old node is destroyed — its state is gone.

```
BEFORE            AFTER            RESULT
  <div>             <span>          rip out <div> + everything under it,
    <Counter/>        <Counter/>    build fresh <span> + a NEW <Counter/>
  </div>            </span>         (Counter's state is LOST — different parent type)
```

**Case B — types are the same** (`div` → `div`, or `<Foo>` → `<Foo>`):
React **keeps the same underlying DOM node / component instance** and just updates it:

- For a host element (`<div className="a">` → `<div className="b">`): keep the DOM node, diff the **attributes**, and only patch the ones that changed (`className` here). Untouched attributes are left alone. Then recurse into children.
- For a component (`<Message text="hi">` → `<Message text="bye">`): keep the instance and its state, feed it the new props, let it re-render, and reconcile *its* output.

This is why **element type identity matters so much** and why you must never define a component *inside* another component's render — a new function identity every render reads as "different type," nuking and rebuilding the subtree (and its state) every time.

### Step 2 — Recurse into children (and here's where keys earn their keep)

When two matched parents have lists of children, React iterates both child lists **together**.

**Without keys**, React pairs children up **by index**: old[0] with new[0], old[1] with new[1], and so on. This is fine when the list only grows or shrinks at the end:

```
old:  [A, B]
new:  [A, B, C]
→ A matches A (update), B matches B (update), C is new (insert). Cheap and correct. ✅
```

But index-pairing is a disaster when you **insert at the front**:

```
old:  [B, C]
new:  [A, B, C]
index pairing:
  new A  ↔  old B   → same type <li>? yes → "update B's DOM to look like A"
  new B  ↔  old C   → "update C's DOM to look like B"
  new C  ↔  (none)  → insert
→ React mutates EVERY node instead of just inserting one at the front. ❌ Slow, and it
  corrupts per-node state: the DOM node that *was* B is now relabeled A, so B's input
  focus / cursor / scroll now belongs to A.
```

React reasoned by type (`<li>` == `<li>`), so it "reused" the wrong nodes.

**With keys**, React pairs children by key, not by index:

```
old:  [ {key:"b"} , {key:"c"} ]
new:  [ {key:"a"} , {key:"b"} , {key:"c"} ]
→ key "b" existed → reuse old B's node (update in place)
→ key "c" existed → reuse old C's node (update in place)
→ key "a" is new  → insert one node at the front
→ Exactly one DOM insertion. ✅ B and C keep their state, focus, scroll.
```

The key transforms child reconciliation from "guess by position" into "look it up by identity." That's why **`key` must be stable, unique among siblings, and predictable** — and why using the array **index as a key defeats the entire mechanism** (the index of an item changes when you insert/reorder, so the "identity" isn't stable and you're back to index-pairing's bugs).

### The whole walk, at a glance

```
reconcile(oldNode, newNode):
  if oldNode.type !== newNode.type:
      unmount(oldNode subtree); mount(newNode subtree); return   // Assumption 1
  else:
      keep the DOM node / component instance
      patch only the changed props/attributes
      // children, matched by key when present, else by index:
      for each child position:
          reconcile(oldChild, newChild)   // recurse
```

Every node is visited a constant number of times → the walk is **O(n)** in the number of nodes. That linear cost is the entire payoff of the two assumptions.

### One crucial subtlety: reconciliation only *decides*; it doesn't *paint*

The walk above produces a **list of changes** ("update this text", "insert this node", "remove that one"). Applying those changes to the real DOM is a separate, later step. Holding those two apart — *deciding* what to change vs *doing* the change — is exactly the seam that the Fiber architecture (next lesson) pries open to make rendering interruptible. Keep that seam in mind; it's the bridge to lesson 002.

---

## 🛠️ How to implement it

Let's build a tiny reconciler so the algorithm stops being abstract. We'll model elements as plain objects (React's real elements are close to this) and write a `diff` that emits patches. Naïve first, then the type check, then keys.

### Step 0 — Represent elements as cheap objects (the "virtual DOM")

```ts
// A virtual node: what your JSX compiles down to.
type VNode = {
  type: string;                 // "div", "span", "li"...
  props: Record<string, any>;   // attributes like { className: "a" }
  children: VNode[];
  key?: string | number;        // optional stable identity hint
};

function h(type: string, props: Record<string, any> = {}, children: VNode[] = []): VNode {
  return { type, props, children, key: props.key };
}
```

### Step 1 — The patch types we can emit

```ts
type Patch =
  | { op: "REPLACE"; node: VNode }                         // rip out & rebuild
  | { op: "UPDATE_PROPS"; changed: Record<string, any> }   // patch attributes only
  | { op: "REMOVE" }
  | { op: "INSERT"; node: VNode };
```

### Step 2 — Diff a single node (Assumption 1 lives here)

```ts
function diffNode(oldN: VNode | undefined, newN: VNode | undefined): Patch | null {
  if (!oldN && newN) return { op: "INSERT", node: newN };
  if (oldN && !newN) return { op: "REMOVE" };
  if (!oldN || !newN) return null;

  // Assumption 1: different type ⇒ different tree, don't try to be clever.
  if (oldN.type !== newN.type) {
    return { op: "REPLACE", node: newN };
  }

  // Same type ⇒ keep the node, patch only the props that actually changed.
  const changed: Record<string, any> = {};
  const allKeys = new Set([...Object.keys(oldN.props), ...Object.keys(newN.props)]);
  for (const k of allKeys) {
    if (k === "key") continue;
    if (oldN.props[k] !== newN.props[k]) changed[k] = newN.props[k];
  }
  return Object.keys(changed).length ? { op: "UPDATE_PROPS", changed } : null;
}
```

### Step 3 — Diff children BY INDEX (the naïve version — watch it fail)

```ts
function diffChildrenByIndex(oldC: VNode[], newC: VNode[]) {
  const patches: { index: number; patch: Patch | null }[] = [];
  const max = Math.max(oldC.length, newC.length);
  for (let i = 0; i < max; i++) {
    patches.push({ index: i, patch: diffNode(oldC[i], newC[i]) });
  }
  return patches;
}

// Insert "A" at the FRONT of a list:
const before = [h("li", { key: "b" }), h("li", { key: "c" })];
const after  = [h("li", { key: "a" }), h("li", { key: "b" }), h("li", { key: "c" })];

console.log(diffChildrenByIndex(before, after));
// index 0: UPDATE_PROPS (turns old "b" node into "a")   ← wrong node reused
// index 1: UPDATE_PROPS (turns old "c" node into "b")   ← wrong node reused
// index 2: INSERT
// Three DOM touches for what should be ONE insertion. This is the bug keys fix.
```

### Step 4 — Diff children BY KEY (the real version)

```ts
function diffChildrenByKey(oldC: VNode[], newC: VNode[]) {
  const ops: Patch[] = [];

  // Index the old children by key for O(1) lookup.
  const oldByKey = new Map<string | number, VNode>();
  for (const c of oldC) if (c.key != null) oldByKey.set(c.key, c);

  for (const next of newC) {
    const prev = next.key != null ? oldByKey.get(next.key) : undefined;
    if (prev) {
      const p = diffNode(prev, next);      // matched by identity → update in place
      if (p) ops.push(p);
      oldByKey.delete(next.key!);          // consumed
    } else {
      ops.push({ op: "INSERT", node: next }); // genuinely new
    }
  }
  // Anything left in oldByKey was in the old list but not the new one → gone.
  for (const leftover of oldByKey.values()) ops.push({ op: "REMOVE" });
  return ops;
}

console.log(diffChildrenByKey(before, after));
// "b" found → no-op (identical), "c" found → no-op, "a" not found → INSERT.
// Exactly ONE INSERT. B and C keep their real DOM nodes, focus, and scroll. ✅
```

The two `diffChildren` functions are the same shape; the only difference is **matching by index vs matching by key**, and that single difference is the entire practical lesson of `key`. React does exactly this kind of keyed matching (with extra bookkeeping to also detect *moves*, not just insert/remove).

---

## ⚖️ Trade-offs, when to use, and pitfalls

**The trade React made:** correctness-optimality for speed. React's diff is a *heuristic*, not the mathematically minimal edit. In rare adversarial cases it does more DOM work than a perfect O(n³) diff would — but on real UIs, where the two assumptions hold, it's linear and effectively free. This is a textbook example of choosing the right algorithm for the *actual* input distribution instead of the worst case.

**When it bites you (pitfalls):**

- **Array index as `key`.** The single most common React performance/state bug. Indexes are stable only if the list never reorders or has items inserted/removed anywhere but the end. Otherwise identities shift and you get the index-pairing bug: wrong nodes reused, per-row input state jumping to the wrong row. Use a stable domain id (`todo.id`), not `i`.
- **Defining a component inside another component.** `function Parent(){ function Child(){...}; return <Child/> }` creates a *new* `Child` function identity every render → different type → Assumption 1 fires → the subtree and all its state are destroyed and rebuilt every render. Hoist components to module scope.
- **Changing a wrapper's type to "reset" a subtree — on purpose.** The flip side: because different types blow away state, you can *deliberately* remount a component (clearing its state) by changing its `key`. `<Profile key={userId} />` gives each user a fresh Profile with fresh state. This is a feature, once you understand the mechanism.
- **Expecting cross-subtree matching.** Moving a node from one parent to a *different* parent doesn't preserve it — React only matches within the same parent's child list. Different position in the tree ⇒ treated as unmount + mount.

**When to reach for the mental model:** any time you're debugging "why did my input lose focus / why did my component's state reset / why is this list slow." The answer is almost always the reconciliation rules above — a type that changed, or a key that wasn't stable.

---

## 🧠 Q&A Bank

**1. In one sentence, what is reconciliation?**
The algorithm React uses to compare the newly rendered element tree with the previous one and compute the minimal set of real-DOM changes needed to make them match.

**2. Why doesn't React use the optimal tree-diffing algorithm?**
Because optimal tree edit distance is about O(n³). For a 1,000-node UI that's a billion operations per render — impossible at 60fps. React instead uses two heuristic assumptions to get an O(n) algorithm that's near-optimal on real UIs.

**3. What are the two assumptions React's diff relies on?**
(1) Two elements of *different types* produce entirely different trees (so React discards the old subtree instead of trying to match into it). (2) The developer can mark elements with a stable `key` to hint identity across renders.

**4. What exactly happens when a node's type changes from `<div>` to `<span>`?**
React unmounts the old node and its entire subtree (running cleanup, discarding DOM and any component state inside), then mounts the new subtree from scratch. It does *not* attempt to reuse anything inside.

**5. Why is using the array index as a `key` a bug, and when is it *not*?**
The index changes when items are inserted, removed, or reordered anywhere but the end, so it isn't a *stable* identity — React ends up pairing new items with the wrong old nodes, wasting DOM work and misattributing per-node state (focus, input text). It's acceptable only for a static list that never reorders and never changes length except at the end.

**6. What happens if you define a component inside another component's body?**
Every render creates a new function identity for the inner component, which React sees as a *different type* → it destroys and rebuilds that subtree (and all its state) on every render. Always hoist components to module scope.

**7. "Virtual DOM" — what does that phrase actually mean, and why is it faster?**
It's React's in-memory tree of plain JavaScript element objects describing the UI. It's not inherently faster than the DOM at rendering; it's faster to *diff*. React does all its comparison on these cheap objects and only translates the conclusion into a small number of expensive real-DOM writes.

**8. (Why) Does reconciliation update the DOM itself?**
No — it only *decides* the changes, producing a list of patches. Actually applying them to the host DOM is a separate later step. Keeping "decide" and "apply" apart is what makes it possible (in Fiber) to pause and resume the deciding phase without leaving the DOM half-updated.

**9. (What happens if…) You give two sibling list items the same key?**
Keys must be unique among siblings. Duplicate keys make identity ambiguous — React can't tell the siblings apart, warns in the console, and may reuse or drop the wrong nodes, corrupting state and order.

**10. (History) Where does the O(n³) figure come from, and what did React choose instead?**
It comes from the classic tree edit distance problem (formalized by Tai in 1979; the well-known Zhang–Shasha algorithm is O(n³)). React explicitly declined to solve the general problem and adopted an O(n) heuristic keyed on element type and the `key` prop — trading provable optimality for linear speed on realistic inputs.

---

## 🛠️ Hands-on Exercise

**Goal:** prove the keys bug to yourself, then fix it, *without React*.

Extend the tiny reconciler above so that patches carry enough info to actually mutate a real DOM `<ul>`:

1. Build a real `<ul>` in a page from an initial list `[{id:"b"}, {id:"c"}]`, rendering each item as an `<li>` containing an `<input>`.
2. Type something into the first input, then re-render with `[{id:"a"}, {id:"b"}, {id:"c"}]` using your **index-based** `diffChildren`. Observe: the text you typed jumps to the wrong row (or the wrong node gets reused).
3. Swap in your **key-based** `diffChildren` and re-run. The typed text should now stay put and only one `<li>` should be inserted at the front.

**Hint:** the whole lesson is visible in one observation — with index matching, `UPDATE_PROPS` patches fire on rows that didn't actually change; with key matching, only a single `INSERT` fires. Log the emitted patch list in both modes and compare the counts.

---

## ✅ Recap

- **`UI = f(state)`** (declarative UI) is only affordable because React diffs the old and new trees for you — that diff is **reconciliation**.
- Optimal tree diffing is **~O(n³)**; React deliberately uses a **heuristic O(n)** algorithm instead, resting on **two assumptions**.
- **Assumption 1:** different element *type* ⇒ discard and rebuild the subtree (this is why type identity is sacred, and why in-render component definitions nuke state).
- **Assumption 2:** a stable **`key`** turns child matching from fragile index-pairing into O(1) identity lookup (this is why index-as-key is a classic bug).
- Reconciliation only **decides** the changes; **applying** them is a separate phase — the seam that Fiber exploits to make rendering interruptible (lesson 002).

---

## 📎 Primary sources (optional)

The lesson above is complete on its own — nothing here is required to understand reconciliation. These are for the curious reader who wants to see the source material directly:

- **React docs — "Reconciliation"** (the official write-up of the two assumptions and the O(n³)→O(n) trade): `react.dev` / legacy `reactjs.org/docs/reconciliation.html`.
- **Kuo-Chung Tai, "The Tree-to-Tree Correction Problem", Journal of the ACM, 1979** — the paper that formalized tree edit distance.
- **Zhang & Shasha, 1989** — the classic O(n³) ordered-tree edit-distance algorithm often cited for the cubic bound.
