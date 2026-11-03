// A year of revision activity, one square per day, like a contribution graph.

import { addDays, dayTotal, today, type DayLog } from "../lib/progress.ts";

const WEEKS = 53;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function level(n: number): number {
  if (n === 0) return 0;
  if (n < 3) return 1;
  if (n < 6) return 2;
  if (n < 10) return 3;
  return 4;
}

function describe(day: string, log: DayLog | undefined): string {
  const n = dayTotal(log);
  if (!n) return `${day}: no activity`;
  const parts = [
    log?.review && `${log.review} revised`,
    log?.solve && `${log.solve} solved`,
    log?.run && `${log.run} runs`,
    log?.read && `${log.read} read`,
  ].filter(Boolean);
  return `${day}: ${parts.join(", ")}`;
}

export function Heatmap({ days }: { days: Record<string, DayLog> }) {
  const end = today();
  const endDow = new Date().getDay(); // 0 = Sunday, the bottom-left row is Sunday
  const start = addDays(end, -(WEEKS - 1) * 7 - endDow);
  const cols: string[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    const col: string[] = [];
    for (let d = 0; d < 7; d++) col.push(addDays(start, w * 7 + d));
    cols.push(col);
  }
  const monthLabels = cols.map((col, i) => {
    const m = Number(col[0].slice(5, 7)) - 1;
    const prev = i > 0 ? Number(cols[i - 1][0].slice(5, 7)) - 1 : -1;
    return m !== prev ? MONTHS[m] : "";
  });
  const total = Object.entries(days).filter(([d]) => d >= start).reduce((a, [, l]) => a + dayTotal(l), 0);

  return (
    <div className="heatmap">
      <div className="heatmap-scroll">
        <div className="heatmap-months">
          {monthLabels.map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
        <div className="heatmap-grid" role="img" aria-label={`${total} activities in the last year`}>
          {cols.map((col, i) => (
            <div key={i} className="heatmap-col">
              {col.map((d) =>
                d > end ? (
                  <span key={d} className="cell cell-future" />
                ) : (
                  <span key={d} className={`cell l${level(dayTotal(days[d]))}`} title={describe(d, days[d])} />
                ),
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="heatmap-foot">
        <span>{total} activities in the last year</span>
        <span className="heatmap-legend">
          Less {[0, 1, 2, 3, 4].map((l) => <span key={l} className={`cell l${l}`} />)} More
        </span>
      </div>
    </div>
  );
}
