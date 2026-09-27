# 04 — React

Mostly conceptual on the DBS screen (Virtual DOM, keys, hooks, React vs Angular), with a few behavior/output questions.

---

### Q1. What is the Virtual DOM?
A) A faster version of the real DOM in the browser
B) A lightweight in-memory JS representation of the UI; React diffs the new tree against the old and applies the minimal set of real-DOM updates
C) A server-side DOM
D) The Shadow DOM

**Answer: B.** The real DOM is slow to mutate. React builds a virtual tree, **diffs** (reconciliation), and batches the smallest real mutations.

---

### Q2. Why does React need `key` on list items?
A) For styling
B) To give each element a stable identity so the diff can match, reuse, reorder, and avoid re-rendering the wrong items
C) It's required syntax with no effect
D) For accessibility

**Answer: B.** Without stable keys React falls back to index matching, causing subtle bugs when items are inserted/removed/reordered.

---

### Q3. Why is using the array **index** as a key discouraged?
A) It's slower to compute
B) When the list reorders or items are inserted/deleted, index keys stay the same while the data moves, so React reuses the wrong DOM/state
C) Indexes aren't unique
D) It's actually recommended

**Answer: B.** Index keys are only safe for a static, never-reordered list.

---

### Q4. `useState` batching — click once, what is the count?
```jsx
const [count, setCount] = useState(0);
const onClick = () => {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
};
```
A) 3
B) 1
C) 0
D) 6

**Answer: B (1).** All three read the same stale `count` (0) from this render's closure, so each sets it to 1. Use the functional updater to get 3: `setCount(c => c + 1)`.

---

### Q5. When does `useEffect(fn, [])` run?
A) On every render
B) Only once, after the initial mount (and cleanup on unmount)
C) Never
D) Before render

**Answer: B.** Empty dependency array = run once after mount. No array = every render. `[a, b]` = when `a` or `b` changes.

---

### Q6. Difference between `useEffect` and `useLayoutEffect`?
A) None
B) `useEffect` runs asynchronously after paint; `useLayoutEffect` runs synchronously after DOM mutations but before the browser paints
C) `useLayoutEffect` is for layout only
D) `useEffect` is deprecated

**Answer: B.** Use `useLayoutEffect` when you must read/measure layout and mutate before the user sees a flicker; otherwise prefer `useEffect`.

---

### Q7. The two Rules of Hooks are:
A) Only call hooks at the top level (not in loops/conditions/nested funcs), and only from React functions/custom hooks
B) Always name them `use…` and export them
C) Call them inside `useEffect`
D) Only one hook per component

**Answer: A.** Hooks rely on stable call order between renders, which conditionals/loops break.

---

### Q8. Controlled vs uncontrolled input?
A) Controlled = React state is the source of truth (`value` + `onChange`); uncontrolled = the DOM holds the value (read via `ref`)
B) Controlled = has a controller class
C) No difference
D) Uncontrolled inputs can't be typed in

**Answer: A.**

---

### Q9. What does `useMemo` do?
A) Memoizes a component
B) Caches the *result* of an expensive computation between renders unless its dependencies change
C) Caches a function reference
D) Stores state

**Answer: B.** `useMemo` caches a value; `useCallback` caches a function reference; `React.memo` skips re-render of a component when props are shallow-equal.

---

### Q10. Why shouldn't you mutate state directly (`state.push(x)`)?
A) It's slower
B) React compares references to decide re-renders; mutating in place keeps the same reference, so React may skip the update — always create a new object/array
C) It throws an error
D) You can, it's fine

**Answer: B.** Use `setItems([...items, x])`, not `items.push(x)`.

---

### Q11. React vs Angular — key difference?
A) React is a full MVC framework; Angular is a library
B) React is a UI library (view layer) using a virtual DOM and JSX with one-way data flow; Angular is a full opinionated framework (TS, DI, two-way binding, RxJS) that uses a real DOM with change detection
C) They're identical
D) Angular uses JSX

**Answer: B.** React = flexible library, you pick routing/state libs. Angular = batteries-included framework.

---

### Q12. What is JSX?
A) A templating language
B) Syntactic sugar that compiles to `React.createElement(...)` calls — HTML-like syntax inside JS
C) A separate file format required by React
D) JSON with XML

**Answer: B.**

---

### Q13. Props vs state?
A) Same thing
B) Props are read-only inputs passed from parent; state is internal, mutable (via setter), and owned by the component
C) State comes from parent
D) Props can be changed by the child

**Answer: B.** A child must never mutate its props.

---

### Q14. What does "lifting state up" mean?
A) Moving state to the browser
B) Moving shared state to the closest common ancestor so multiple children stay in sync via props/callbacks
C) Using Redux
D) Using context

**Answer: B.**

---

### Q15. `useEffect` with a cleanup function — when does cleanup run?
A) Never
B) Before the next effect run (deps changed) and on unmount
C) Only on mount
D) On every render before render

**Answer: B.** Cleanup prevents leaks (remove listeners, clear timers, cancel subscriptions).

---

### Q16. Reconciliation — what makes React reuse a DOM node vs recreate it?
A) The element's `id`
B) Same element type + same key at the same position → reuse (update props); different type → tear down and rebuild the subtree
C) Random
D) The order of props

**Answer: B.** Changing a component's *type* unmounts the old subtree entirely (losing its state).

---

### Q17. What is the purpose of `React.Fragment` (`<>...</>`)?
A) Adds a styled wrapper div
B) Groups children without adding an extra DOM node
C) Creates a portal
D) Lazy-loads components

**Answer: B.** Avoids "wrapper div" pollution when a component must return multiple siblings.

---

### Q18. Which statement about `setState`/state updates is TRUE?
A) They're always synchronous
B) React may batch multiple updates and re-render once; the updated value isn't available on the very next line — read it in the next render or use the functional updater
C) State updates mutate the current variable immediately
D) You can read new state right after calling the setter

**Answer: B.** This is why the batching question (Q4) trips people up.
