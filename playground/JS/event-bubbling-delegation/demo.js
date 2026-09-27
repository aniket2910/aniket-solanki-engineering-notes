// EVENT BUBBLING & DELEGATION
// Run: node playground/run.js JS event-bubbling-delegation
//
// In the DOM, a click on an element travels through THREE phases:
//   1. capture  — top (document) down to the target
//   2. target   — the element itself
//   3. bubble   — target back UP to the top   (this is the default phase)
// Delegation exploits bubbling: put ONE listener on a parent and read
// event.target to know which child was actually clicked.
//
// The DOM isn't available in Node, so this is a tiny simulation of the same
// propagation rules. The concepts map 1:1 to real addEventListener.

// A minimal element: an id, a parent, and listeners per phase.
class DomNode {
  constructor(id, parent = null) {
    this.id = id;
    this.parent = parent;
    this.listeners = { capture: [], bubble: [] };
  }
  // useCapture=true registers on the capture phase; default is bubble.
  on(handler, useCapture = false) {
    this.listeners[useCapture ? "capture" : "bubble"].push(handler);
  }
}

// Build a tree: root > list > item (item is what gets "clicked").
const root = new DomNode("root");
const list = new DomNode("ul", root);
const item = new DomNode("li", list);

// dispatch simulates the browser firing an event at `target`.
function dispatch(target) {
  // Build the path from the target up to the root.
  const path = [];
  for (let node = target; node; node = node.parent) path.push(node);

  const event = { target, stopped: false, stopPropagation() { this.stopped = true; } };

  // Phase 1: capture — from root DOWN to target.
  for (let i = path.length - 1; i >= 0; i--) {
    if (event.stopped) return;
    path[i].listeners.capture.forEach((fn) => fn(event, path[i]));
  }
  // Phase 3: bubble — from target UP to root (the default).
  for (let i = 0; i < path.length; i++) {
    if (event.stopped) return;
    path[i].listeners.bubble.forEach((fn) => fn(event, path[i]));
  }
}

// --- Watch the propagation order -----------------------------------------
root.on((e, current) => console.log("capture at", current.id), true);
list.on((e, current) => console.log("capture at", current.id), true);
item.on((e, current) => console.log("bubble at", current.id));
list.on((e, current) => console.log("bubble at", current.id));
root.on((e, current) => console.log("bubble at", current.id));

console.log("--- click on li ---");
dispatch(item);
// capture at root -> capture at ul -> bubble at li -> bubble at ul -> bubble at root

// --- Delegation: ONE listener on the parent handles all children ---------
console.log("\n--- delegation: single listener on ul ---");
const menu = new DomNode("ul");
const home = new DomNode("li#home", menu);
const about = new DomNode("li#about", menu);

// Instead of a listener per <li>, one listener on <ul> reads event.target.
menu.on((e) => console.log("menu clicked, actual target was:", e.target.id));

dispatch(home); // menu clicked, actual target was: li#home
dispatch(about); // menu clicked, actual target was: li#about
