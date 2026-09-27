# async & defer (Script Loading)

Run the code: `node playground/run.js JS async-defer` — see [`demo.js`](demo.js) (prints the three timelines; the behavior described is real browser behavior, which needs an actual HTML parser to observe live).

## ⚡ In one line

`async` and `defer` are `<script>` attributes that let the script **download in parallel** with HTML parsing instead of blocking it — **`defer`** runs scripts after parsing finishes, **in order**; **`async`** runs each one as soon as it downloads, **order not guaranteed**.

## 🔍 What the interviewer is really testing

- **Do you know a plain `<script>` blocks HTML parsing** — and why that hurts page load?
- **Can you explain the difference** between `async` and `defer` precisely (execution timing + ordering)?
- **Do you know which to use when** — dependent/DOM-touching scripts vs independent ones?
- **Do you know modules are deferred by default** and where scripts should go?

## Why it exists (the problem)

The HTML parser builds the DOM top to bottom. When it hits a plain `<script>`, it **stops** — it must fetch and execute the script before continuing, because the script might `document.write` or change the DOM. A big script in the `<head>` therefore freezes rendering until it's downloaded and run, making the page feel slow and blank. `async` and `defer` decouple *downloading* (which can safely happen in parallel) from *when the script runs*, so parsing isn't blocked by the network.

## What it is

Three behaviors for an external `<script src>`:

- **Plain `<script>`** — parser pauses, fetches, executes, then resumes. Fetch **and** execution block parsing. Placing it at the **end of `<body>`** is the old fix (the DOM is already parsed by then).
- **`<script async>`** — fetch happens **in parallel** with parsing; the moment it's downloaded, parsing **pauses** and it executes, then parsing resumes. With multiple async scripts, they run **in whatever order they finish downloading** — no guaranteed order, and they don't wait for the DOM.
- **`<script defer>`** — fetch **in parallel** with parsing, but execution is **deferred until parsing completes**, and multiple deferred scripts run **in document order**, right before `DOMContentLoaded`.

**Both `async` and `defer` only apply to external scripts** (`src`); they're ignored on inline scripts.

**Mental model:** parsing the HTML is you reading a book. A plain `<script>` is a phone call you must take *right now*, stopping your reading. `defer` is a voicemail you'll listen to (in order) once you finish the chapter. `async` is a call you take the instant it rings — interrupting wherever you are — and if several ring, you answer whichever connects first.

## 🎈 Real-life analogy (how to think about it)

**Building a house (the DOM) while ordering fixtures (scripts).**
- **Plain script:** the builder stops all work, drives to the store, buys the fixture, installs it, then resumes — everything waits.
- **`defer`:** fixtures are delivered *while* building continues, and installed **in the planned order** only after the house frame is complete. Predictable and safe for things that depend on the finished frame.
- **`async`:** each fixture is installed the instant it arrives, pausing whatever the builder was doing — fast, but if two arrive, the order is just "whoever's truck got there first." Fine for independent add-ons (a doorbell, a mailbox) that don't depend on anything else.

## 🔧 How it works (under the hood)

Timeline comparison (what [`demo.js`](demo.js) prints):

```text
plain  : parse ──►[stop: fetch+execute script]──► resume parse ──► done
async  : parse ──────────────► (script arrives) [pause: execute] ► resume ► done
         (download runs in parallel; execution interrupts parse whenever ready)
defer  : parse ───────────────────────────────► done ► execute scripts (in order) ► DOMContentLoaded
         (download runs in parallel; execution waits for parse to finish)
```

Key consequences:
- **`defer` guarantees order and a ready DOM** — safe for scripts that touch the DOM or depend on earlier scripts.
- **`async` guarantees neither order nor a ready DOM** — only safe for standalone scripts (analytics, ads) that don't depend on other scripts or on the full DOM.
- **`DOMContentLoaded`** fires after the HTML is parsed and all `defer` scripts have run; `async` scripts may run before or after it.
- **ES modules** (`<script type="module">`) are **deferred by default** (and always run in a module scope, once). Add `async` to a module to opt into async behavior.

## 💻 In code

The three declarations:

```html
<!-- blocks parsing while it fetches + runs (avoid in <head>) -->
<script src="app.js"></script>

<!-- fetch in parallel; run ASAP, order NOT guaranteed; DOM may not be ready -->
<script async src="analytics.js"></script>

<!-- fetch in parallel; run after parse, IN ORDER; DOM is ready -->
<script defer src="lib.js"></script>
<script defer src="app.js"></script> <!-- runs after lib.js -->

<!-- modules are deferred by default -->
<script type="module" src="main.js"></script>
```

## 🏗️ Code quality & principles applied

This is a performance/loading topic; the "quality" is choosing the right strategy:

- **Default to `defer` for app scripts** — parallel download, ordered execution, DOM ready. Say: *"I put app scripts in the `<head>` with `defer` so they download during parsing but run in order after the DOM is built — best of both."*
- **Use `async` only for truly independent scripts** — analytics, ad tags — where order and DOM readiness don't matter. Say: *"Analytics is standalone, so `async` — I don't care when it runs or in what order."*
- **Avoid render-blocking scripts in `<head>`** — a plain `<script>` there delays first paint; measure with Lighthouse.
- **Prefer modules** where possible — deferred by default and scoped, avoiding global leakage.

**Say in the room:** *"A plain script blocks parsing, hurting load time. `defer` downloads in parallel and executes in order after parsing — right for anything that touches the DOM or depends on another script. `async` runs whenever it arrives with no ordering — right only for independent scripts."*

**What you deliberately did NOT do:** you didn't dump scripts at the end of `<body>` as the only tool (a `defer` in `<head>` starts the download *earlier* while still running after parse), and you didn't `async` a script that depends on another (which would break unpredictably).

## 🗣️ Keywords to say

- **Render/parser-blocking** — a plain script pausing HTML parsing.
- **`defer`** — parallel download, execute after parse, in document order.
- **`async`** — parallel download, execute on arrival, order not guaranteed.
- **`DOMContentLoaded`** — fires after parse + all `defer` scripts.
- **Document order** — the ordering `defer` preserves.
- **Modules deferred by default** — `<script type="module">`.
- **External-only** — `async`/`defer` are ignored on inline scripts.

## 🎯 How it's asked in interviews

**The question, disguised:**
- "Difference between `async` and `defer`?"
- "Where should you put `<script>` tags and why?"
- "How do you stop a script from blocking page render?"
- "Which one preserves execution order?" → `defer`.
- "If script B depends on A, which attribute?" → `defer` (async could run B first).
- "How do `type=module` scripts load?"

**Follow-up ladder:** plain script blocks parsing → `body`-end fix → `defer` (order + DOM ready) → `async` (no order/DOM) → which for dependent vs independent → `DOMContentLoaded` timing → modules default to defer.

**Traps & gotchas:**
- Saying `async` and `defer` are the same "load in background" — the **execution timing and ordering** differ.
- Using `async` for interdependent scripts — breaks because order isn't guaranteed.
- Assuming `async` waits for the DOM — it doesn't; it may run before parsing finishes.
- Forgetting `async`/`defer` don't apply to inline scripts.
- Not knowing modules are deferred by default.

**Model answer sketch** ("async vs defer"): *"A plain `<script>` blocks HTML parsing while it downloads and runs. Both `async` and `defer` download in parallel with parsing — the difference is execution. `defer` waits until parsing is done and runs deferred scripts in document order, so the DOM is ready and dependencies work — that's my default for app code. `async` runs each script the moment it finishes downloading, interrupting parsing, with no guaranteed order — so it's only for independent scripts like analytics. And ES modules are deferred by default."*

## 🔗 Linked concepts

- **[Event loop](../event-loop/notes.md)** — script execution and `DOMContentLoaded` are part of the browser's task scheduling.
- **[Fetch](../fetch/notes.md)** / **[CORS](../cors-preflight/notes.md)** — the broader browser-runtime picture.

## 🧠 Rapid-fire Q&A

**Q: What does a plain `<script>` do to parsing?**
Blocks it — the parser stops to fetch and execute the script, then resumes.

**Q: `async` vs `defer` in one line?**
Both download in parallel; `defer` executes after parsing in order, `async` executes on arrival with no guaranteed order.

**Q: Which preserves execution order?**
`defer` (document order). `async` does not.

**Q: Script B depends on A — which attribute?**
`defer` for both — `async` might run B before A.

**Q: Does `async` guarantee the DOM is ready?**
No — it can run before parsing finishes. `defer` runs after the DOM is parsed.

**Q: How do `type="module"` scripts load?**
Deferred by default (parallel download, execute after parse, in order), in module scope.

**Q (design): What's your default for app scripts and why?**
`defer` in the `<head>` — download starts early during parsing, execution is ordered and after the DOM is ready.

## ✅ Cheat lines

- **Plain `<script>` blocks parsing (fetch + execute).**
- **`defer` = parallel download, run after parse, IN ORDER (DOM ready) — default for app code.**
- **`async` = parallel download, run on arrival, NO order (DOM maybe not ready) — for independent scripts.**
- **`defer` preserves order; `async` doesn't. Dependencies → `defer`.**
- **ES modules are deferred by default; `async`/`defer` are ignored on inline scripts.**
