/** A row of toggle buttons that behaves as one radio group. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: T[];
}) {
  return (
    <div className="seg" role="radiogroup">
      {options.map((o) => (
        <button key={o} role="radio" aria-checked={o === value} className={o === value ? "seg__on" : ""} onClick={() => onChange(o)}>
          {o === "all" ? "All" : o[0].toUpperCase() + o.slice(1)}
        </button>
      ))}
    </div>
  );
}
