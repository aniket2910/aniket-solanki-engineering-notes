# Scheduling, Priorities & Concurrency

## 🎯 The Core Question

Lesson 002 gave React an engine that *can* pause and resume rendering. But a capability isn't a decision. Being *able* to pause raises three new questions the engine can't answer by itself: **When should React pause? Which update deserves to run first when several are pending? And how does React keep the screen consistent when a render might be interrupted, deferred, or thrown away partway through?**

This is the **scheduling** layer — the policy brain that sits on top of the Fiber engine. It's what turns "interruptible rendering is possible" into the concrete, user-visible superpowers of **Concurrent React**: typing that never stutters, expensive views that update without blocking, and loading states you can orchestrate. This lesson is about the *decisions*, not the mechanism.

---

## 📜 The Origin Story (history & the thinking behind it)

### The realization: an engine needs a driver

When Fiber shipped in React 16 (2017), it delivered the *ability* to break rendering into interruptible units — but React 16 still, by default, did all its rendering **synchronously**. The engine could pause; nothing yet told it to. The team had deliberately shipped the hard architectural rewrite first and left the *scheduling policy* — the part that actually decides when to yield and what to prioritize — to mature separately. For years this was branded "Async Mode," then renamed **"Concurrent Mode,"** and finally, after a long incubation, shipped as opt-in **concurrent features** in **React 18 (March 2022)** — not a mode you flip on, but specific APIs (`startTransition`, `useDeferredValue`, Suspense) that quietly use the concurrent scheduler underneath.

The long gestation wasn't indecision — it was that scheduling UI work correctly is genuinely hard, and getting it wrong (tearing, starvation, wrong priorities) breaks apps in subtle ways. The history here is a lesson in itself: **build the mechanism, then spend years getting the policy right.**

### Why React built its *own* scheduler instead of using the browser's

The browser already offers `requestIdleCallback` — "call me when the main thread is idle." Early Fiber prototypes used exactly that (you saw it in lesson 002's toy loop). But the React team found it insufficient in practice, for concrete reasons: `requestIdleCallback` fires too infrequently and unpredictably, its notion of "idle" doesn't match rendering needs, and it has browser inconsistencies. So they wrote a **standalone `scheduler` package** — a user-space cooperative scheduler — that yields to the browser using `MessageChannel` to schedule a macrotask (which lets the browser paint and handle input between work chunks) and enforces a small time budget (a slice on the order of a few milliseconds) after which React yields. The mental takeaway: **React ships its own tiny cooperative scheduler because the platform didn't give it one precise enough for UI.** That scheduler is a general priority queue of tasks; React's reconciler is just its most important client.

### The insight that reframes the whole problem: not all updates are equal

The core idea driving everything in this lesson is one observation about human perception. Some updates must feel **instant** or the app feels broken — typing a character, toggling a checkbox, a hover. Other updates can be **slightly late** and no human will notice — re-filtering a 10,000-row table, re-rendering an off-screen tab, showing search results. The old synchronous React treated these identically: every update was "do it all, now, blocking." The concurrent insight is to **let the developer (and React) label updates by urgency, and let urgent updates interrupt non-urgent ones.** That single reframing — *updates have priority* — is what the entire scheduling layer exists to implement.

---

## 💢 Why it exists (the pain it solves)

Even with Fiber's interruptible engine, without a scheduling policy React would still, by default, render every update synchronously and block on the expensive ones. The classic pain: **a search box over a huge list.** Every keystroke triggers a re-render of thousands of rows. If that render is synchronous and urgent, the keystroke itself lags — you type "react" and see "r… ea… ct" appear in stutters, because rendering the results is blocking the input from updating. The work isn't wrong; its **priority** is wrong. The keystroke (update the input) is urgent; recomputing the list (show new results) is not.

The scheduling layer exists to express and enforce that difference: keep the input instant, and let the expensive list render happen in the background, interruptibly, without ever blocking what the user is directly interacting with. It also solves **consistency under interruption** (tearing) and **starvation** (making sure a low-priority update eventually runs even while high-priority ones keep arriving).

---

## 🧩 What it is

**Scheduling** is the layer that assigns every update a **priority**, keeps a queue of pending work, decides **what to render next and when to yield**, and guarantees the committed screen is always **consistent**. In React 18 the priority mechanism is called **lanes**. The developer-facing surface is a small set of **concurrent features**: `startTransition` / `useTransition`, `useDeferredValue`, and `<Suspense>`.

**Precise framing:** React classifies updates roughly as **urgent** (discrete input: typing, clicking — must render synchronously/immediately) vs **transition / deferred** (can be interrupted and rendered in the background). It renders urgent work first and eagerly; it renders transition work with the interruptible Fiber loop, yielding to keep urgent work and the browser responsive, and discarding in-progress transition renders if a newer urgent update arrives.

### Mental model: lanes are a hospital triage system

Think of an emergency room. Patients (updates) arrive constantly. A triage nurse assigns each a **priority level** — a "lane": *life-threatening* (a keystroke) jumps ahead of everyone; *stable, can wait* (a background list refresh) goes in a lower lane. The ER works the highest-priority patients first, can **interrupt** low-priority treatment when a critical case arrives, but also ensures a low-priority patient doesn't wait *forever* (starvation) by eventually bumping their priority. Crucially, patients in the *same* lane can be treated **in one batch**. React's **lanes** are literally this: a priority model where each update is tagged with a lane, higher lanes preempt lower ones, same-lane updates batch together, and a starving low lane eventually gets escalated so it isn't ignored indefinitely.

**Why the word "lanes"?** They're implemented as a **bitmask** — a 31-bit integer where each bit is one lane. Representing the set of pending priorities as bits lets React combine and test priorities with fast bitwise operations (`&`, `|`), and it can express *sets* of lanes (several priorities pending at once) in a single integer. This replaced React's earlier "expiration time" number model (used in early concurrent prototypes) because bitmasks express overlapping priorities and batching far more naturally than a single timestamp could.

### Real-world analogy: the restaurant kitchen, revisited with a expo

Lesson 002 had one chef working a ticket rail. Now add an **expediter** (the scheduler) standing at the rail. When a VIP's "the steak is cold, fix it now" ticket (urgent input) lands, the expediter tells the chef to pause the big banquet prep (a transition) and handle the VIP first, then resume the banquet. The expediter also makes sure the banquet — low priority — doesn't sit forever if VIPs keep coming; after long enough it gets forced through. The chef (Fiber engine) can pause between tickets; the expediter (scheduler) decides *which* ticket is next and *when* to make the chef glance up.

---

## ⚙️ How it works (under the hood)

### Step 1 — Every update gets a lane

When you call `setState` (via `useState`'s setter, `dispatch`, etc.), React looks at the **context** in which it happened and assigns the update a lane:

- Inside a **discrete event** (click, keydown, input) → a high-priority lane (`SyncLane` / discrete input). Must feel instant.
- Inside **`startTransition(() => setState(...))`** → a low-priority **transition lane**. Explicitly marked "this can wait / be interrupted."
- Other sources (default updates, effects, retries after Suspense) → their own lanes in between.

The lane is stored on the fiber (`fiber.lanes`) and bubbled up so React knows which lanes have pending work in which parts of the tree.

### Step 2 — The scheduler picks the highest-priority pending lane and renders it

React asks: of all lanes with pending work, which is the most urgent? It renders that lane's work through the Fiber work loop from lesson 002. For urgent lanes it renders synchronously (don't yield — get it on screen now). For transition lanes it renders **concurrently**: the work loop checks the scheduler's time budget after each fiber and **yields to the browser** when the slice is used up, so the page keeps painting and stays responsive while the big render proceeds in the background.

### Step 3 — Interruption: urgent work preempts a transition

Here's the payoff scenario, traced concretely. You have a search input over a huge list, and you write:

```
onChange = (e) => {
  setText(e.target.value);                 // URGENT: update the input box
  startTransition(() => {
    setResults(filterHugeList(e.target.value)); // TRANSITION: can be interrupted
  });
}
```

Type "r": React commits the urgent `setText` immediately (input shows "r"), then begins rendering the transition (filtering the list) in the background, yielding between fibers. Before that big render finishes, you type "e". A **new urgent update** arrives. React:

1. **pauses/throws away** the in-progress transition render for "r" (it was off-screen work-in-progress — disposable, per lesson 002's double buffering),
2. commits the urgent `setText("re")` (input instantly shows "re"),
3. **restarts** the transition render for the *newer* value "re".

The user sees the input keep up with every keystroke, while the expensive results list updates a beat later and never blocks typing. That is the entire promise of concurrent rendering, and it's impossible without both the interruptible engine (002) *and* the priority policy (this lesson).

### Step 4 — Consistency: no tearing, and atomic commits

Because a transition render can be interrupted and resumed across frames, React must ensure the **committed** result is internally consistent — you never commit a tree that mixes "half the old value, half the new." Two guarantees do this:

- **Commit is still atomic** (lesson 002): only a fully-finished tree is committed and shown. An interrupted render never reaches the screen; it's discarded or restarted.
- **`useSyncExternalStore`** for external mutable stores: since an interruptible render could read an external store at two different moments and see two different values (a *tear*), React 18 provides this hook so store reads stay consistent within a render. You need it only when wiring up a non-React store (Redux, Zustand, etc. use it internally).

### Step 5 — Starvation control: expiration

A pure "always do the highest priority first" policy has a failure mode: if urgent updates keep arriving, a low-priority transition might **never** run. React guards against this by giving lower-priority lanes an **expiration** — if a lane has waited too long, React escalates it and forces it through synchronously so it can't starve. The triage nurse eventually admits the patient who's been waiting all day.

### Where the concurrent features plug in

```
   You write:                          React assigns:            Engine behavior:
   ─────────────────────────────────   ──────────────────────    ────────────────────────
   setState in a click/keydown    ──▶  urgent lane          ──▶  render sync, commit ASAP
   startTransition(() => setState)──▶  transition lane      ──▶  render concurrently, yield,
   useTransition() [isPending]         (+ isPending flag)         interruptible/restartable
   useDeferredValue(value)        ──▶  derives a low-prio    ──▶  urgent part uses new value,
                                        copy of the value          deferred copy lags, interruptible
   <Suspense fallback>            ──▶  a fiber can "suspend" ──▶  keep old UI / show fallback,
                                        pending its data           retry when data resolves
```

- **`startTransition` / `useTransition`** — the explicit "this update is non-urgent" marker. `useTransition` also gives you `isPending` so you can show a subtle "updating…" state while the background render is in flight.
- **`useDeferredValue`** — "let this value lag behind." React keeps rendering with the old value at high priority and renders the new value at low, interruptible priority — same effect as a transition but for a derived value you don't control the setter of.
- **`<Suspense>`** — lets a component **suspend** (declaratively say "my data isn't ready") while React shows a fallback and keeps the rest of the app interactive, retrying when the data arrives. Feasible only because commit is decoupled from render (002) and rendering can be deferred (this lesson).
- **Automatic batching (React 18)** — a related scheduling win: React 18 batches *all* state updates that happen in the same tick (including inside promises, `setTimeout`, and native event handlers), not just those inside React event handlers as before — fewer renders, driven by the same scheduler.

---

## 🛠️ How to implement it

You won't rebuild React's scheduler, but you can build its **essence**: a priority queue that does the highest-priority work first, yields to keep the main thread responsive, and can drop stale low-priority work when newer work supersedes it.

### Step 1 — A tiny priority scheduler that yields

```ts
type Task = { priority: number; run: () => void };   // lower number = more urgent

const queue: Task[] = [];

function schedule(task: Task) {
  queue.push(task);
  queue.sort((a, b) => a.priority - b.priority);      // urgent first (React uses a heap)
  ensureFlush();
}

let scheduled = false;
function ensureFlush() {
  if (scheduled) return;
  scheduled = true;
  // MessageChannel schedules a macrotask, letting the browser paint/handle input
  // between chunks — this is exactly how React's scheduler yields.
  const { port1, port2 } = new MessageChannel();
  port1.onmessage = flushWork;
  port2.postMessage(null);
}

function flushWork() {
  const start = performance.now();
  // Do work until our small time slice is used up, then YIELD.
  while (queue.length && performance.now() - start < 5 /* ms budget */) {
    queue.shift()!.run();
  }
  scheduled = false;
  if (queue.length) ensureFlush();   // more work left → yield now, continue next macrotask
}
```

That's the whole shape of a cooperative scheduler: **highest priority first, bounded time slice, yield via a macrotask so the browser can breathe.** React's real one adds a proper min-heap and multiple priority levels, but this is the idea.

### Step 2 — Urgent-preempts-transition, modeled

```ts
let currentText = "";
let pendingTransitionId = 0;                 // token to invalidate stale transitions

function onInput(value: string) {
  // URGENT: update the input immediately, highest priority.
  currentText = value;
  schedule({ priority: 0, run: () => renderInput(currentText) });

  // TRANSITION: filter the huge list at low priority, and make it CANCELLABLE.
  const myId = ++pendingTransitionId;         // newer input bumps this
  schedule({
    priority: 10,
    run: () => {
      if (myId !== pendingTransitionId) return;   // a newer keystroke arrived → drop this
      renderResults(filterHugeList(value));
    },
  });
}
```

The `pendingTransitionId` token is the miniature of Fiber's "throw away the in-progress low-priority render when a newer update arrives": each keystroke invalidates the previous transition, so only the latest one commits. Combined with Step 1's yielding, the input (priority 0) always renders before and between chunks of the list work (priority 10), so typing never stutters.

### Step 3 — Map it back to the real API

Everything above is what `startTransition` does for you:

```tsx
function Search() {
  const [text, setText] = useState("");
  const [results, setResults] = useState<Row[]>([]);
  const [isPending, startTransition] = useTransition();

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);                          // urgent lane (Step 2 priority 0)
    startTransition(() => {
      setResults(filterHugeList(e.target.value));     // transition lane (priority 10)
    });
  }

  return (
    <>
      <input value={text} onChange={onChange} />
      {isPending && <Spinner />}                       {/* the isPending flag */}
      <List rows={results} />
    </>
  );
}
```

You never touch lanes, the scheduler, or the work loop — you just *label* the non-urgent update, and the layers from lessons 002–003 do the rest.

---

## ⚖️ Trade-offs, when to use, and pitfalls

**When to reach for concurrent features:** exactly when an update is **expensive to render but not urgent**, and it's competing with something that *is* urgent. The canonical cases: a search/filter over a large result set (`startTransition` on the results, or `useDeferredValue` on the query), tab switches that render heavy content, and any "typing feels laggy because rendering blocks it" symptom. If your renders are cheap, you don't need any of this — concurrency solves a *contention* problem, not a general speed problem.

**Pitfalls:**

- **It is not a speedup.** Transitions don't make the expensive render *faster* — they make it *non-blocking* and interruptible. Total work is the same (often slightly more, due to restarts); the win is responsiveness, not throughput. Reaching for `startTransition` to "make it fast" is the wrong tool; memoization/virtualization is what reduces the work.
- **Don't wrap urgent updates in a transition.** Putting the input's own `setText` inside `startTransition` would make the *input itself* laggy — the exact opposite of the goal. Only the expensive, deferrable consequence goes in the transition; the direct input stays urgent.
- **Tearing with external stores.** If you read a mutable external store during render without `useSyncExternalStore`, concurrent rendering can show inconsistent values across the screen. Use the hook (or a store library that already does) for non-React state.
- **Side effects still belong in `useEffect`, more than ever.** Under concurrency a component may render without committing, or render multiple times before commit. Any logic that assumes "rendered = happened" breaks. This is the same render-purity rule from lesson 002, now with real teeth.
- **`isPending` is for *feedback*, not control flow.** Use it to show a subtle pending indicator; don't build correctness logic on its exact timing.

**When NOT to use it:** don't sprinkle `startTransition` everywhere reflexively. It adds indirection and only helps where urgent and non-urgent work genuinely contend. Most updates are fine synchronous.

---

## 🧠 Q&A Bank

**1. What problem does the scheduling layer solve that Fiber (the engine) alone doesn't?**
Fiber makes rendering *interruptible*; scheduling decides *when to pause and what to run first*. It adds **priority** — so an urgent update (keystroke) can preempt a non-urgent one (filtering a huge list) — which the engine can't decide on its own.

**2. What are "lanes"?**
React 18's priority model: each update is tagged with a lane, implemented as a bit in a 31-bit bitmask. Bits let React combine and test sets of pending priorities with fast bitwise ops, express batching, and preempt lower lanes with higher ones. Lanes replaced the earlier single-number "expiration time" model.

**3. Why did React build its own scheduler instead of using `requestIdleCallback`?**
`requestIdleCallback` fires too infrequently/unpredictably and its idea of "idle" doesn't fit rendering, plus browser inconsistencies. React ships a user-space cooperative scheduler that yields via `MessageChannel` (a macrotask, so the browser can paint/handle input) with a small time budget after each slice.

**4. Walk through what happens when you type in a search box wired with `startTransition`.**
The `setText` on the input is urgent → committed immediately so the input keeps up. The `setResults(filter(...))` is a transition → rendered concurrently in the background, yielding between fibers. If a new keystroke arrives mid-render, React discards the in-progress (off-screen) transition render, commits the new urgent input, and restarts the transition for the newer value. Input stays instant; results lag a beat.

**5. (Why) Is `startTransition` not a performance optimization?**
Because it doesn't reduce the work — the expensive render still runs, sometimes more than once due to restarts. It changes *scheduling*: the work becomes interruptible and non-blocking, so it doesn't freeze urgent interactions. Responsiveness improves; throughput doesn't. To reduce the actual work you need memoization/virtualization.

**6. Difference between `startTransition`/`useTransition` and `useDeferredValue`?**
`startTransition` marks a *state update* as non-urgent (you control the setter, and `useTransition` gives an `isPending` flag). `useDeferredValue` marks a *value* as allowed to lag when you *don't* own the setter — React renders with the old value at high priority and the new value at low, interruptible priority. Same underlying mechanism, different entry point.

**7. What is "tearing," and how does React 18 prevent it?**
Tearing is when an interruptible render reads an external mutable store at two moments and different parts of the screen show different versions of the same data. React prevents committing inconsistent trees (commit is atomic) and provides `useSyncExternalStore` so subscriptions to external stores read consistently within a render.

**8. (What happens if…) urgent updates keep arriving — does a transition ever run?**
Yes, thanks to **starvation control**: low-priority lanes have an expiration, and once one has waited too long React escalates it and forces it through so it can't be starved indefinitely by a stream of urgent updates.

**9. What is automatic batching in React 18, and how does it relate to scheduling?**
It batches all state updates in the same tick into one render — including updates inside promises, `setTimeout`, and native handlers, which pre-18 caused separate renders. It's driven by the same scheduler and reduces redundant renders.

**10. (History) Why did concurrent features take so long to ship, and how do they reach developers now?**
The Fiber engine shipped in 2017, but the scheduling *policy* (correct priorities, no tearing/starvation) is hard and matured over years — branded Async then Concurrent Mode — finally arriving as opt-in **concurrent features** (not a global mode) in React 18 (2022): `startTransition`, `useDeferredValue`, `useTransition`, Suspense, and automatic batching, each quietly using the concurrent scheduler.

---

## 🛠️ Hands-on Exercise

**Goal:** reproduce the laggy-search problem and fix it with priority, no framework needed.

1. Render an `<input>` and, on every keystroke, synchronously build a list of ~20,000 DOM rows filtered by the input. Type fast — the input visibly lags because the list render blocks it.
2. Now use the tiny scheduler from the implementation section: on each keystroke, schedule the input update at priority 0 and the list rebuild at priority 10, with the `pendingTransitionId` token cancelling stale list renders. Type fast again.
3. Observe the input staying responsive while the list updates a beat behind, and note in the console how often stale list renders get dropped.

**Hint:** the entire effect comes from two things working together — *yielding* (the time-slice `while` loop) so the browser can paint the input, and *cancellation* (the id token) so only the latest list render commits. Remove either and the improvement disappears; that tells you which mechanism is doing what.

---

## ✅ Recap

- Fiber makes rendering interruptible; **scheduling is the policy layer** that decides *when to yield* and *what to render first* by giving every update a **priority**.
- **Lanes** = React 18's priority model, a **bitmask** where each bit is a lane; higher lanes **preempt** lower ones, same-lane updates **batch**, and starving lanes **expire** and get escalated.
- React runs its **own cooperative scheduler** (yielding via `MessageChannel` with a small time budget) because the browser's `requestIdleCallback` wasn't precise enough for UI work.
- **Concurrent features** are the developer surface: `startTransition`/`useTransition` (mark an update non-urgent, get `isPending`), `useDeferredValue` (let a value lag), `<Suspense>` (suspend for data), plus automatic batching — all opt-in, all riding the scheduler.
- Concurrency buys **responsiveness, not speed**: the expensive work still runs (interruptibly, non-blocking); use memoization/virtualization to actually reduce work, and keep side effects in `useEffect` because a render may not commit.

---

## 📎 Primary sources (optional)

The lesson above stands on its own — nothing here is required. For the reader who wants the source material:

- **React docs** — `useTransition`, `useDeferredValue`, `startTransition`, `<Suspense>`, `useSyncExternalStore`, and "React 18" release notes (automatic batching, concurrent features).
- **React 18 Working Group discussions** (`reactwg/react-18` on GitHub) — the team's own explanations of concurrent rendering, tearing, and why features are opt-in.
- **The `scheduler` package** in the React monorepo — the actual cooperative scheduler described here.
