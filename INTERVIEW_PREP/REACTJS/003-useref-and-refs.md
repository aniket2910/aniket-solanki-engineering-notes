# useRef & Refs (focus, DOM access, mutable values)

## ⚡ In one line

`useRef` gives you a **mutable box (`ref.current`) that survives re-renders but does not trigger them** — used for two jobs: grabbing a DOM node (to focus/measure/scroll it) and holding a mutable value that shouldn't cause a render (timer ids, previous values).

## Why it exists (the problem)

Two needs don't fit state. First, sometimes you must touch the **real DOM** — focus an input, measure a div, play a `<video>`. State renders UI; it can't "focus." Second, you sometimes need a value to **persist across renders without causing one** — a `setInterval` id, the previous prop. Storing those in state would re-render pointlessly or lag a frame. `useRef` covers both.

## What it is

`const ref = useRef(initialValue)` returns a stable object `{ current: initialValue }`. The *same object* persists for the component's whole life. Mutating `ref.current` is a plain assignment — **no re-render**, and the new value is readable synchronously.

Two idioms:
- **DOM ref:** `<input ref={inputRef} />` → React sets `inputRef.current` to the DOM node after mount. Then `inputRef.current.focus()`.
- **Instance variable:** `const timerId = useRef<number>()` → store anything mutable that shouldn't render.

**Mental model:** state is a *whiteboard the room repaints when it changes*; a ref is a *sticky note in your pocket* — you can change it anytime and nobody redraws the room.

## 🎈 Real-life analogy

A **coat-check ticket**. When you render an input you hand React a ticket (`ref`); after mount React staples the actual coat (DOM node) to it. Later, whenever you want the coat — to focus it, measure it, scroll to it — you show the ticket (`ref.current`) and get the real thing. And a ref for a timer id is just writing a number on the back of the ticket: it stays with you, but writing it doesn't summon the cloakroom attendant (no re-render).

## 🔧 How it works

- On first render `useRef(x)` creates `{ current: x }` and returns it; on every later render it returns **the same object** (unlike a normal variable, which resets each render).
- For a DOM ref, React assigns `ref.current = node` after commit (and `null` on unmount). So `ref.current` is `null` during the first render body — only touch it in effects or event handlers.
- Writing `ref.current = ...` never schedules a render. That's the whole point — and also the gotcha: **the UI won't update from a ref change**. If the screen must reflect a value, that value belongs in state, not a ref.
- **Callback refs** (`ref={el => { arr[i] = el }}`) let you collect many nodes into an array — exactly how the OTP box keeps one ref per box.

## 🗣️ Keywords to say

`ref.current` · mutable, doesn't trigger re-render · persists across renders · DOM access / imperative focus · callback ref · `forwardRef` (expose a child's DOM node to a parent) · `useImperativeHandle` · `null` until mounted · instance variable (timer id, previous value).

## 🎯 How it's asked in interviews

- "What's `useRef` for?" → DOM access + mutable non-rendering value.
- "Difference between `useRef` and `useState`?" → both persist across renders; **state triggers re-render, ref doesn't**.
- "Why not just use a normal variable?" → a normal `let` resets to its initial value every render; a ref keeps its value.
- "How do you focus an input on mount?" → `ref` + `useEffect(() => ref.current?.focus(), [])`.
- "How would you focus one of many inputs (like an OTP box)?" → an array of refs via a callback ref.
- Trap: reading `ref.current` in the render body expecting the DOM node — it's `null` before mount.
- Trap: mutating a ref and expecting the UI to change — it won't; that's what state is for.

**Model answer shape:** "`useRef` is a mutable container whose `.current` persists across renders without causing one. Two uses: hold a DOM node for imperative actions like focus, and store mutable values like a timer id or previous prop. The key contrast with state is that changing a ref doesn't re-render."

## 🔗 Linked concepts

- [OTP Input Box](001-otp-input-box.md) — array of refs + imperative `.focus()` in action.
- [Controlled vs Uncontrolled Components](002-controlled-vs-uncontrolled-components.md) — refs are how you read an uncontrolled input's value.

## 🧠 Rapid-fire Q&A

**Q1. `useRef` vs `useState` in one line?** Both survive re-renders; state re-renders on change, a ref doesn't.

**Q2. Why not a plain `let` variable?** It resets to its initial value on every render; a ref keeps its value across renders.

**Q3. When is a DOM ref `null`?** During the first render (before mount) and after unmount — only use it in effects/handlers.

**Q4. Does changing `ref.current` re-render?** No. If the UI must reflect the value, use state instead.

**Q5. How do you keep a ref for each item in a list?** A callback ref writing into an array by index: `ref={el => { arr[i] = el }}`.

**Q6. How does a parent focus a child's input?** `forwardRef` to pass the ref down, or `useImperativeHandle` to expose a controlled API.

**Q7. Real non-DOM use of a ref?** Storing a `setInterval`/`setTimeout` id so you can clear it later, or the previous value of a prop/state.

## ✅ Cheat lines

- **Ref = mutable `.current` that persists across renders and never triggers one.**
- Two jobs: **DOM access** (focus/measure/scroll) and **mutable non-rendering value** (timer id, previous value).
- `useState` re-renders, `useRef` doesn't — that's the whole distinction.
- DOM refs are `null` until mount; read them in effects/handlers.
- Many nodes → **callback ref into an array** (the OTP pattern).
