# Fetch

Run the code: `node playground/run.js JS fetch` — see [`demo.js`](demo.js) (uses a small offline stand-in so it runs without a network; the consuming code is exactly what you'd write against the real `fetch`).

Built on [promises](../promises/notes.md); cross-origin behavior is in [CORS & preflight](../cors-preflight/notes.md).

## ⚡ In one line

`fetch(url, options)` makes an HTTP request and returns a **promise that resolves to a `Response`** — but it only **rejects on a network failure**, so a 404 or 500 still resolves and you must check `response.ok` yourself; reading the body (`response.json()`) is a second async step.

## 🔍 What the interviewer is really testing

- **Do you know fetch doesn't reject on HTTP errors** (4xx/5xx)? This is *the* fetch gotcha.
- **Do you know reading the body is async** and returns a promise (`.json()`/`.text()`)?
- **Can you write robust request code** — check `ok`, parse, handle both network and HTTP errors?
- **Do you know the extras** — request options (method/headers/body), `AbortController` for cancellation/timeout, and that it's promise-based?

## Why it exists (the problem)

The old `XMLHttpRequest` API was verbose and event-based (`onreadystatechange`, ready states). `fetch` is the modern, **promise-based** replacement: a clean call that returns a promise you can `await` or chain, integrating with the rest of async JS. The one design choice that surprises people — resolving on HTTP errors — exists because *the request succeeded*; a 404 is a valid HTTP response, not a transport failure. fetch only treats *transport* problems (DNS failure, connection dropped, CORS block) as rejections.

## What it is

`fetch` returns a promise resolving to a **`Response`** object with:
- **`response.ok`** — `true` only for status **200–299**. Your first check.
- **`response.status`** — the HTTP status code.
- **Body readers** — `response.json()`, `.text()`, `.blob()`, etc. Each is **async** (returns a promise) and can be read **only once**.

Options as a second argument: `{ method, headers, body, credentials, signal, mode, ... }`. For JSON you set `headers: { "Content-Type": "application/json" }` and `body: JSON.stringify(...)`.

**The robust pattern:** `await fetch` → check `response.ok` (throw if not) → `await response.json()` → wrap in `try/catch` so network *and* HTTP errors land in one place.

**Mental model:** fetch is like **ordering delivery and getting a confirmation that a driver was dispatched**. The promise resolving means "a response came back" — even if that response is "we're closed" (404). Only "no driver could be dispatched at all" (network down) is a rejection. And opening the box to see what's inside (`.json()`) takes another moment.

## 🎈 Real-life analogy (how to think about it)

**Sending a letter and getting a reply envelope.** The postal system delivering *a* reply is the promise resolving — but the letter inside might say "request denied" (a 404/500). The delivery succeeding doesn't mean the *answer* was yes; you have to open the envelope and read it (`response.ok`, then `.json()`). Only if the mail truck crashes and nothing comes back (network error) does the whole thing "reject."

## 🔧 How it works (under the hood)

```text
fetch(url)                 -> returns a promise
  network failure/CORS     -> promise REJECTS (goes to catch)
  any HTTP response (200..599) -> promise RESOLVES with a Response
await response             -> you have headers + status, but NOT the body yet
response.ok?               -> false for 4xx/5xx -> you decide to throw
await response.json()      -> reads + parses the body (async, one-time)
```

Two async steps, two awaits. The body is a stream, which is why reading it is asynchronous and single-use — calling `.json()` twice throws "body already read."

**Cancellation / timeout:** pass a `signal` from an `AbortController`; call `controller.abort()` to cancel (the fetch promise rejects with an `AbortError`). A timeout is `AbortController` + `setTimeout(() => controller.abort(), ms)` (or `AbortSignal.timeout(ms)`).

**Cross-origin:** the browser enforces the same-origin policy; cross-origin requests need CORS headers from the server, and some trigger a **preflight** — see [CORS & preflight](../cors-preflight/notes.md). (This is browser-only; server-to-server fetch has no CORS.)

## 💻 In code

The correct pattern from [`demo.js`](demo.js):

```js
async function getUser(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {                      // 404/500 resolves — check it!
      throw new Error("HTTP error " + response.status);
    }
    const data = await response.json();      // body read is async too
    return data;
  } catch (err) {
    console.error("failed:", err.message);   // network AND HTTP errors land here
  }
}
```

A POST with a JSON body:

```js
await fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Aniket" }),
});
```

The classic bug — skipping the `ok` check lets a 404 body flow through as if it were real data.

## 🏗️ Code quality & principles applied

**Decomposition — separate transport, validation, and parsing.** One helper does request + `ok` check + parse + error handling, so call sites just `await getUser(url)`.

**Principles by name:**
- **Explicit error handling / fail fast** — check `response.ok` and throw; don't assume 200. Say: *"fetch resolves on 4xx, so I check `ok` and throw, catching network and HTTP failures in one place."*
- **DRY** — wrap the fetch-check-parse pattern in a reusable function instead of repeating it per call.
- **Separation of concerns** — the data layer owns fetching/parsing; the UI just consumes the result.
- **Resource cleanup / robustness** — use `AbortController` to cancel in-flight requests (on unmount, or a newer request superseding an old one) and to implement timeouts.

**Say while coding:** *"I'll wrap this so `ok` is checked and errors are centralized. For a component I'd pass an `AbortController` signal and abort on unmount to avoid setting state on a dead component."*

**What you deliberately did NOT do:** you didn't assume the promise rejecting is enough (it isn't for HTTP errors), and you didn't read the body before checking `ok` in a way that hides failures. You also wouldn't hand-roll retries/timeouts inline everywhere — factor them into the helper (DRY).

## 🗣️ Keywords to say

- **Promise-based** — fetch returns a promise; integrates with `await`.
- **`Response.ok` / `status`** — success is 200–299; you must check it.
- **Rejects only on network failure** — 4xx/5xx resolve.
- **Body readers (`json`/`text`/`blob`)** — async, single-use.
- **Request options** — `method`, `headers`, `body`, `credentials`, `mode`, `signal`.
- **`AbortController` / `signal`** — cancellation and timeouts.
- **CORS / same-origin** — cross-origin requests need server CORS headers.

## 🎯 How it's asked in interviews

**The question, disguised:**
- "Does `fetch` reject on a 404?" — no; check `response.ok`.
- "Write a function to fetch JSON with proper error handling."
- "Why do you need two awaits with fetch?"
- "How do you cancel a fetch / add a timeout?" → `AbortController`.
- "fetch vs XMLHttpRequest / axios?" — promise-based, streaming body, no built-in `ok`-throwing (axios throws on non-2xx and auto-parses JSON).
- "Why is my cross-origin fetch blocked?" → [CORS](../cors-preflight/notes.md).

**Follow-up ladder:** basic fetch → check `ok` + parse → error handling for network vs HTTP → POST with headers/body → cancellation/timeout with `AbortController` → cross-origin/CORS → fetch vs axios.

**Traps & gotchas:**
- **Assuming a 404/500 rejects** — it resolves; the top mistake.
- **Forgetting the body read is async** — `response.json()` returns a promise.
- **Reading the body twice** — it's a one-time stream; the second read throws.
- **Not setting `Content-Type`/stringifying** for JSON POSTs.
- **Uncancelled fetches in components** — setting state after unmount; use `AbortController`.
- **Expecting fetch to send cookies cross-origin by default** — it doesn't unless `credentials: "include"` (and the server allows it).

**Model answer sketch** ("fetch JSON safely"): *"`fetch` returns a promise that resolves to a `Response`, and it only rejects on a network failure — a 404 or 500 still resolves, so I check `response.ok` and throw if it's false. Then I `await response.json()`, which is itself async because the body is a stream. I wrap both in a `try/catch` so network errors and the HTTP error I throw are handled in one place, and I'd factor this into a reusable helper. For robustness I pass an `AbortController` signal to support cancellation and timeouts, and abort on unmount in a component."*

## 🔗 Linked concepts

- **[Promises](../promises/notes.md)** — fetch is promise-based; everything here is promise handling.
- **[async/await](../async-await/notes.md)** — the two-await pattern.
- **[CORS & preflight](../cors-preflight/notes.md)** — why cross-origin fetches get blocked.

## 🧠 Rapid-fire Q&A

**Q: Does fetch reject on HTTP 404?**
No. It resolves with a `Response`; only network failures reject. Check `response.ok`.

**Q: Why two awaits?**
One for the response (headers/status), one for reading the body (`response.json()` is async).

**Q: How do you check for success?**
`response.ok` (true for 200–299) or inspect `response.status`.

**Q: How do you cancel a fetch or add a timeout?**
`AbortController` — pass its `signal` to fetch and call `abort()` (or `AbortSignal.timeout(ms)`).

**Q: Can you read the body twice?**
No — it's a one-time stream; a second `.json()`/`.text()` throws.

**Q: fetch vs axios?**
fetch is built-in and promise-based but doesn't throw on non-2xx and needs manual JSON parsing; axios throws on error statuses and auto-parses JSON.

**Q (design): Why centralize the fetch-check-parse logic?**
DRY and consistent error handling — every call gets the `ok` check, parsing, and error path without repetition.

## ✅ Cheat lines

- **fetch returns a promise for a `Response`; it rejects only on network failure — a 404/500 resolves.**
- **Always check `response.ok`, then `await response.json()` (body read is async + one-time).**
- **Wrap in try/catch so network and HTTP errors are handled together.**
- **Cancel/timeout with `AbortController`; cross-origin needs server CORS.**
- **axios throws on non-2xx and auto-parses; fetch doesn't — that's the key difference.**
