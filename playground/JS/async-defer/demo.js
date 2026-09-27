// async & defer (script loading strategies)
// Run: node playground/run.js JS async-defer
//
// A plain <script> in the <head> BLOCKS HTML parsing: the parser stops, fetches
// the script, runs it, then resumes. async and defer change that:
//   <script>          -> fetch + execute block parsing (bad in <head>)
//   <script async>    -> fetch in parallel; execute ASAP, PAUSING parse when ready;
//                        order NOT guaranteed (whichever downloads first runs first)
//   <script defer>    -> fetch in parallel; execute AFTER parsing finishes, IN ORDER
//
// There's no HTML parser in Node, so this prints the three timelines so you can
// SEE the difference. The behavior described is the real browser behavior.

function timeline(strategy) {
  console.log(`\n=== <script ${strategy || "(none)"}> ===`);
  const events = [];

  if (!strategy) {
    // Plain script: parser hits it, stops, fetches, executes, resumes.
    events.push("parse HTML...");
    events.push("hit <script> -> PAUSE parsing");
    events.push("fetch script (parser idle, waiting)");
    events.push("execute script");
    events.push("RESUME parsing");
    events.push("finish parsing (DOM ready)");
  } else if (strategy === "async") {
    // Fetch happens alongside parsing; execution interrupts parse when it arrives.
    events.push("parse HTML... (fetch started in parallel)");
    events.push("script arrived -> PAUSE parse, execute immediately");
    events.push("RESUME parsing");
    events.push("finish parsing (DOM ready)");
    events.push("note: with multiple async scripts, order = whoever downloads first");
  } else if (strategy === "defer") {
    // Fetch in parallel, but execution waits for parsing to complete, in order.
    events.push("parse HTML... (fetch started in parallel)");
    events.push("finish parsing (DOM ready)");
    events.push("execute deferred scripts IN ORDER");
    events.push("then DOMContentLoaded fires");
  }

  events.forEach((e, i) => console.log(`  ${i + 1}. ${e}`));
}

timeline(""); // plain <script>
timeline("async");
timeline("defer");

console.log("\nRule of thumb:");
console.log("  - defer: scripts that need the DOM or depend on each other (order matters).");
console.log("  - async: independent, standalone scripts (analytics, ads) — order doesn't matter.");
console.log("  - ES modules (<script type=module>) are DEFERRED by default.");
