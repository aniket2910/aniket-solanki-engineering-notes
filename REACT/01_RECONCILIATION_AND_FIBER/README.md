# ⚛️ 01 · Reconciliation & the Fiber Architecture

The algorithm at the heart of React. This chapter answers one question in three layers: *how does React take a fresh description of your entire UI and turn it into the smallest, smoothest set of real-DOM changes?* You'll trace it from the theoretical wall (tree-diffing is O(n³)) through the heuristic that beats it, into the engine rewrite (Fiber) that made rendering interruptible, and up to the scheduling policy (lanes, concurrency) that decides what to render first. Each lesson is a full, self-contained chapter — read only these pages and you'll understand React's rendering internals from first principles.

---

## 📂 Lessons

| ID | Lesson | Key ideas |
| :--- | :--- | :--- |
| `001` | [The Diffing Problem & Reconciliation](./001-the-diffing-problem-and-reconciliation.md) | `UI = f(state)`, why optimal tree-diff is O(n³), React's O(n) heuristic, the two assumptions (type & `key`), the virtual DOM, why index-as-key is a bug |
| `002` | [The Fiber Architecture](./002-the-fiber-architecture.md) | The uninterruptible "stack reconciler" and its pain, reifying the call stack as fiber objects, the `child`/`sibling`/`return` linked-list tree, the resumable work loop, double buffering, render vs commit phases |
| `003` | [Scheduling, Priorities & Concurrency](./003-scheduling-priorities-and-concurrency.md) | Why an engine needs a scheduler, lanes as a priority bitmask, React's own cooperative scheduler, urgent-preempts-transition, tearing & starvation, `startTransition` / `useDeferredValue` / `<Suspense>` |

Read them in order — each builds directly on the last. Lesson 001 ends by pointing out the "decide vs apply" seam; lesson 002 pries that seam open to make rendering pausable; lesson 003 puts a priority brain on top of the now-pausable engine.

---

## 🎯 Goal of this chapter

You should be able to answer, from first principles: *"When I call `setState`, what does React actually do — how does it find the minimal DOM change, why doesn't a big render freeze my page, and how does typing stay smooth while an expensive list re-renders?"* — and understand **why** the rules you already follow (stable keys, pure render, side-effects-in-`useEffect`) are direct consequences of this algorithm, not arbitrary style.
