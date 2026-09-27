# React Interview Playground

**One** React app that hosts **every** React problem in this notebook. There is no per-problem setup — you add a folder and register it, and it shows up in the sidebar.

## Run it

```bash
npm install   # first time only
npm run dev
```

Open the printed `localhost` URL and pick a problem from the sidebar.

## Structure

```
playground/
├── index.html, vite.config.ts, tsconfig.json, package.json   # shared setup (touch rarely)
└── src/
    ├── main.tsx          # entry
    ├── App.tsx           # sidebar + stage shell (never needs editing)
    ├── app.css           # shell styling
    └── problems/
        ├── registry.tsx  # the list of problems — add yours here
        └── <slug>/       # one folder per problem
            ├── index.tsx # default export = the demo component shown in the stage
            ├── *.tsx      # the actual components (keep each < ~120 lines; split & compose)
            └── *.css      # styles (no inline styles)
```

## Add a new problem

1. Create `src/problems/<slug>/` (slug matches the note file, e.g. `otp-input-box`).
2. Build the components there. Keep each component under ~120 lines — split into smaller ones and compose. Styling goes in a `.css` file, never inline.
3. Give the folder an `index.tsx` whose default export is the demo (component + any demo-only state).
4. Register it in `src/problems/registry.tsx`:
   ```tsx
   import MyProblemDemo from "./my-slug";
   // ...add to the array:
   { slug: "my-slug", title: "My Problem", Component: MyProblemDemo },
   ```
5. The written deep-dive lives at `../<NNN>-<slug>.md` (one level up, alongside the other notes).

## Problems

| Problem | Note | Code |
|---------|------|------|
| OTP Input Box | [001-otp-input-box.md](../001-otp-input-box.md) | [`src/problems/otp-input-box/`](src/problems/otp-input-box/) |
| Progress Bar | [004-progress-bar.md](../004-progress-bar.md) | [`src/problems/progress-bar/`](src/problems/progress-bar/) |
| Debounced Input | [005-debounce-input.md](../005-debounce-input.md) | [`src/problems/debounce-input/`](src/problems/debounce-input/) |
| File System Data Layer | [006-file-system.md](../006-file-system.md) | [`src/problems/file-system/`](src/problems/file-system/) |
| File System v2 (60-min) | [007-file-system-v2.md](../007-file-system-v2.md) | [`src/problems/file-system-v2/`](src/problems/file-system-v2/) |
