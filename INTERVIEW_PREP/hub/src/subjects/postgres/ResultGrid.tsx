import { formatValue, type ResultSet } from "./runner.ts";

export function ResultGrid({ result, caption }: { result: ResultSet; caption?: string }) {
  return (
    <div className="grid-wrap">
      <table className="grid">
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {result.columns.map((c, i) => (
              <th key={i}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.rows.map((row, r) => (
            <tr key={r}>
              {row.map((v, c) => (
                <td key={c} className={v === null ? "null" : typeof v === "number" ? "num" : undefined}>
                  {formatValue(v)}
                </td>
              ))}
            </tr>
          ))}
          {!result.rows.length && (
            <tr>
              <td className="empty" colSpan={result.columns.length || 1}>
                (0 rows)
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
