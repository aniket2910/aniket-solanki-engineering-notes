# Event Bubbling & Delegation

Run the code: `node playground/run.js JS event-bubbling-delegation` — see [`demo.js`](demo.js) (a small simulation of DOM propagation, since there's no DOM in Node; the rules map 1:1 to real `addEventListener`).

## ⚡ In one line

A DOM event travels in three phases — **capture** (top down to the target), **target**, then **bubble** (target back up) — and **event delegation** puts a single listener on a common ancestor and uses `event.target` to handle events from many children.

## 🔍 What the interviewer is really testing

- **Do you know the propagation model** — capture then bubble, and that bubbling is the default listeners fire on?
- **Do you understand delegation** and *why* it's better (fewer listeners, works for dynamically added elements)?
- **Do you know `event.target` vs `event.currentTarget`** — the clicked element vs the element the listener is on?
- **Do you know `stopPropagation` vs `preventDefault`** — stopping the travel vs stopping the default browser action?

## Why it exists (the problem)

Attaching a listener to every one of hundreds of list items is wasteful (memory) and breaks when items are added/removed dynamically — you'd have to wire up listeners for each new one. Because events **bubble** up to ancestors, you can instead put **one** listener on the parent and let every child's event flow to it, then read `event.target` to see which child was clicked. That's delegation: fewer listeners, and it automatically covers elements added later.

## What it is

**Propagation phases** when you click an element:
1. **Capture phase** — the event goes from the `document` **down** through each ancestor to the target. Listeners registered with `addEventListener(type, fn, true)` (or `{ capture: true }`) fire here.
2. **Target phase** — the event reaches the actual clicked element.
3. **Bubble phase** — the event travels **back up** from the target through its ancestors. This is the **default** — most listeners fire here.

**Delegation** — register one listener on a shared ancestor (bubble phase) and branch on `event.target` (often with `target.closest(selector)` to match the right child).

Two properties to keep straight:
- **`event.target`** — the element that actually triggered the event (deepest — the clicked child).
- **`event.currentTarget`** — the element whose listener is currently running (the ancestor you attached to). Inside a delegated handler, `currentTarget` is the parent, `target` is the child.

**Mental model:** think of the event as a **diver**. It dives from the surface (document) down to the seabed (the target) — that's capture. It touches the target. Then it floats back up to the surface — that's bubbling. Listeners can catch it on the way down or (by default) on the way up.

## 🎈 Real-life analogy (how to think about it)

**A memo dropped through an org chart.** A complaint (the event) starts at the CEO and is passed *down* the hierarchy to the specific employee it's about (capture), reaches that employee (target), then the response travels *back up* through each manager to the CEO (bubble). Delegation is the CEO saying "don't make every employee handle their own memos — I'll put one assistant at the manager level who reads the 'from' field (`event.target`) and deals with whichever employee it came from." One handler, covers everyone, including new hires.

## 🔧 How it works (under the hood)

```text
click on <li>:
  CAPTURE:  document -> body -> ul   (top down)
  TARGET:   li
  BUBBLE:   li -> ul -> body -> document   (bottom up)  <-- default listeners here
```

The [`demo.js`](demo.js) simulation prints exactly this order: `capture at root → capture at ul → bubble at li → bubble at ul → bubble at root`.

**`stopPropagation()`** halts the travel — no further ancestors receive the event (in either phase). **`stopImmediatePropagation()`** also stops *other listeners on the same element*. Use sparingly: stopping propagation can break other code (including delegation) that expects the event to reach an ancestor.

**`preventDefault()`** is different — it cancels the browser's **default action** (following a link, submitting a form, checking a checkbox) but does **not** stop propagation. They're orthogonal: you can call one, both, or neither.

**Delegation with `closest`:** since `event.target` might be a nested element (an icon inside a button), real delegated handlers do `const btn = event.target.closest("button"); if (btn) {...}` to resolve to the intended element.

**Note:** a few events don't bubble (`focus`, `blur`, `mouseenter`, `mouseleave`) — for those use the bubbling variants (`focusin`/`focusout`) or capture. Worth naming as a gotcha.

## 💻 In code

Real DOM delegation (what the simulation models):

```js
// One listener on the list handles clicks from any current OR future <li>.
list.addEventListener("click", (event) => {
  const item = event.target.closest("li"); // resolve to the intended element
  if (!item) return;                        // click wasn't on an item
  console.log("clicked item:", item.dataset.id);
  // event.currentTarget === list (the listener's element)
  // event.target === the actual clicked node
});
```

Capture vs bubble registration:

```js
el.addEventListener("click", handler);                 // bubble (default)
el.addEventListener("click", handler, true);           // capture phase
el.addEventListener("click", handler, { capture: true });
```

## 🏗️ Code quality & principles applied

**Decomposition — one handler, branch by target.** Delegation centralizes handling in a single function that decides based on `event.target`, instead of scattering identical listeners.

**Principles by name:**
- **DRY / fewer listeners** — one handler for many elements. Say: *"I'll delegate to the parent so I register one listener instead of one per row — DRY, less memory, and it covers dynamically added rows."*
- **Separation of concerns** — the container owns event handling; children stay dumb markup.
- **Robustness** — use `closest()` so nested children resolve correctly; guard when the click misses a valid target.
- **Least surprise** — avoid `stopPropagation()` unless needed; it silently breaks ancestor handlers and other delegation.

**Say while coding:** *"Because events bubble, I put one listener on the `<ul>` and use `event.target.closest('li')` — this also handles items added after load, which per-item listeners wouldn't,"* and *"I'll `preventDefault()` on the link but not stop propagation, since those are independent."*

**What you deliberately did NOT do:** you didn't attach a listener to every child (memory + doesn't cover new elements), and you didn't reach for `stopPropagation` as a quick fix for overlapping handlers — that hides coupling and breaks delegation elsewhere.

## 🗣️ Keywords to say

- **Capture / target / bubble** — the three phases; bubble is the default.
- **Event delegation** — one ancestor listener handling many descendants via `event.target`.
- **`event.target` vs `event.currentTarget`** — the actual source vs the listener's element.
- **`closest(selector)`** — resolve a nested target to the intended element.
- **`stopPropagation` / `stopImmediatePropagation`** — halt travel / also halt sibling listeners.
- **`preventDefault`** — cancel the browser's default action (independent of propagation).
- **Non-bubbling events** — `focus`/`blur`/`mouseenter`/`mouseleave`; use `focusin`/capture.

## 🎯 How it's asked in interviews

**The question, disguised:**
- "What is event bubbling? What are the phases?"
- "What is event delegation and why use it?"
- "You have 1000 list items — how do you handle clicks efficiently?" → delegation.
- "Difference between `target` and `currentTarget`?"
- "`stopPropagation` vs `preventDefault`?"
- "How do you handle clicks on dynamically added elements?" → delegation (bubbling covers new nodes).

**Follow-up ladder:** phases → default is bubble → delegation + why → `target` vs `currentTarget` → `closest` for nested targets → `stopPropagation` vs `preventDefault` → events that don't bubble → capture-phase use cases.

**Traps & gotchas:**
- Confusing `target` (clicked child) and `currentTarget` (listener element) inside a delegated handler.
- Overusing `stopPropagation` — it breaks delegation and other ancestor listeners.
- Forgetting nested children — clicking an icon inside a button makes `target` the icon; use `closest`.
- Assuming all events bubble — `focus`/`blur`/`mouseenter`/`mouseleave` don't.
- Thinking `preventDefault` stops bubbling — it doesn't; they're separate.

**Model answer sketch** ("bubbling + delegation"): *"When you click an element, the event captures from the document down to the target, hits the target, then bubbles back up — and listeners fire on the bubble phase by default. Delegation uses that: instead of a listener per child, I put one on a common ancestor and check `event.target` (usually with `closest`) to find which child was clicked. It means fewer listeners, less memory, and it automatically handles elements added after load. Inside that handler `currentTarget` is the ancestor and `target` is the actual clicked node. If I need to stop the event I use `stopPropagation`, but sparingly since it can break other delegated handlers; `preventDefault` is separate — it just cancels the default browser action."*

## 🔗 Linked concepts

- **[`this` keyword](../this-keyword/notes.md)** — in a non-arrow DOM handler, `this` is `currentTarget`; passing handlers can lose it.
- **[Higher-Order Functions](../higher-order-functions/notes.md)** — delegated handlers often dispatch to smaller functions by target.

## 🧠 Rapid-fire Q&A

**Q: The three phases?**
Capture (top → target), target, bubble (target → top). Listeners fire on bubble by default.

**Q: What is event delegation?**
One listener on a common ancestor handling events from many descendants via `event.target`.

**Q: Why delegate?**
Fewer listeners (memory), simpler code, and it automatically covers dynamically added elements.

**Q: `target` vs `currentTarget`?**
`target` is the element that triggered the event (the child clicked); `currentTarget` is the element the running listener is attached to.

**Q: `stopPropagation` vs `preventDefault`?**
`stopPropagation` halts the event's travel through ancestors; `preventDefault` cancels the default browser action. Independent.

**Q: How do you handle a click on an icon inside a button in a delegated handler?**
`event.target.closest("button")` to resolve up to the intended element.

**Q (design): Why not add a listener to each of 1000 items?**
Memory and maintenance — and it won't cover items added later. One delegated listener does.

## ✅ Cheat lines

- **Capture (down) → target → bubble (up); listeners default to bubble.**
- **Delegation = one ancestor listener + `event.target` (use `closest`) — fewer listeners, covers new elements.**
- **`target` = what was clicked; `currentTarget` = where the listener lives.**
- **`stopPropagation` halts travel; `preventDefault` cancels the default action — different things.**
- **`focus`/`blur`/`mouseenter`/`mouseleave` don't bubble — use `focusin`/capture.**
