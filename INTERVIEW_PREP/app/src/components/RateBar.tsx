import { rate, useProgress, type Rating } from "../lib/progress.ts";

const OPTIONS: { r: Rating; label: string; note: string }[] = [
  { r: "again", label: "Forgot", note: "tomorrow" },
  { r: "shaky", label: "Shaky", note: "soon" },
  { r: "good", label: "Got it", note: "in a few days" },
  { r: "easy", label: "Easy", note: "much later" },
];

/** "How well did you know it?" — schedules the next revision of this page. */
export function RateBar({ id }: { id: string }) {
  const p = useProgress().items[id];
  return (
    <section className="rate">
      <div>
        <h3>How well did you know it?</h3>
        <p className="muted">
          {p?.dueDay
            ? `Revised ${p.reviews}× · next revision ${p.dueDay}`
            : "Your answer schedules when this page comes back for revision."}
        </p>
      </div>
      <div className="rate-buttons">
        {OPTIONS.map((o) => (
          <button key={o.r} className={`rate-btn rate-${o.r} ${p?.last === o.r && p.lastDay ? "is-last" : ""}`} onClick={() => rate(id, o.r)}>
            <strong>{o.label}</strong>
            <small>{o.note}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
