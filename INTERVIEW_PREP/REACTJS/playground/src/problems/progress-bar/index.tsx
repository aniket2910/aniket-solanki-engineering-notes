import { useState } from "react";
import ProgressBar from "./ProgressBar";
import SequentialBars from "./SequentialBars";
import "./progress-bar.css";

/**
 * Demo wrapper shown in the playground. It owns the demo-only state (the slider
 * value) so <ProgressBar> stays a pure presentational component: value in, bar out.
 */
export default function ProgressBarDemo() {
  const [value, setValue] = useState<number>(35);

  return (
    <div className="pb-demo">
      <section className="pb-demo__section">
        <h3>Controlled progress bar</h3>
        <ProgressBar value={value} label="Upload progress" />
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-label="Set progress"
          className="pb-demo__slider"
        />
      </section>

      <section className="pb-demo__section">
        <h3>Sequential fill (a queue of bars)</h3>
        <SequentialBars />
      </section>
    </div>
  );
}
