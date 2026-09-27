# OTP Input Box (React Machine Coding)

Runnable in the shared playground:

```bash
cd playground && npm install && npm run dev
```

Then pick **OTP Input Box** in the sidebar. Code lives in
[`playground/src/problems/otp-input-box/`](playground/src/problems/otp-input-box/) —
[`OtpInput.tsx`](playground/src/problems/otp-input-box/OtpInput.tsx) (logic) and
[`OtpBox.tsx`](playground/src/problems/otp-input-box/OtpBox.tsx) (a single box).

---

## ⚡ In one line

An OTP input is a **row of single-character boxes backed by one array of state**, where typing a digit auto-advances focus to the next box, Backspace moves back, and paste fills them all — focus is driven imperatively through a **ref per box**, because "move the cursor" is a DOM action, not something you render.

## 🔍 What the interviewer is really testing

Producing six boxes is trivial; that's not the point. The real signals:

- **Do you understand refs vs state?** — that focus is a DOM action (ref), and the value is data (state). This is the core of the problem.
- **Do you handle the edge cases?** — pre-filled box, Backspace on empty, paste, digits-only. This separates "works in the demo" from "works".
- **Can you decompose cleanly?** — do you keep one 200-line component, or split box vs orchestrator with clear responsibilities?
- **Do you build a reusable API?** — `length`, `onChange`, `onComplete` props, not a hard-coded widget.

Go deep on refs + focus and the edge cases; everything else stays tight.

## Why it exists (the problem)

A one-time passcode is short and high-stakes — one wrong digit and the user fails login and gets frustrated. Separate boxes give **clear visual progress** ("4 of 6 in"), make each character easy to see and fix, and pair naturally with **SMS autofill** (`autocomplete="one-time-code"`). That's why every 2FA flow uses it. The interview version is really a controlled-inputs-plus-refs test wearing a product costume.

## What it is

A **controlled component**: React owns each box's value through a single `values: string[]` (one char per index). Two things it coordinates:

- **State** — what each box shows (`values`), the single source of truth.
- **Focus** — which box the cursor is in. Not state; it's an imperative DOM action, so keep a `ref` per `<input>` and call `.focus()` yourself.

**Mental model:** the array is the data; the refs are the remote control for the cursor.

## 🎈 Real-life analogy (how to think about it)

A **hotel front desk with a row of mail pigeonholes**, one per digit.

- Each **pigeonhole** = one input box.
- The clerk's **ledger** of what's in each hole = your `values` array (the truth). The holes just *display* what the ledger says.
- The clerk's **hand moving to the next hole** after dropping a letter = `.focus()` on the next ref. The hand isn't written in the ledger — it's a physical action, exactly like focus isn't state.
- **Backspace** = taking a letter back; if the hole's already empty, the hand slides one hole left and clears that one.
- **Paste** = someone hands over the whole 6-letter code; the clerk distributes it and rests a hand on the last filled hole.

When you freeze: *ledger holds the data, hand moves the focus.*

## 🔧 How it works (under the hood)

**1. Typing a digit (`onChange`)**
```
type "5" in box 2
 → e.target.value is "5" (empty box) OR "35" (box already had "3")
 → char = value.slice(-1)   → keep the LAST char typed
 → reject if not /^\d$/      → digits only
 → next=[...values]; next[2]="5"; commit(next)
 → if not last box, focus box 3   ← auto-advance
```
`slice(-1)` is the subtle bit: with `maxLength={1}` the browser usually replaces the char, but a filled box with the caret before the digit can momentarily read two chars. Taking the last char is robust either way.

**2. Backspace (`onKeyDown`)** — `onChange` doesn't fire when you delete an already-empty box, so handle the key:
```
Backspace in box i
 → box i has a digit → clear it, stay
 → else if i > 0     → clear box i-1 AND move focus to i-1
```

**3. Arrow keys** — `ArrowLeft`/`ArrowRight` move focus only. Cheap; shows thoroughness.

**4. Paste (`onPaste`)** — `preventDefault()`, strip non-digits (`replace(/\D/g,"")`), take the first `length`, spread across a fresh array, focus the last filled box.

**Why refs, not state, for focus?** Focus is a property of the live DOM. Modeling it as `focusedIndex` state + `useEffect` adds a render and timing bugs. `ref.focus()` is direct and synchronous. Saying this out loud is the single highest-value sentence in the whole answer.

## 💻 In code

Two files, split by responsibility:

- **[`OtpBox.tsx`](playground/src/problems/otp-input-box/OtpBox.tsx)** — a purely presentational single input, `forwardRef` so the parent can focus it. No state, no logic.
- **[`OtpInput.tsx`](playground/src/problems/otp-input-box/OtpInput.tsx)** — the orchestrator: owns `values` + the refs array, all handlers, renders the `OtpBox` list.

The skeleton the interviewer wants to see emerge:

```tsx
const [values, setValues] = useState<string[]>(() => new Array(length).fill(""));
const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

const handleChange = (e, i) => {
  const char = e.target.value.slice(-1);        // last char handles a pre-filled box
  if (char && !/^\d$/.test(char)) return;       // digits only
  const next = [...values]; next[i] = char; setValues(next);
  if (char && i < length - 1) inputsRef.current[i + 1]?.focus();  // auto-advance
};
```

And the ref-collection pattern — a callback ref writing into the array by index:

```tsx
<OtpBox ref={(el) => { inputsRef.current[i] = el; }} ... />
```

## 🏗️ Code quality & principles applied

This is where you out-score the other nine candidates who also got it working.

- **Decomposition (SRP + composition).** `OtpBox` is one job — render a digit box; `OtpInput` is one job — coordinate the boxes. Say: *"I'll pull the single box into its own component so this file stays focused on orchestration — Single Responsibility, and the box becomes reusable."* This also keeps `OtpInput` under ~120 lines instead of a monolith.
- **Single source of truth / DRY.** One `values` array drives everything; "is it complete?" is **derived** (`values.every(...)`), never stored as a second state. Say: *"Completeness is computed from the values — one source of truth, so nothing can drift."*
- **Separation of concerns.** All styling is in [`otp.css`](playground/src/problems/otp-input-box/otp.css) — **no inline styles**. Say: *"Styling stays in CSS, not inline — separation of concerns and it scales."*
- **One commit path.** Every handler funnels through a single `commit(next)` that sets state and fires `onChange`/`onComplete`, so the callbacks can't get out of sync — DRY for the side-effects.
- **What I deliberately did NOT do.** No state library, no `react-router`, no premature `useOtpInput` hook — the problem doesn't need them (KISS/YAGNI). *"I can extract a `useOtpInput` hook if you want reuse, but I won't add it speculatively."*
- **Comments explain the why.** e.g. `// slice(-1): a pre-filled box briefly holds 2 chars` — the reasoning, not the line.

## 🗣️ Keywords to say

- **Controlled component / single source of truth** — state owns the value; UI mirrors it.
- **Refs / imperative focus** — `useRef` array + `.focus()`; focus is a DOM action, not state.
- **`forwardRef`** — expose a child input's DOM node so the parent can focus it.
- **Callback ref** — `ref={el => { arr[i] = el }}` to collect a list of nodes.
- **`slice(-1)`** — keep the last typed char so a pre-filled box doesn't hold two.
- **`inputMode="numeric"`, `autocomplete="one-time-code"`** — numeric keypad + SMS autofill.
- **Derived state** — completeness computed, not stored.
- **Principle vocabulary:** Single Responsibility, composition, separation of concerns, DRY, KISS/YAGNI.

## 🎯 How it's asked in interviews

**Same problem, different disguises** — recognize the pattern under the wording:
"Build an OTP input" = "build a PIN entry" = "segmented verification code input" = "6-digit code boxes". All the same component.

**Typical framing:** a 30–45 min machine-coding round, often just "build an OTP input" — the rest is you asking good clarifying questions.

**Clarify first (shows maturity):** How many digits (configurable)? Digits only or alphanumeric? Should paste work? Auto-submit when full or wait for a button? Masking?

**Follow-up ladder:** length prop → Backspace focus → paste → digits-only → auto-focus + `onComplete` → accessibility → *"extract into a `useOtpInput` hook"* → resend timer / masking.

**Traps & gotchas:**
- Using `document.querySelector` to move focus — in React use refs, and say so.
- Forgetting the two-char case (no `slice(-1)`).
- Handling Backspace in `onChange` (won't fire on an empty box) instead of `onKeyDown`.
- Pasting all digits into one box (no `onPaste`).
- `type="number"` — allows `e`/`+`/`-`/`.`, has spinners, ignores `maxLength`. Use `type="text"` + `inputMode="numeric"`.
- Storing `isComplete` in state instead of deriving it.
- Mutating the array (`values[i]=x; setValues(values)`) — same reference, no re-render. Always `[...values]`.

**Model answer sketch (flagship "build it"):**
1. Clarify (6 digits, configurable, digits only, paste works, fire `onComplete`).
2. *"Two pieces of info: the values as state, and focus which I'll handle with a ref per box because focus is a DOM action, not state."*
3. Split: a presentational `OtpBox`, an orchestrating `OtpInput` — *"keeps each component one job."*
4. `onChange`: `slice(-1)`, validate, set state, auto-advance.
5. `onKeyDown`: Backspace + arrows. `onPaste`: strip + distribute.
6. Accessibility pass; derive completeness.
7. Offer the `useOtpInput` hook extraction. **Narrate the why at each step** — that's the hire signal.

## 🔗 Linked concepts

- [Controlled vs Uncontrolled Components](002-controlled-vs-uncontrolled-components.md) — the boxes are controlled; know why not uncontrolled-with-refs, a common probe.
- [useRef & Refs](003-useref-and-refs.md) — the ref-per-box + imperative `.focus()` are the crux; refs also hold a resend-timer id.

## 🧠 Rapid-fire Q&A

**Q1. Controlled or uncontrolled?** Controlled — React owns each box's value via `values`.

**Q2. Why a ref for focus, not state?** Focus is a live DOM action; state adds a render + timing bugs. `ref.focus()` is direct and synchronous.

**Q3. Why `value.slice(-1)`?** A filled box can momentarily read two chars; keep only the last typed one so each box stays single-digit.

**Q4. Why Backspace in `onKeyDown`, not `onChange`?** `onChange` doesn't fire when deleting an already-empty box; to move focus back you must catch the key.

**Q5. Paste "12 34-56"?** `onPaste` strips non-digits → "123456", fills every box, focuses the last. Without it, all of it lands in one box.

**Q6. Why did you split `OtpBox` out?** Single Responsibility + reuse + it keeps `OtpInput` small and readable; the box has no logic so it's trivially testable. (A code-quality question — expect it.)

**Q7. `type="text"` + `inputMode="numeric"` vs `type="number"`?** `number` allows `e/+/-/.`, shows spinners, ignores `maxLength`; the text + inputMode combo gives the mobile keypad while keeping single-char control.

**Q8. How does the parent know it's done?** An `onComplete(otp)` fired when every box is filled; completeness is derived from `values`, never stored.

**Q9. Why copy the array before `setValues`?** Mutating in place reuses the reference, so React skips the re-render; `[...values]` makes a new reference.

**Q10. Make it reusable?** Extract state + refs + handlers into a `useOtpInput(length)` hook returning `values`, `getInputProps(i)`, `otp`; the component becomes thin markup.

## ✅ Cheat lines

- **Data in state, focus in refs** — the one sentence that frames the whole thing.
- **`slice(-1)` for typing, `onKeyDown` for Backspace, `onPaste` for paste** — the three handlers.
- **Split `OtpBox` (view) from `OtpInput` (logic)** — SRP + composition, keeps it < 120 lines.
- **`type="text"` + `inputMode="numeric"`**, never `type="number"`; completeness is **derived**.
- Copy the array before `setValues`; move focus with `ref.focus()`, never `querySelector`.
