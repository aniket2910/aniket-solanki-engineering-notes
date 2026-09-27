import { useState } from "react";
import DebouncedSearch from "./DebouncedSearch";
import "./debounce-input.css";

/**
 * Demo wrapper shown in the playground. It owns the demo-only state (the log of
 * searches that ACTUALLY fired) and passes the work down as `onSearch`, so
 * <DebouncedSearch> stays reusable: it only knows "call this when the user pauses."
 *
 * The point of the demo: watch the keystroke count climb while the "searches
 * fired" list grows only once per pause — that gap is debounce.
 */
export default function DebounceInputDemo() {
  const [runs, setRuns] = useState<string[]>([]);

  const search = (term: string) => {
    setRuns((prev) => [`searched: "${term}"`, ...prev]); // newest on top
  };

  return (
    <div className="dbi-demo">
      <h3>Debounced search</h3>
      <DebouncedSearch onSearch={search} wait={400} />

      <h4>Actual searches fired ({runs.length})</h4>
      {runs.length === 0 ? (
        <p className="dbi-demo__hint">Nothing yet — start typing.</p>
      ) : (
        <ul className="dbi-demo__log">
          {runs.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      )}
      <p className="dbi-demo__hint">
        Many keystrokes, few searches — the difference is the debounce delay.
      </p>
    </div>
  );
}
