import type { CSSProperties } from "react";
import "./progress-bar.css";

interface ProgressBarProps {
  value: number; // the intent, 0..100
  label?: string; // accessible name for screen readers
}

// Clamp keeps the bar honest even if a parent hands us 120 or -5.
const clamp = (n: number): number => Math.min(100, Math.max(0, n));

/**
 * A determinate, accessible progress bar.
 *
 * The one non-obvious decision here is HOW the fill animates. We do NOT animate
 * `width` — that forces the browser to re-run layout on every frame. Instead the
 * fill is a full-width block that we SHRINK with `transform: scaleX(...)`. Transform
 * runs on the compositor: no layout, no repaint of the bar each frame, so it stays
 * smooth even under load. The scale factor is passed as a CSS custom property so the
 * transform declaration itself lives in CSS, not inline (separation of concerns).
 */
export default function ProgressBar({ value, label = "Progress" }: ProgressBarProps) {
  const pct = clamp(value);

  // Only the raw data (the scale factor) crosses into the DOM as a variable;
  // the actual `transform`/`transition` rules stay in the stylesheet.
  const fillStyle = { "--progress-scale": pct / 100 } as CSSProperties;

  return (
    <div className="pb__row">
      <div
        className="pb__track"
        // ARIA turns a pair of divs into a real progress bar for assistive tech.
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="pb__fill" style={fillStyle} />
      </div>
      {/* The % label is a SIBLING of the fill, never a child: scaleX would
          horizontally squash any text living inside the scaled element. */}
      <span className="pb__value">{Math.round(pct)}%</span>
    </div>
  );
}
