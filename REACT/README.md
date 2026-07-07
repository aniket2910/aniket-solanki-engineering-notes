# ⚛️ React Interview Revision Hub

This directory is a **deep-dive React interview revision notebook**. Unlike a typical Q&A cheat sheet, every answer goes beyond stating the fact — it reconstructs *why the problem existed in the first place*, walks through the *naive first thought process*, and builds the *intuition* so the answer is derivable from first principles in a real interview, not memorized.

> [!NOTE]
> The raw 75-question source list (topic + difficulty index) lives at [`../react.md`](../react.md). That file is the **unprocessed source of truth** dumped from a NamasteDev interview guide PDF — messy formatting, no deep explanations. This `REACT/` folder is where each of those questions gets rewritten properly, one at a time, as they're worked through.

---

## 🧠 The Answer Format (every file follows this shape)

1. **Real-Life Analogy** — a relatable, non-tech scenario that mirrors the underlying problem.
2. **Why This Problem Occurs** — the historical/technical root cause. What broke without this feature?
3. **First Thought Process** — how you'd derive the concept live in an interview if you forgot the textbook definition.
4. **The Intuition** — the mental model that makes the concept "click" permanently.
5. **Core Definition + Code** — the crisp technical answer + a working example.
6. **Mistakes Candidates Make** — common traps interviewers watch for.
7. **One-Line Answer to Memorize** — the elevator-pitch sentence for a live round.

---

## 📊 Progress

| Metric | Count |
| :--- | :---: |
| 🚀 **Total Questions in Source** | **75** |
| ✅ **Deep-Dive Answers Written** | **1** |
| ⬜ **Pending** | **74** |

---

## 📂 Topic Index

Questions are regrouped from the original flat 1–75 list into coherent topic folders (mirroring the [`DSA`](../DSA/README.md) notebook structure).

1. **[00. React Fundamentals](./00_REACT_FUNDAMENTALS/README.md)** — What React is, Node vs Element vs Component, JSX, one-way data flow, why hooks exist.
2. **01. State & Props** *(planned)* — state vs props, immutability, `setState` callback form, `useReducer`, resetting state.
3. **02. Lists, Keys & Rendering** *(planned)* — `key` prop, re-renders, Fragments, Virtual DOM, Fiber, reconciliation, time slicing.
4. **03. Hooks Deep Dive** *(planned)* — rules of hooks, `useEffect` vs `useLayoutEffect`, dependency arrays, `useRef`, `useCallback`, `useMemo`, `useId`, custom hooks, cleanup.
5. **04. Forms & Controlled Components** *(planned)* — controlled vs uncontrolled inputs.
6. **05. Context API & Global State** *(planned)* — context pitfalls, re-render optimization, Flux pattern.
7. **06. Performance Optimization** *(planned)* — code splitting, `React.memo`, Suspense, optimistic UI, large-app optimization.
8. **07. SSR, Hydration & Architecture** *(planned)* — hydration, SSR/SSG, `render` vs `hydrate`, server vs client components.
9. **08. Component Patterns & Architecture** *(planned)* — `forwardRef`, error boundaries, Portals, HOCs, render props, presentational/container pattern.
10. **09. Testing, Debugging & Tooling** *(planned)* — testing strategy, debugging, Strict Mode.
11. **10. Data Fetching, Events & Misc** *(planned)* — i18n, async data loading, the synthetic event system, accessibility.

Folders are created lazily — a topic folder and its `README.md` catalog get created the moment the first question in that topic is answered.

---

## 📋 Master Question Tracker

All 75 questions from the source doc, mapped to their target topic folder.

| # | Question | Topic Folder | Status |
| :---: | :--- | :--- | :---: |
| 1 | What is React? Describe the benefits of React | [00_REACT_FUNDAMENTALS](./00_REACT_FUNDAMENTALS/001-easy-what-is-react-and-its-benefits.md) | ✅ |
| 2 | Difference between React Node, React Element, and a React Component | 00_REACT_FUNDAMENTALS | ⬜ |
| 3 | What is JSX and how does it work? | 00_REACT_FUNDAMENTALS | ⬜ |
| 4 | Difference between state and props | 01_STATE_AND_PROPS | ⬜ |
| 5 | Purpose of the `key` prop | 02_LISTS_KEYS_AND_RENDERING | ⬜ |
| 6 | Consequence of using array indices as `key` | 02_LISTS_KEYS_AND_RENDERING | ⬜ |
| 7 | Controlled vs uncontrolled components | 04_FORMS_AND_CONTROLLED_COMPONENTS | ⬜ |
| 8 | Pitfalls of using Context in React | 05_CONTEXT_API_AND_GLOBAL_STATE | ⬜ |
| 9 | Benefits of using hooks | 03_HOOKS_DEEP_DIVE | ⬜ |
| 10 | Rules of React hooks | 03_HOOKS_DEEP_DIVE | ⬜ |
| 11 | `useEffect` vs `useLayoutEffect` | 03_HOOKS_DEEP_DIVE | ⬜ |
| 12 | Purpose of `setState()` callback argument format | 01_STATE_AND_PROPS | ⬜ |
| 13 | What the dependency array of `useEffect` affects | 03_HOOKS_DEEP_DIVE | ⬜ |
| 14 | `useRef` hook — when to use it | 03_HOOKS_DEEP_DIVE | ⬜ |
| 15 | `useCallback` hook — when to use it | 03_HOOKS_DEEP_DIVE | ⬜ |
| 16 | `useMemo` hook — when to use it | 03_HOOKS_DEEP_DIVE | ⬜ |
| 17 | `useReducer` hook — when to use it | 01_STATE_AND_PROPS | ⬜ |
| 18 | `useId` hook — when to use it | 03_HOOKS_DEEP_DIVE | ⬜ |
| 19 | What re-rendering means in React | 02_LISTS_KEYS_AND_RENDERING | ⬜ |
| 20 | What React Fragments are used for | 02_LISTS_KEYS_AND_RENDERING | ⬜ |
| 21 | What `forwardRef()` is used for | 08_COMPONENT_PATTERNS_AND_ARCHITECTURE | ⬜ |
| 22 | How to reset a component's state | 01_STATE_AND_PROPS | ⬜ |
| 23 | Why React recommends against mutating state | 01_STATE_AND_PROPS | ⬜ |
| 24 | What error boundaries are for | 08_COMPONENT_PATTERNS_AND_ARCHITECTURE | ⬜ |
| 25 | How to test React applications | 09_TESTING_DEBUGGING_AND_TOOLING | ⬜ |
| 26 | What React hydration is | 07_SSR_HYDRATION_AND_ARCHITECTURE | ⬜ |
| 27 | What React Portals are used for | 08_COMPONENT_PATTERNS_AND_ARCHITECTURE | ⬜ |
| 28 | How to debug React applications | 09_TESTING_DEBUGGING_AND_TOOLING | ⬜ |
| 29 | What React Strict Mode is and its benefits | 09_TESTING_DEBUGGING_AND_TOOLING | ⬜ |
| 30 | How to localize React applications | 10_DATA_FETCHING_EVENTS_AND_MISC | ⬜ |
| 31 | What code splitting is | 06_PERFORMANCE_OPTIMIZATION | ⬜ |
| 32 | Optimizing React context to reduce re-renders | 05_CONTEXT_API_AND_GLOBAL_STATE | ⬜ |
| 33 | What higher order components (HOCs) are | 08_COMPONENT_PATTERNS_AND_ARCHITECTURE | ⬜ |
| 34 | The Flux pattern and its benefits | 05_CONTEXT_API_AND_GLOBAL_STATE | ⬜ |
| 35 | One-way data flow of React and its benefits | 00_REACT_FUNDAMENTALS | ⬜ |
| 36 | Handling asynchronous data loading | 10_DATA_FETCHING_EVENTS_AND_MISC | ⬜ |
| 37 | Server-side rendering and its benefits | 07_SSR_HYDRATION_AND_ARCHITECTURE | ⬜ |
| 38 | Static generation and its benefits | 07_SSR_HYDRATION_AND_ARCHITECTURE | ⬜ |
| 39 | Presentational vs container component pattern | 08_COMPONENT_PATTERNS_AND_ARCHITECTURE | ⬜ |
| 40 | Common pitfalls when doing data fetching | 10_DATA_FETCHING_EVENTS_AND_MISC | ⬜ |
| 41 | Role of keys in React lists | 02_LISTS_KEYS_AND_RENDERING | ⬜ |
| 42 | What fragments are and why useful | 02_LISTS_KEYS_AND_RENDERING | ⬜ |
| 43 | Controlled and uncontrolled components (again) | 04_FORMS_AND_CONTROLLED_COMPONENTS | ⬜ |
| 44 | Use of the Context API | 05_CONTEXT_API_AND_GLOBAL_STATE | ⬜ |
| 45 | React hooks and why they were introduced | 00_REACT_FUNDAMENTALS | ⬜ |
| 46 | How the virtual DOM works, benefits/downsides | 02_LISTS_KEYS_AND_RENDERING | ⬜ |
| 47 | What React Fiber is and its improvements | 02_LISTS_KEYS_AND_RENDERING | ⬜ |
| 48 | What reconciliation is | 02_LISTS_KEYS_AND_RENDERING | ⬜ |
| 49 | What React Suspense enables | 06_PERFORMANCE_OPTIMIZATION | ⬜ |
| 50 | What happens when `useState` setter is called | 01_STATE_AND_PROPS | ⬜ |
| 51 | `React.memo` vs `useMemo` | 06_PERFORMANCE_OPTIMIZATION | ⬜ |
| 52 | How React handles events differently from DOM | 10_DATA_FETCHING_EVENTS_AND_MISC | ⬜ |
| 53 | React reconciliation in detail | 02_LISTS_KEYS_AND_RENDERING | ⬜ |
| 54 | "Time slicing" in React Fiber | 02_LISTS_KEYS_AND_RENDERING | ⬜ |
| 55 | Custom hooks — example use case | 03_HOOKS_DEEP_DIVE | ⬜ |
| 56 | Optimizing a large React app | 06_PERFORMANCE_OPTIMIZATION | ⬜ |
| 57 | React Suspense for Data Fetching vs `useEffect` | 06_PERFORMANCE_OPTIMIZATION | ⬜ |
| 58 | Client-side vs server-side routing | 07_SSR_HYDRATION_AND_ARCHITECTURE | ⬜ |
| 59 | `React.StrictMode` detecting unsafe lifecycles | 09_TESTING_DEBUGGING_AND_TOOLING | ⬜ |
| 60 | `ReactDOM.render` vs `ReactDOM.hydrate` | 07_SSR_HYDRATION_AND_ARCHITECTURE | ⬜ |
| 61 | Render props vs HOCs | 08_COMPONENT_PATTERNS_AND_ARCHITECTURE | ⬜ |
| 62 | `useEffect` cleanup vs `componentWillUnmount` | 03_HOOKS_DEEP_DIVE | ⬜ |
| 63 | Subscribing to an external data source + cleanup | 03_HOOKS_DEEP_DIVE | ⬜ |
| 64 | Server components vs client components | 07_SSR_HYDRATION_AND_ARCHITECTURE | ⬜ |
| 65 | Preventing unnecessary re-renders | 06_PERFORMANCE_OPTIMIZATION | ⬜ |
| 66 | `React.memo` and when to use it | 06_PERFORMANCE_OPTIMIZATION | ⬜ |
| 67 | `React.memo` vs `useMemo` (again) | 06_PERFORMANCE_OPTIMIZATION | ⬜ |
| 68 | React event system vs native DOM events | 10_DATA_FETCHING_EVENTS_AND_MISC | ⬜ |
| 69 | Custom hooks — why use them | 03_HOOKS_DEEP_DIVE | ⬜ |
| 70 | Time slicing — why it's important | 02_LISTS_KEYS_AND_RENDERING | ⬜ |
| 71 | Implementing optimistic UI updates | 06_PERFORMANCE_OPTIMIZATION | ⬜ |
| 72 | Handling accessibility (a11y) | 10_DATA_FETCHING_EVENTS_AND_MISC | ⬜ |
| 73 | React Portals — complex example | 08_COMPONENT_PATTERNS_AND_ARCHITECTURE | ⬜ |
| 74 | Shallow rendering vs full DOM rendering (testing) | 09_TESTING_DEBUGGING_AND_TOOLING | ⬜ |
| 75 | Server components vs client components (again) | 07_SSR_HYDRATION_AND_ARCHITECTURE | ⬜ |

---

## 📈 Workflow

* Next question (with its "Interview Scenarios" block) gets pulled from `react.md`.
* The full deep-dive file is written using the format above and dropped into the right topic folder.
* This README's tracker and progress table get updated after every question.
* Topics beyond this 75-question list (Node.js, System Design, etc.) will get their own top-level folders when those begin.
