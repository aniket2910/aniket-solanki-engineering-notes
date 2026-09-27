# Controlled vs Uncontrolled Components

## ⚡ In one line

A **controlled** input has its value owned by React state (single source of truth, `value` + `onChange`); an **uncontrolled** input keeps its own value in the DOM and you read it with a ref only when you need it.

## Why it exists (the problem)

Form inputs already hold their own value in the DOM — that's how plain HTML works. React has to decide: do I mirror that value into state so the UI and data never disagree, or do I let the DOM keep it and just read it at submit time? The answer shapes validation, formatting, disabling buttons, and testability, so interviewers use it to check whether you actually understand React's data flow.

## What it is

- **Controlled:** `value={state}` + `onChange={e => setState(e.target.value)}`. React state is the truth; the input is a mirror. Every keystroke re-renders.
- **Uncontrolled:** `defaultValue="..."` + a `ref`; the DOM holds the truth; you call `ref.current.value` when you need it. No re-render per keystroke.

**Mental model:** controlled = React holds the pen and the input watches; uncontrolled = the input holds the pen and React peeks over its shoulder when it wants.

## 🎈 Real-life analogy

A **thermostat vs a wall thermometer**. A controlled input is a *thermostat*: the number you set (state) *is* the temperature, and changing it drives the room. An uncontrolled input is a *thermometer on the wall*: it holds its own reading, and you only walk over and look (`ref.current.value`) when you actually need the number.

## 🔧 How it works

Controlled: keystroke → `onChange` → `setState` → re-render → input shows new `value`. Because the value round-trips through React, you can transform it on the way (uppercase, strip non-digits, cap length) and instantly reflect validity elsewhere (disable Submit).

Uncontrolled: keystroke → DOM updates itself, React does nothing. At submit you read `inputRef.current.value` once. Fewer renders, but the value is "invisible" to React until you look.

**When to use which:**
- **Controlled** (default in interviews): live validation, formatting as you type, dependent fields, disabling submit, anything where the UI reacts to the value. The OTP box is controlled for exactly this reason — it needs to act on every keystroke.
- **Uncontrolled**: simple forms you only read on submit, integrating non-React widgets, file inputs (`<input type="file">` is always uncontrolled), or perf-sensitive fields where per-keystroke renders hurt.

## 🗣️ Keywords to say

Single source of truth · `value` + `onChange` · `defaultValue` · ref-based read · re-render per keystroke · `type="file"` is always uncontrolled · derived/validated state.

## 🎯 How it's asked in interviews

- "What's the difference between controlled and uncontrolled components?"
- "This OTP input — is it controlled? Why did you choose that?"
- "When would you *prefer* uncontrolled?" (perf, non-React libs, file inputs, read-only-at-submit forms)
- Trap: calling an input controlled but forgetting `onChange` → React warns and the field is read-only. Say: "a `value` with no `onChange` freezes the input."
- Trap: switching an input from uncontrolled to controlled mid-life (value goes `undefined` → string) → React warning. Keep it one or the other.

**Model answer shape:** define both by *who owns the value*, give the `value`+`onChange` vs `defaultValue`+`ref` signatures, then say "controlled by default because it makes validation and derived UI trivial; uncontrolled when I only need the value at submit or I'm wrapping a non-React widget."

## 🔗 Linked concepts

- [OTP Input Box](001-otp-input-box.md) — a concrete controlled component; explains *why* controlled was the right call.
- [useRef & Refs](003-useref-and-refs.md) — refs are how you read an uncontrolled input's value.

## 🧠 Rapid-fire Q&A

**Q1. One-sentence difference?** Controlled = value lives in React state; uncontrolled = value lives in the DOM and you read it with a ref.

**Q2. What does a `value` prop without `onChange` do?** Makes the input read-only and triggers a React warning — you froze it.

**Q3. Which is `<input type="file">`?** Always uncontrolled — you can't set its value programmatically for security reasons; read `ref.current.files`.

**Q4. Why can controlled inputs feel slow in huge forms?** Every keystroke re-renders the component tree from that state; uncontrolled avoids per-keystroke renders.

**Q5. Why is the OTP box controlled?** It must react to every keystroke (validate digit, auto-advance, compute completeness) — that needs the value in state.

## ✅ Cheat lines

- **Controlled = React owns the value (`value`+`onChange`); uncontrolled = DOM owns it (`defaultValue`+ref).**
- `value` without `onChange` = frozen input + warning.
- Default to controlled; go uncontrolled for submit-only forms, file inputs, and non-React widgets.
- Never flip an input between the two during its life.
