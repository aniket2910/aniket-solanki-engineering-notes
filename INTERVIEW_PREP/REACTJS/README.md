# React JS — Interview Prep

Interview-ready notes for React: machine-coding components, hooks, rendering, and the concepts interviewers pull on. Each note is self-contained and framed for the room — analogy, keywords to say, code-quality principles, how it's asked, and rapid-fire Q&A.

All runnable code lives in **one shared app**, [`playground/`](playground/README.md) — no per-problem setup. Each problem is a component under `playground/src/problems/<slug>/`; the written note sits here at the subject root as `NNN-<slug>.md`.

## Run the playground

```bash
cd playground && npm install && npm run dev
```

Pick a problem from the sidebar. To add one, see [playground/README.md](playground/README.md).

## Notes

| ID | Topic | One-line hook | Runnable |
|----|-------|---------------|----------|
| 001 | [OTP Input Box](001-otp-input-box.md) | Row of boxes over one array of state; data in state, focus in refs. | [code](playground/src/problems/otp-input-box/) |
| 002 | [Controlled vs Uncontrolled Components](002-controlled-vs-uncontrolled-components.md) | Who owns the input value — React state, or the DOM. | — |
| 003 | [useRef & Refs](003-useref-and-refs.md) | Mutable `.current` that persists across renders without triggering one. | — |
| 004 | [Progress Bar](004-progress-bar.md) | Reveal the fill with `transform: scaleX()`, not `width` — it's the rendering-pipeline question in disguise. | [code](playground/src/problems/progress-bar/) |
| 005 | [Debounced Input](005-debounce-input.md) | Fire the search only when typing pauses; the React trick is a debounced fn that survives re-renders (`useMemo`/`useRef`). | [code](playground/src/problems/debounce-input/) |
| 006 | [File System Data Layer (Drive / Explorer)](006-file-system.md) | Normalize the tree: flat map by id + `parentId`/`childIds`, pure immutable ops, features as id-keyed slices. | [code](playground/src/problems/file-system/) |
| 007 | [File System Data Layer — v2 (60-min)](007-file-system-v2.md) | The same design, sized to type in a live round: phase-by-phase plan, what to say, and what to cut. | [code](playground/src/problems/file-system-v2/) |

🎯 **Goal:** build core React components live *and* narrate the engineering behind them — decomposition, principles, and the words that make an interviewer mark you senior.
