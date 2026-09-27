// CORS & PREFLIGHT
// Run: node playground/run.js JS cors-preflight
//
// CORS (Cross-Origin Resource Sharing) is a BROWSER security mechanism. When
// JS on origin A calls an API on origin B, the browser checks whether B has
// opted in via response headers. If not, the browser BLOCKS the JS from reading
// the response. (Server-to-server calls have no CORS — it's browser-enforced.)
//
// This simulates the browser's decision logic. Real CORS is enforced by the
// browser using real HTTP headers; the rules below are the actual rules.

// An origin is scheme + host + port. Different in ANY of those = cross-origin.
function isSameOrigin(a, b) {
  return a === b;
}

// A request is "simple" (no preflight) only if it uses a safe method AND only
// safelisted headers AND a safelisted Content-Type. Otherwise the browser sends
// a preflight OPTIONS request first to ask permission.
function needsPreflight(request) {
  const simpleMethods = ["GET", "POST", "HEAD"];
  const safeContentTypes = [
    "application/x-www-form-urlencoded",
    "multipart/form-data",
    "text/plain",
  ];
  if (!simpleMethods.includes(request.method)) return true; // e.g. PUT, DELETE, PATCH
  const headerNames = Object.keys(request.headers || {}).map((h) => h.toLowerCase());
  const hasCustomHeader = headerNames.some(
    (h) => !["accept", "content-type"].includes(h)
  ); // e.g. Authorization, X-Token
  if (hasCustomHeader) return true;
  const contentType = request.headers?.["Content-Type"];
  if (contentType && !safeContentTypes.includes(contentType)) return true; // e.g. application/json
  return false;
}

// The server decides which origins/methods/headers it allows.
const serverPolicy = {
  allowedOrigins: ["https://app.example.com"],
  allowedMethods: ["GET", "POST", "PUT"],
  allowedHeaders: ["content-type", "authorization"],
};

// Simulate the browser making a cross-origin request.
function browserRequest(pageOrigin, apiOrigin, request) {
  console.log(`\n${request.method} ${apiOrigin} from ${pageOrigin}`);

  if (isSameOrigin(pageOrigin, apiOrigin)) {
    console.log("  same-origin -> no CORS check, allowed");
    return;
  }

  if (needsPreflight(request)) {
    // Step 1: browser sends OPTIONS with Access-Control-Request-Method/Headers.
    const originAllowed = serverPolicy.allowedOrigins.includes(pageOrigin);
    const methodAllowed = serverPolicy.allowedMethods.includes(request.method);
    console.log("  preflight OPTIONS sent (asking permission)...");
    if (!originAllowed || !methodAllowed) {
      console.log("  BLOCKED: server did not allow this origin/method in preflight");
      return;
    }
    console.log("  preflight OK -> browser now sends the real request");
  }

  // Step 2 (or only step for simple requests): the actual request.
  // The browser checks Access-Control-Allow-Origin on the response.
  if (serverPolicy.allowedOrigins.includes(pageOrigin)) {
    console.log("  Access-Control-Allow-Origin matches -> JS can read the response");
  } else {
    console.log("  BLOCKED: response has no matching Access-Control-Allow-Origin");
  }
}

const PAGE = "https://app.example.com";
const API = "https://api.other.com";

// Simple GET -> no preflight, but still needs Allow-Origin.
browserRequest(PAGE, API, { method: "GET", headers: {} });

// POST application/json -> preflight (json is not a safe content-type).
browserRequest(PAGE, API, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
});

// PUT with Authorization -> preflight (non-simple method + custom header).
browserRequest(PAGE, API, {
  method: "PUT",
  headers: { Authorization: "Bearer x", "Content-Type": "application/json" },
});

// Request from a disallowed origin -> blocked.
browserRequest("https://evil.com", API, { method: "GET", headers: {} });

// Same-origin -> no CORS at all.
browserRequest(PAGE, PAGE, { method: "GET", headers: {} });
