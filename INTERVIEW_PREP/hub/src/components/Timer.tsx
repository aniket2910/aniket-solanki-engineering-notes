import { useEffect, useState } from "react";

/** A stopwatch for timed drills (day 13 of the plan: 10 minutes a problem). */
export function Timer({ targetMinutes = 10 }: { targetMinutes?: number }) {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const over = seconds >= targetMinutes * 60;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className={`timer ${over ? "timer--over" : ""}`} title={`Target: ${targetMinutes} min`}>
      <span className="mono">
        {mm}:{ss}
      </span>
      <button className="btn btn--ghost btn--sm" onClick={() => setRunning(!running)}>
        {running ? "Pause" : seconds ? "Resume" : "Start timer"}
      </button>
      {seconds > 0 && !running && (
        <button className="btn btn--ghost btn--sm" onClick={() => setSeconds(0)}>
          Reset
        </button>
      )}
    </div>
  );
}
