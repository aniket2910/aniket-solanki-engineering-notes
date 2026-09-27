# Progress Bar

**Runnable code:** [`playground/src/problems/progress-bar/`](playground/src/problems/progress-bar/) — run with `cd playground && npm install && npm run dev`, then pick **Progress Bar** in the sidebar.

## ⚡ In one line

A progress bar is a determinate meter that maps a `value` between 0 and 100 to a visual fill — and the whole interview lives in **how you animate that fill**: scale a full-width block with `transform: scaleX()` (cheap, compositor-driven) instead of animating `width` (forces layout every frame).

## 🔍 What the interviewer is really testing

- **Do you know the browser rendering pipeline?** `width` animation reflows on every frame; `transform`/`opacity` are composited. Reaching for `transform: scaleX()` unprompted is the single strongest signal here. This is a *performance* question wearing a UI-component costume.
- **Accessibility instinct.** Two `<div>`s look like a progress bar; only `role="progressbar"` + `aria-valuenow/min/max` *is* one. Adding it without being asked reads as senior.
- **Clean decomposition.** A pure presentational `<ProgressBar value>` vs the stateful thing that drives it. Can you keep the bar dumb and lift the value?
- **The variant with a timer** (multiple bars filling in sequence) tests state-as-an-array + **interval cleanup** — do you clear the timer, or leak it?

## Why it exists (the problem)

Long operations — file upload, video buffering, a multi-step checkout — leave the user staring at nothing, unsure if the app froze. A progress bar converts invisible work into a visible, bounded expectation: "35% done, it's moving, it'll finish." It reduces perceived wait and prevents the user from rage-clicking or refreshing. **Determinate** bars show a real percentage; **indeterminate** ones (the endless shimmer) say "working, but I can't measure it."

## What it is

A container (the **track**) and an inner element (the **fill**) whose visible length is a function of `value / max`. Nothing more — the mental model is a **single number (0–100) rendered as length**. Everything interesting is the *how*:

- The value is **owned by a parent** (controlled). The bar is a pure function `value → bar`.
- The fill's length is animated. The choice of *which CSS property* you animate is the whole ballgame.

## 🎈 Real-life analogy (how to think about it)

Think of a **theatre stage with a red curtain** already covering the full width. To reveal "40% filled," you don't rebuild a smaller curtain each moment (that's animating `width` — the stage crew re-measures and re-hangs the curtain every frame → **layout/reflow**). Instead you keep the full curtain and **stretch/squeeze it on a rail from the left edge** — `transform: scaleX(0.4)` with `transform-origin: left`. The curtain is one fixed object sliding on a greased rail (the **compositor**); the stage itself never gets re-measured. Smooth, cheap, no crew scrambling.

The `%` number you print next to it is a **sign held by an usher standing beside the stage** — never pinned *to* the curtain, because a stretched curtain would stretch the sign's text with it.

## 🔧 How it works (under the hood)

**The browser rendering pipeline** — the reason `transform` wins:

```
JS → Style → Layout → Paint → Composite
              (reflow) (repaint)
```

- Animating **`width`** changes an element's geometry → the browser re-runs **Layout** (reflow), then **Paint**, then **Composite** — every single frame. Reflow can cascade to siblings/parents. Expensive.
- Animating **`transform: scaleX()`** or **`opacity`** touches only the **Composite** step. The layer is already painted; the GPU just re-positions/scales it. No layout, no repaint. This is why `transform` and `opacity` are "the two cheap-to-animate properties."

**Mechanism of the fill:**

1. Fill is `width: 100%` of the track — painted once at full size.
2. `transform: scaleX(var(--progress-scale))` squeezes it; `--progress-scale` is `value/100`.
3. `transform-origin: left` anchors the shrink to the left edge so it grows rightward, not from the centre.
4. `transition: transform 0.4s ease` gives the smooth glide between values.

**Why a CSS variable, not an inline `transform`:** the animated *value* is data, so it must reach the DOM somehow. Passing only the raw number as `--progress-scale` keeps the actual `transform`/`transition` **rules in the stylesheet** — presentation stays in CSS, only the datum crosses the boundary.

**The sequential variant** (`SequentialBars`): an array `fills: number[]`, one `setInterval` that, each tick, adds a step to the *currently active* bar; when that bar hits 100 it advances a `useRef` pointer to the next. The interval is torn down in the effect's cleanup. "Finished" is *derived* (`fills.every(f => f >= 100)`), not stored twice.

## 💻 In code

The whole reusable component is tiny — the craft is in the comments and the CSS, not the size:

```tsx
// ProgressBar.tsx — pure, presentational: value in, bar out.
const clamp = (n: number) => Math.min(100, Math.max(0, n)); // stay honest at 120 / -5

export default function ProgressBar({ value, label = "Progress" }: ProgressBarProps) {
  const pct = clamp(value);
  // Only the datum crosses into the DOM; the transform rule lives in CSS.
  const fillStyle = { "--progress-scale": pct / 100 } as CSSProperties;

  return (
    <div className="pb__row">
      <div
        className="pb__track"
        role="progressbar"          // ← makes it a real progress bar for a11y tech
        aria-label={label}
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="pb__fill" style={fillStyle} />
      </div>
      {/* label is a SIBLING of the fill — inside it, scaleX squashes the text */}
      <span className="pb__value">{Math.round(pct)}%</span>
    </div>
  );
}
```

```css
.pb__fill {
  width: 100%;                                  /* full size, painted once */
  transform-origin: left;                       /* grow from the left edge */
  transform: scaleX(var(--progress-scale, 0));  /* reveal by scaling, not resizing */
  transition: transform 0.4s ease;              /* only transform animates */
}
@media (prefers-reduced-motion: reduce) {       /* respect the OS setting */
  .pb__fill { transition: none; }
}
```

The **sequential bars** show the timer discipline — the part that trips people up:

```tsx
useEffect(() => {
  if (!running) return;
  const id = window.setInterval(() => {
    setFills((prev) => {                       // functional update: no stale closure
      const i = activeIndex.current;
      if (i >= prev.length) return prev;
      const next = [...prev];                  // never mutate state in place
      next[i] = Math.min(100, next[i] + STEP);
      if (next[i] >= 100) activeIndex.current += 1; // hand off to the next bar
      return next;
    });
  }, TICK_MS);
  return () => window.clearInterval(id);        // ← THE thing they're checking for
}, [running]);
```

Full source: [ProgressBar.tsx](playground/src/problems/progress-bar/ProgressBar.tsx), [SequentialBars.tsx](playground/src/problems/progress-bar/SequentialBars.tsx).

## 🏗️ Code quality & principles applied

**Decomposition — why these boundaries:**
- `<ProgressBar value>` owns exactly one job: *render one bar from a number*. It has no timers, no fetch, no idea what "upload" means. That's **Single Responsibility** — and it's why it's reusable in both the slider demo and the sequential queue.
- `<SequentialBars>` owns *sequencing* (which bar, when). It **composes** `<ProgressBar>` instead of re-drawing a bar — **composition over duplication**.
- The demo wrapper owns the demo-only slider state, so the reusable component stays pure — **lifting state up** / controlled component.

**Principles by name (say these):**
- "The bar is a **controlled, presentational component** — `value` is the single source of truth, so it's trivial to test and reuse." (**SoC / single source of truth**)
- "I animate `transform`, not `width`, so the animation stays on the **compositor** — no layout thrash." (**performance / rendering pipeline**)
- "Styling is in CSS; only the scale factor passes through as a **CSS custom property** — **separation of concerns**, no real inline styles."
- "'Finished' is **derived** from the fills array, not stored separately — one source of truth, no drift."
- "`role="progressbar"` and the `aria-value*` trio — **accessibility is part of done**, not a follow-up."

**The exact sentences that read senior:** *"I'll reveal the fill with `transform: scaleX` from a left origin instead of animating width — width would reflow every frame, scaleX is compositor-only, so it's smooth even under load."*

**What I deliberately did NOT do (judgment, not dogma):** no state-management library, no generic `<Meter>` abstraction, no config for orientation/theming nobody asked for — **KISS/YAGNI**. I kept the `%` label a plain sibling instead of counter-scaling text inside the fill — the simplest correct fix.

## 🗣️ Keywords to say

- **Reflow / layout vs repaint vs composite** — the pipeline; `width` hits layout, `transform` doesn't.
- **`transform: scaleX()` + `transform-origin`** — the cheap way to animate a fill.
- **Compositor / GPU-accelerated** — where `transform`/`opacity` animations run.
- **Determinate vs indeterminate** — known % vs unbounded "still working."
- **Controlled / presentational component** — value owned by parent, bar is pure.
- **`role="progressbar"`, `aria-valuenow/valuemin/valuemax`** — the accessibility contract.
- **`prefers-reduced-motion`** — the media query that disables the animation for users who ask.
- **Interval cleanup / effect teardown** — clearing `setInterval` in the effect's return.
- **Functional state update** — `setFills(prev => …)` to avoid stale closures inside a timer.
- **SRP, composition over inheritance, single source of truth, SoC** — the principle vocabulary.

## 🎯 How it's asked in interviews

**The same question in disguise** — recognize the pattern under the phrasing:
- "Build a progress bar." / "Build a loading bar / upload progress indicator."
- "Build a **multi-step / stepper progress** indicator." (segments instead of a continuous fill)
- "Build **N progress bars that fill one after another**." (the sequential variant — [SequentialBars](playground/src/problems/progress-bar/SequentialBars.tsx))
- "Build **concurrent progress bars** — clicking a button adds a bar, only K fill at a time, rest queue." (harder: a queue + concurrency limit)
- "Animate a bar from 0 to 100% smoothly." (this is secretly the `transform`-vs-`width` question)

**The follow-up ladder (how they go deeper when you answer well):**
1. "How do you animate it smoothly?" → `transition` on the fill.
2. "**Why `transform` and not `width`?**" → the pipeline answer. *This is the pivotal question.* Nail it and the level jumps.
3. "Make it accessible." → `role="progressbar"` + `aria-value*`.
4. "What about users with motion sensitivity?" → `prefers-reduced-motion`.
5. "Now make 4 of them fill in sequence." → array state + interval + **cleanup**.
6. "What if the timer keeps running after the component unmounts?" → they're checking your cleanup return.
7. "Value comes from a real upload's `onprogress` — any change?" → no, it's already controlled; just feed `loaded/total * 100` into `value`.

**Traps & gotchas:**
- **Animating `width`** and not being able to justify it — the classic miss.
- **Putting the `%` text inside the scaled fill** — `scaleX` horizontally squashes it. Keep the label outside (or counter-scale, but outside is simpler).
- **`transform-origin` left off** — the bar grows from the centre outward, which looks wrong.
- **Forgetting to clamp** — a parent passes `value={150}` and the fill overflows.
- **Rounded-corner distortion** — `scaleX` also scales the fill's right-edge `border-radius`. Fine for a pill track with `overflow: hidden` (the track's radius clips it); mention you'd animate `width` or use a mask if the fill's own rounded cap must keep its shape. Know the trade-off.
- **Leaking the interval** in the sequential variant — no cleanup return.
- **Mutating state array in place** (`fills[i] = …`) instead of copying — bar won't update / breaks.
- **Stale closure in the timer** — reading `fills` directly instead of the functional updater.

**Model answer sketch (flagship: "build an animated progress bar"):**
"I'll make a controlled presentational component — `value` 0–100 comes from the parent, so the bar is a pure function of it, and I'll clamp it defensively. Structure is a track div with a fill div inside. Now the key decision: I'll reveal the fill with `transform: scaleX(value/100)` from a left `transform-origin`, **not** by animating `width` — width re-runs layout every frame, `transform` stays on the compositor, so it's smooth. I'll pass the scale as a CSS variable so the transform rule stays in CSS. For accessibility I'll add `role="progressbar"` with `aria-valuenow/min/max`, and I'll respect `prefers-reduced-motion`. The `%` label goes *beside* the fill, not inside it, because `scaleX` would squash the text." — then code it, narrating each choice.

## 🔗 Linked concepts

- [Controlled vs Uncontrolled Components](002-controlled-vs-uncontrolled-components.md) — the bar is a controlled, value-owned component; interviewers pull on "who owns the value."
- [useRef & Refs](003-useref-and-refs.md) — the sequential variant stores the active-bar pointer in a ref (mutable, no re-render), same instinct as the OTP focus refs.
- [OTP Input Box](001-otp-input-box.md) — sibling machine-coding problem; both reward decomposition + a11y + narrating the craft.

*(Rendering-pipeline / reflow-vs-composite is a Frontend Fundamentals topic in its own right — when that note exists it links here; for now the depth lives inline above.)*

## 🧠 Rapid-fire Q&A

**Q: Why animate `transform: scaleX()` instead of `width`?**
A: `width` changes geometry, so the browser re-runs Layout (reflow) → Paint → Composite every frame, and reflow can cascade to other elements. `transform` only touches Composite — the layer is already painted, the GPU just scales it. Much cheaper and smoother.

**Q: You scaled the fill from full width — how do you keep it growing from the left?**
A: `transform-origin: left`. By default transforms scale around the centre, which would shrink the bar toward the middle.

**Q: Why is the `%` label a sibling of the fill and not inside it?**
A: `scaleX` scales the element *and its contents* horizontally, so text inside the fill gets squashed. Keeping the label outside the scaled element avoids the distortion.

**Q: Determinate vs indeterminate — when do you use which?**
A: Determinate when you know the fraction done (upload with `loaded/total`). Indeterminate (an animated shimmer, no fixed value) when the work's length is unknown — a request you can't measure. For indeterminate you drop `aria-valuenow` so assistive tech announces "busy," not a fake number.

**Q: What ARIA does a progress bar need?**
A: `role="progressbar"` plus `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and an accessible name (`aria-label`). That's what tells a screen reader it's a progress bar at value X of a range.

**Q: In the sequential-bars version, what's the one thing that most commonly breaks it?**
A: Not clearing the interval. Return `() => clearInterval(id)` from the effect — otherwise every re-run stacks another timer and it keeps ticking after unmount.

**Q: Why a functional update `setFills(prev => …)` inside the interval?**
A: The interval callback closes over the `fills` value from when the effect ran. Reading it directly gives a stale value. The functional updater always gets the latest state.

**Q: Why store the active-bar index in a `useRef` instead of `useState`?**
A: It's bookkeeping the interval reads, not something the UI renders. Putting it in state would trigger unnecessary re-renders; a ref is a mutable value that persists across renders without causing one.

**Q: How would you drive this from a real file upload?**
A: `XMLHttpRequest.upload.onprogress` (or a fetch stream) gives `loaded` and `total`; feed `Math.round(loaded/total*100)` into the bar's `value`. Nothing else changes — it's already controlled.

**Q: A user has motion sensitivity — what do you do?**
A: Wrap the `transition` in `@media (prefers-reduced-motion: reduce)` and disable it, so the bar snaps to each value instead of gliding.

## ✅ Cheat lines

- **"Reveal by scaling, not resizing"** — `transform: scaleX(value/100)` + `transform-origin: left`, never animate `width` (reflow every frame).
- **`transform` and `opacity` are the two compositor-cheap properties** — everything else can hit layout/paint.
- **A progress bar isn't real until it has `role="progressbar"` + `aria-valuenow/min/max`.**
- **Bar = pure controlled component; the value is lifted up.** Label sits *beside* the fill, never inside it.
- **Sequential bars = array state + one interval + `clearInterval` in cleanup**, and derive "done" instead of storing it.
