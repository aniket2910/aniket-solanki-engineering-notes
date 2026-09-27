// useDebouncedCallback.ts — the React-specific lesson.
//
// A component re-runs its whole body on every render, and typing triggers a
// render. So calling `debounce(fn, wait)` INSIDE the component would build a
// brand-new debounced fn (fresh empty timer) each render — it could never
// accumulate keystrokes, so it would never debounce. The fix: create it ONCE
// and keep the same instance, and keep the target function fresh via a ref.

import { useEffect, useMemo, useRef } from "react";
import { debounce, type Debounced } from "./debounce";

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): Debounced<T> {
  // Hold the LATEST fn in a stable box. Changing a ref does not re-render, and
  // it survives renders — so the debounced wrapper (built once) always calls the
  // freshest closure. This is what avoids the classic "stale closure" bug where
  // the debounced call keeps invoking the very first render's version of `fn`.
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn; // after every render, point the box at the newest fn
  });

  // useMemo runs its factory once (per `wait`) and returns the SAME debounced
  // instance across renders. That single instance owns the single persisted
  // timer — exactly what debounce needs to work.
  const debounced = useMemo(
    () => debounce((...args: Parameters<T>) => fnRef.current(...args), wait),
    [wait]
  );

  // Cleanup: if the component unmounts with a call pending, cancel it so the
  // timer can't fire and setState on an unmounted component.
  useEffect(() => debounced.cancel, [debounced]);

  return debounced;
}
