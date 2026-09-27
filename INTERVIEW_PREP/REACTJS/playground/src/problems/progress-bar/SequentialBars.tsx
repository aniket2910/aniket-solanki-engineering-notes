import { useEffect, useRef, useState } from "react";
import ProgressBar from "./ProgressBar";

/**
 * The classic "N progress bars that fill one after another" variant.
 * Bar 0 fills to 100%, then bar 1 starts, and so on. This tests three things:
 * an array of state, a timer driving the animation, and — the part interviewers
 * actually watch for — clearing that timer so it never leaks.
 *
 * We reuse <ProgressBar> here rather than re-implementing a bar: composition over
 * duplication. This component owns *sequencing*; the bar owns *rendering one bar*.
 */
const BAR_COUNT = 4;
const TICK_MS = 30; // how often we advance
const STEP = 2; // % added per tick -> ~1.5s to fill one bar

export default function SequentialBars() {
  const [fills, setFills] = useState<number[]>(() => new Array(BAR_COUNT).fill(0));
  const [running, setRunning] = useState(false);
  // Which bar is currently filling. A ref, not state, because changing it must NOT
  // re-render — it's bookkeeping the interval reads, not something the UI shows.
  const activeIndex = useRef(0);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setFills((prev) => {
        const i = activeIndex.current;
        if (i >= prev.length) return prev; // all done, nothing to advance
        const next = [...prev]; // new array — never mutate state in place
        next[i] = Math.min(100, next[i] + STEP);
        if (next[i] >= 100) activeIndex.current += 1; // hand off to the next bar
        return next;
      });
    }, TICK_MS);
    // The whole point of the question: tear the interval down. Without this we'd
    // stack a new timer on every re-run and keep ticking after unmount.
    return () => window.clearInterval(id);
  }, [running]);

  // Derive "finished" instead of storing a second copy of that fact, and stop.
  const allDone = fills.every((f) => f >= 100);
  useEffect(() => {
    if (allDone) setRunning(false);
  }, [allDone]);

  const reset = () => {
    setRunning(false);
    activeIndex.current = 0;
    setFills(new Array(BAR_COUNT).fill(0));
  };

  return (
    <div className="pb-seq">
      {fills.map((f, i) => (
        <ProgressBar key={i} value={f} label={`Task ${i + 1}`} />
      ))}
      <div className="pb-seq__controls">
        <button onClick={() => setRunning(true)} disabled={running || allDone}>
          Start
        </button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
