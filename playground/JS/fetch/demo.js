// FETCH
// Run: node playground/run.js JS fetch
//
// fetch() makes an HTTP request and returns a PROMISE that resolves to a
// Response object. Two things trip people up:
//   1. The promise only REJECTS on a network failure — a 404 or 500 still
//      RESOLVES. You must check response.ok yourself.
//   2. Reading the body (response.json()) is ALSO async and returns a promise.
//
// To keep this runnable offline and deterministic, we use a tiny fake fetch
// that behaves like the real one. The consuming code is exactly what you'd
// write against the real fetch.

// A stand-in Response, matching the real API's shape.
function makeResponse({ status, body }) {
  return {
    status,
    ok: status >= 200 && status < 300, // the real `ok` rule
    json: () => Promise.resolve(body), // reading the body is async
  };
}

// A fake fetch: resolves with a Response, or rejects on a "network" error.
function fakeFetch(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (url.includes("network-error")) return reject(new Error("network down"));
      if (url.includes("missing")) return resolve(makeResponse({ status: 404, body: null }));
      resolve(makeResponse({ status: 200, body: { id: 1, name: "Aniket" } }));
    }, 20);
  });
}

// --- The correct pattern: check ok, then parse, then handle errors -------
async function getUser(url) {
  try {
    const response = await fakeFetch(url); // rejects only on network failure

    // A 404/500 resolves, so we must check ok ourselves and throw.
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }

    const data = await response.json(); // parsing the body is also async
    console.log("success:", data);
    return data;
  } catch (err) {
    // catches BOTH network errors and the HTTP error we threw above
    console.error("failed:", err.message);
  }
}

// 200 -> success
getUser("https://api.example.com/user")
  // 404 -> resolves, but response.ok is false, so we throw
  .then(() => getUser("https://api.example.com/missing"))
  // network failure -> the promise rejects
  .then(() => getUser("https://api.example.com/network-error"));

// --- The classic bug: NOT checking response.ok ---------------------------
// Without the ok check, a 404 slips through as "success" and you try to use
// an error body as if it were real data.
async function buggyGet(url) {
  const response = await fakeFetch(url);
  const data = await response.json(); // on a 404 this is null — no error raised
  console.log("buggy (no ok check) got:", data); // null, silently wrong
}
setTimeout(() => buggyGet("https://api.example.com/missing"), 120);
