// debounce.ts — a fully-typed debounce. The plain building block the hook wraps.
//
// "Debounce" = wait until the calls STOP for `wait` ms, then run once (trailing
// edge). Every new call resets the timer. The persisted `timerId` is a closure
// variable — that single remembered value is the whole mechanism.

// The returned thing is callable AND carries a `.cancel()` method (like lodash).
// We describe that with an intersection: a call signature + a method.
export type Debounced<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void; // same argument types as the original T
  cancel: () => void; // drop a pending run (e.g. on unmount)
};

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): Debounced<T> {
  // `timerId` lives in this closure and PERSISTS between calls — the core trick.
  // `ReturnType<typeof setTimeout>` is `number` in the browser (DOM), so the
  // type is correct without hard-coding it.
  let timerId: ReturnType<typeof setTimeout> | undefined;

  // A `function` (not an arrow) so the wrapper gets its own dynamic `this` —
  // whatever `this` the caller invoked it with (a DOM handler → the element,
  // a method → the object). We forward that same `this` to `fn`.
  function debounced(this: unknown, ...args: Parameters<T>): void {
    clearTimeout(timerId); // cancel the previous not-yet-fired run
    const context = this; // snapshot `this` now; the arrow below fires later

    timerId = setTimeout(() => {
      // fn.apply(context, args) invokes fn NOW with:
      //   - `this` set to `context`  (the receiver we captured)
      //   - arguments taken from the ARRAY `args`
      // `apply` is what keeps `this` and the event/args intact across the delay.
      fn.apply(context, args);
    }, wait);
  }

  debounced.cancel = () => {
    clearTimeout(timerId);
    timerId = undefined;
  };

  return debounced;
}
