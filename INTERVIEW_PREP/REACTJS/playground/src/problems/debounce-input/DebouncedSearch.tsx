// DebouncedSearch.tsx — pure presentational search box. It renders on every
// keystroke (instant UI) but only calls `onSearch` once the user pauses.
//
// The value is owned HERE (self-contained input) but the expensive work is
// injected by the parent via `onSearch` — so this component doesn't know or
// care whether "search" is a fetch, a filter, or a log. Single responsibility:
// manage the input + when to fire; the parent owns what firing means.

import { useState, type ChangeEvent } from "react";
import { useDebouncedCallback } from "./useDebouncedCallback";

type DebouncedSearchProps = {
  onSearch: (term: string) => void; // the expensive work, injected by the parent
  wait?: number; // quiet period in ms before onSearch runs
  placeholder?: string;
};

export default function DebouncedSearch({
  onSearch,
  wait = 400,
  placeholder = "Type fast — search fires only when you pause",
}: DebouncedSearchProps) {
  const [query, setQuery] = useState<string>("");
  const [keystrokes, setKeystrokes] = useState<number>(0);

  // Debounced version of the injected work. Rebuilt only if `wait` changes.
  const debouncedSearch = useDebouncedCallback(onSearch, wait);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeystrokes((k) => k + 1); // functional update — no stale closure
    setQuery(value); // update the box immediately: UI stays responsive
    debouncedSearch(value); // schedule the search; each keystroke resets it
  };

  return (
    <div className="dbi">
      <input
        className="dbi__input"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search"
      />
      <p className="dbi__meta">
        Keystrokes: <b>{keystrokes}</b> · Live value: <b>{query || "—"}</b>
      </p>
    </div>
  );
}
