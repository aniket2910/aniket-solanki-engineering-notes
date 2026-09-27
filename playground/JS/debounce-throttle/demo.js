// DEBOUNCING & THROTTLING
// Run: node playground/run.js JS debounce-throttle
//
// Both limit how often a function runs when an event fires rapidly (typing,
// scrolling, resizing). The difference is WHEN they let it through:
//   debounce -> run only AFTER the events go quiet for `wait` ms
//   throttle -> run at most ONCE per `wait` ms while events keep coming

// --- Debounce -------------------------------------------------------------
// Every call resets a timer. The real function runs only once the calls stop
// for `wait` ms. Great for "search as you type" — wait until they pause.
function debounce(fn, wait) {
  let timerId; // remembered across calls via closure

  return function (...args) {
    clearTimeout(timerId); // cancel the previous pending run
    timerId = setTimeout(() => fn(...args), wait); // schedule a fresh one
  };
}

// --- Throttle -------------------------------------------------------------
// Runs immediately, then ignores calls until `wait` ms have passed. Good for
// scroll/resize where you want steady updates, not one at the end.
function throttle(fn, wait) {
  let isWaiting = false;

  return function (...args) {
    if (isWaiting) return; // inside the cooldown — drop this call
    fn(...args); // run now
    isWaiting = true;
    setTimeout(() => {
      isWaiting = false; // cooldown over, allow the next call
    }, wait);
  };
}

// --- Simulate rapid events to see the difference -------------------------
const log = (label) => (value) => console.log(label, value);

const debounced = debounce(log("[debounce] fired with:"), 100);
const throttled = throttle(log("[throttle] fired with:"), 100);

// Fire 5 quick "keystrokes" 30ms apart.
[1, 2, 3, 4, 5].forEach((n, i) => {
  setTimeout(() => {
    debounced(n);
    throttled(n);
  }, i * 30);
});

// Expected:
//   throttle fires on 1 (immediately), then again once the 100ms cooldown
//     passes and a later call comes in.
//   debounce fires only ONCE, ~100ms after the last keystroke (value 5).
