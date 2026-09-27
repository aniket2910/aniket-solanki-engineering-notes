# CORS & Preflight

Run the code: `node playground/run.js JS cors-preflight` — see [`demo.js`](demo.js) (a simulation of the browser's decision logic; real CORS is enforced by the browser via HTTP headers, and the rules modeled are the actual ones).

Related: [Fetch](../fetch/notes.md) — a blocked cross-origin fetch is the usual way you hit CORS.

## ⚡ In one line

CORS is a **browser** security mechanism: when a page on one origin makes a cross-origin request, the browser only lets the page **read** the response if the server opts in with `Access-Control-Allow-*` headers — and for "non-simple" requests the browser first sends a **preflight `OPTIONS`** to ask permission.

## 🔍 What the interviewer is really testing

- **Do you know CORS is enforced by the *browser*, not the server** — and that server-to-server calls aren't subject to it?
- **Do you understand the same-origin policy** — what makes two URLs different origins?
- **Do you know simple vs preflighted requests** — what triggers a preflight `OPTIONS`?
- **Do you know it's the server's response headers that grant access**, and what the key headers are?

## Why it exists (the problem)

Browsers automatically attach a user's cookies/credentials to requests. Without restrictions, any malicious site your logged-in browser visits could silently call `yourbank.com/transfer` and read the response using your session. The **same-origin policy** blocks cross-origin reads by default to prevent that. But legitimate apps *do* need to call other origins (your frontend calling your API on a different domain), so **CORS** is the controlled opt-in: the server explicitly says "these origins may read my responses."

## What it is

**Origin** = scheme + host + port (`https://app.example.com:443`). If **any** of the three differ, it's cross-origin.

**The flow:** a cross-origin request from browser JS is allowed to *send*, but the browser withholds the *response* from your JS unless the server's response includes `Access-Control-Allow-Origin` matching your origin (or `*`).

**Simple vs preflighted:**
- **Simple request** (no preflight) — method is `GET`/`POST`/`HEAD`, only safelisted headers, and `Content-Type` is one of `application/x-www-form-urlencoded`, `multipart/form-data`, or `text/plain`. The browser sends it directly, then checks the response's `Access-Control-Allow-Origin`.
- **Preflighted request** — anything else (a `PUT`/`DELETE`/`PATCH`, a custom header like `Authorization`, or `Content-Type: application/json`). The browser first sends an **`OPTIONS`** request with `Access-Control-Request-Method`/`Access-Control-Request-Headers`, asking permission. Only if the server approves does the browser send the real request.

**Key response headers the server sends:**
- `Access-Control-Allow-Origin` — which origin(s) may read the response.
- `Access-Control-Allow-Methods` / `Access-Control-Allow-Headers` — allowed in preflight.
- `Access-Control-Allow-Credentials: true` — allow cookies/auth (and then `Allow-Origin` can't be `*`).
- `Access-Control-Max-Age` — how long to cache the preflight result.

**Mental model:** CORS is a **bouncer at the browser's door reading the venue's guest list**. The request can walk up, but the bouncer only lets your JS *take the response inside* if the server's headers name your origin on the list. A preflight is the bouncer radioing ahead ("a PUT with an Authorization header is coming — okay?") before letting the real one through.

## 🎈 Real-life analogy (how to think about it)

**Calling a company on someone else's behalf.** The same-origin policy is a rule that a receptionist (the browser) won't read a company's reply back to you unless the company has your name on an approved-callers list (`Access-Control-Allow-Origin`). For a routine question (a simple GET) they just check the list. For something sensitive — changing an account (a `PUT` with credentials) — the receptionist first makes a quick "is this caller allowed to do this?" call (the preflight `OPTIONS`) before putting the real request through.

## 🔧 How it works (under the hood)

```text
Simple GET (cross-origin):
  browser --GET--> server
  server responds with Access-Control-Allow-Origin: https://app.example.com
  browser: origin matches? yes -> hand response to JS. no -> BLOCK (JS sees an error)

Preflighted PUT with Authorization:
  browser --OPTIONS (preflight)--> server
     headers: Access-Control-Request-Method: PUT
              Access-Control-Request-Headers: authorization
  server responds: Access-Control-Allow-Methods: PUT
                   Access-Control-Allow-Headers: authorization
                   Access-Control-Allow-Origin: https://app.example.com
  browser: approved? yes -> send the real PUT. no -> BLOCK (never sends the PUT)
```

**Critical nuances interviewers love:**
- **The request often *reaches* the server even when blocked** — for simple requests, the server may process the GET/POST; the browser just refuses to give the *response* to your JS. So "CORS blocked" doesn't always mean "the server never ran it." (Preflighted requests are held back until the `OPTIONS` passes.)
- **CORS is not server-side security.** It doesn't protect your API from `curl`/Postman/another server — those ignore CORS entirely. It only governs what *browser JS on other origins* can read. Real API protection is auth, not CORS.
- **`Access-Control-Allow-Origin: *` can't be combined with credentials** — if you send cookies (`credentials: "include"`), the server must echo a specific origin, not `*`.
- **The error is opaque to JS** — you get a generic network/`TypeError`, not the response; the details are only in the console. That's intentional (don't leak the response).

## 💻 In code

The browser side (a fetch that may be blocked):

```js
// If api.other.com doesn't return Access-Control-Allow-Origin for app.example.com,
// the browser blocks this and the fetch rejects — you can't read the response.
await fetch("https://api.other.com/data", {
  method: "POST",
  headers: { "Content-Type": "application/json" }, // -> triggers a preflight
  body: JSON.stringify({ x: 1 }),
});
```

The server side (what actually fixes it — Express):

```js
// The SERVER opts in by sending CORS headers. This is the real fix, not a
// frontend change.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://app.example.com");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204); // answer the preflight
  next();
});
```

## 🏗️ Code quality & principles applied

This is a security/protocol topic, so "quality" is knowing *where the fix belongs* and staying safe:

- **Fix CORS on the server, not by hacking the client.** Say: *"CORS is enforced by the browser but granted by the server — the fix is server response headers, not a frontend workaround."*
- **Don't disable security to make an error go away.** `Access-Control-Allow-Origin: *` on a credentialed API is a real vulnerability; allow only the specific origins you trust (principle of least privilege).
- **Understand a proxy is a legitimate workaround** — routing through your own same-origin backend avoids CORS because the browser sees a same-origin call; the server-to-server hop isn't CORS-governed.
- **Never rely on CORS for authorization** — it's not an access-control layer for non-browser clients.

**Say in the room:** *"The browser blocked it because the API didn't send `Access-Control-Allow-Origin` for my origin. Since it's a JSON POST it also needs the preflight `OPTIONS` handled. I'd add the specific origin to the server's CORS config — not `*` with credentials — or proxy through my own backend."*

**What you deliberately did NOT do:** you didn't "solve" CORS by turning off browser security or slapping `*` on a credentialed endpoint — that trades a dev annoyance for a vulnerability.

## 🗣️ Keywords to say

- **Same-origin policy** — the default browser restriction CORS relaxes.
- **Origin** — scheme + host + port; any difference is cross-origin.
- **Simple vs preflighted** — direct send vs a prior `OPTIONS` permission check.
- **Preflight `OPTIONS`** — with `Access-Control-Request-Method`/`-Headers`.
- **`Access-Control-Allow-Origin` / `-Methods` / `-Headers` / `-Credentials`** — the server's opt-in headers.
- **Browser-enforced** — server-to-server / curl ignore CORS.
- **Not authorization** — CORS isn't API security.
- **Proxy** — a same-origin backend hop as a workaround.

## 🎯 How it's asked in interviews

**The question, disguised:**
- "What is CORS? Why does the browser block my API call?"
- "What's a preflight request and when does the browser send one?"
- "How do you fix a CORS error?" (server headers, not client).
- "Does CORS protect my API?" (no — browser-only; use auth).
- "What counts as a different origin?"
- "Why does my POST send an extra `OPTIONS` request?"

**Follow-up ladder:** same-origin policy + why → what's an origin → simple vs preflight → what triggers preflight → the server headers that grant access → credentials + `*` rule → "does the request reach the server?" → CORS isn't security → proxy workaround.

**Traps & gotchas:**
- Thinking CORS is a *server-side* protection — it's browser-enforced and doesn't stop non-browser clients.
- Thinking the frontend can fix CORS — the fix is the server's response headers.
- Using `Allow-Origin: *` with credentials — not allowed / insecure.
- Assuming a blocked simple request never hit the server — it often did; the browser just hid the response.
- Forgetting to handle the `OPTIONS` preflight on the server (real request then fails).
- Confusing CORS with CSRF — related threat model, different mechanisms.

**Model answer sketch** ("what is CORS + fix a preflight error"): *"CORS is a browser mechanism enforcing the same-origin policy. When my page calls a different origin, the browser only lets my JS read the response if the server returns `Access-Control-Allow-Origin` for my origin. For non-simple requests — a `PUT`, or a JSON `Content-Type`, or a custom header like `Authorization` — the browser first sends a preflight `OPTIONS` asking which methods/headers are allowed, and only sends the real request if the server approves. So the fix is on the server: return the right `Access-Control-Allow-*` headers and answer the `OPTIONS`. I'd allow my specific origin, not `*` with credentials. And CORS isn't API security — it only restricts browser JS; curl or another server ignores it."*

## 🔗 Linked concepts

- **[Fetch](../fetch/notes.md)** — cross-origin fetches are where CORS shows up; a CORS block rejects the fetch.
- **Async & defer / Event loop** — unrelated mechanism-wise, but all part of the browser runtime picture.

## 🧠 Rapid-fire Q&A

**Q: Who enforces CORS?**
The browser. Non-browser clients (curl, Postman, another server) ignore it.

**Q: What makes two URLs different origins?**
Any difference in scheme, host, or port.

**Q: What triggers a preflight?**
A non-simple request: methods beyond GET/POST/HEAD, custom headers (e.g. `Authorization`), or a `Content-Type` like `application/json`.

**Q: What does the preflight ask and answer?**
The browser sends `OPTIONS` with `Access-Control-Request-Method`/`-Headers`; the server replies with `Access-Control-Allow-Methods`/`-Headers`/`-Origin`.

**Q: How do you fix a CORS error?**
On the server — return `Access-Control-Allow-Origin` (a specific origin) and handle `OPTIONS`. Not a frontend change.

**Q: Does CORS protect my API?**
No — it only restricts browser JS from other origins. Protect the API with authentication/authorization.

**Q: Can you use `Allow-Origin: *` with cookies?**
No — with credentials the server must echo a specific origin.

**Q (design): Why is `Allow-Origin: *` on a credentialed endpoint dangerous, and what's the safe approach?**
It would let any site read authenticated responses; allow only specific trusted origins (least privilege).

## ✅ Cheat lines

- **CORS is browser-enforced; the server grants access via `Access-Control-Allow-*` headers.**
- **Origin = scheme + host + port; any difference is cross-origin.**
- **Non-simple request (PUT/DELETE, custom headers, JSON body) → preflight `OPTIONS` first.**
- **Fix it on the server, not the client; never `*` with credentials.**
- **CORS is not API security — curl/another server ignore it; use auth.**
