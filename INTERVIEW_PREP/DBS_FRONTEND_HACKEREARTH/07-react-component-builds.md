# 07 — React "Build a Component" Machine-Coding Solutions

The **most likely** DBS HackerEarth format for the WD88450 role: you're given a scaffold + a Jest/RTL spec and must build a component until the tests pass. Graded on tests **and** SonarQube code quality (see the code-care checklist in the command-center DBS hub).

Each build below: what it proves → full solution → a11y/`data-testid` notes → expected behavior. Read the code, then re-type it from memory — muscle memory is what saves you under the timer.

 **Golden rule:** RTL queries by **role and accessible name**, so semantic HTML + correct `aria-*` is not optional polish — it's what makes the hidden tests pass. Always add `value`+`onChange` (controlled), clean up timers/listeners in `useEffect` return, and never use array index as a key for reorderable lists.

---

## B1. Tabs (roving focus, one panel visible)

**Proves:** hooks, keyboard a11y, ARIA tab pattern, conditional render.

```jsx
import { useState, useRef } from "react";

const TABS = [
  { id: "overview", label: "Overview", content: "Overview content" },
  { id: "specs", label: "Specs", content: "Specs content" },
  { id: "reviews", label: "Reviews", content: "Reviews content" },
];

export default function Tabs() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);

  const onKeyDown = (e) = {
    let next = active;
    if (e.key === "ArrowRight") next = (active + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (active - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div
      <div role="tablist" aria-label="Product details" onKeyDown={onKeyDown}
        {TABS.map((tab, i) = (
          <button
            key={tab.id}
            ref={(el) = (tabRefs.current[i] = el)}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active === i}
            aria-controls={`panel-${tab.id}`}
            tabIndex={active === i ? 0 : -1}  /* roving tabindex */
            onClick={() = setActive(i)}
          
            {tab.label}
          </button
        ))}
      </div

      {TABS.map((tab, i) =
        active === i ? (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            tabIndex={0}
          
            {tab.content}
          </div
        ) : null
      )}
    </div
  );
}
```
**a11y/testid:** `role="tablist"/"tab"/"tabpanel"`, `aria-selected`, `aria-controls`/`aria-labelledby`, **roving tabindex** (only the active tab is tab-focusable; arrows move between tabs). **Expected:** click or arrow-key a tab → only its panel shows, focus follows.

---

## B2. Accordion (one open at a time)

**Proves:** the exact thing you asked about — `aria-expanded`, single-open logic, keyboard toggle.

```jsx
import { useState } from "react";

const ITEMS = [
  { id: "a", title: "What is DBS?", body: "A leading Asian bank." },
  { id: "b", title: "Where is it based?", body: "Singapore." },
  { id: "c", title: "What role?", body: "Frontend SDE2." },
];

export default function Accordion() {
  const [openId, setOpenId] = useState(null); // null = all closed

  const toggle = (id) = setOpenId((cur) = (cur === id ? null : id));

  return (
    <div
      {ITEMS.map((item) = {
        const isOpen = openId === item.id;
        return (
          <div key={item.id}
            <h3
              <button
                aria-expanded={isOpen}
                aria-controls={`section-${item.id}`}
                id={`accordion-${item.id}`}
                onClick={() = toggle(item.id)}
              
                {item.title}
              </button
            </h3
            <div
              id={`section-${item.id}`}
              role="region"
              aria-labelledby={`accordion-${item.id}`}
              hidden={!isOpen}
            
              {item.body}
            </div
          </div
        );
      })}
    </div
  );
}
```
**Key detail:** `hidden={!isOpen}` (not just CSS) so the collapsed content is truly removed from the a11y tree. `aria-expanded` flips per header. To allow **multiple** open, hold a `Set` of ids instead of a single `openId`. **Expected:** opening one closes the previously open one; clicking the open one closes it.

---

## B3. Autocomplete / Typeahead (debounced, keyboard nav, states)

**Proves:** debounce (perf), async states, keyboard a11y, race-condition handling.

```jsx
import { useState, useEffect, useRef } from "react";

// mock API
const fetchSuggestions = (q) =
  new Promise((res) =
    setTimeout(() = {
      const all = ["react", "redux", "react-router", "recoil", "rxjs", "next"];
      res(all.filter((x) = x.includes(q.toLowerCase())));
    }, 300)
  );

export default function Autocomplete() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // idle|loading|done|error
  const [highlight, setHighlight] = useState(-1);
  const reqId = useRef(0); // guards against stale responses

  useEffect(() = {
    if (!query.trim()) {
      setResults([]);
      setStatus("idle");
      return;
    }
    setStatus("loading");
    const id = ++reqId.current;
    const timer = setTimeout(async () = {
      try {
        const data = await fetchSuggestions(query);
        if (id === reqId.current) {   // ignore out-of-order responses
          setResults(data);
          setStatus("done");
          setHighlight(-1);
        }
      } catch {
        if (id === reqId.current) setStatus("error");
      }
    }, 300); // debounce
    return () = clearTimeout(timer); // cancel on next keystroke
  }, [query]);

  const onKeyDown = (e) = {
    if (e.key === "ArrowDown") setHighlight((h) = Math.min(h + 1, results.length - 1));
    else if (e.key === "ArrowUp") setHighlight((h) = Math.max(h - 1, 0));
    else if (e.key === "Enter" && highlight = 0) setQuery(results[highlight]);
    else if (e.key === "Escape") setResults([]);
  };

  return (
    <div
      <input
        type="text"
        role="combobox"
        aria-expanded={results.length  0}
        aria-autocomplete="list"
        aria-activedescendant={highlight = 0 ? `opt-${highlight}` : undefined}
        value={query}
        placeholder="Search…"
        onChange={(e) = setQuery(e.target.value)}
        onKeyDown={onKeyDown}
      /
      {status === "loading" && <pLoading…</p}
      {status === "error" && <p role="alert"Something went wrong</p}
      {status === "done" && results.length === 0 && <pNo results</p}
      {results.length  0 && (
        <ul role="listbox"
          {results.map((item, i) = (
            <li
              key={item}
              id={`opt-${i}`}
              role="option"
              aria-selected={highlight === i}
              onMouseDown={() = setQuery(item)} /* mousedown fires before blur */
              style={{ background: highlight === i ? "#eee" : "transparent" }}
            
              {item}
            </li
          ))}
        </ul
      )}
    </div
  );
}
```
**Two things graders love here:** the **debounce** (`setTimeout` + cleanup) and the **`reqId` stale-response guard** (a slow earlier request must not overwrite a newer one). Loading/empty/error states all covered.

---

## B4. Sortable + Paginated Data Table

**Proves:** derived state (don't mutate source), sorting, pagination, list perf. (This is your design-system Table story — lean in.)

```jsx
import { useState, useMemo } from "react";

const DATA = [
  { id: 1, name: "Alice", age: 30 },
  { id: 2, name: "Bob", age: 25 },
  { id: 3, name: "Charlie", age: 35 },
  { id: 4, name: "Dave", age: 28 },
  { id: 5, name: "Eve", age: 22 },
];
const PAGE_SIZE = 2;

export default function DataTable() {
  const [sortKey, setSortKey] = useState(null);
  const [dir, setDir] = useState("asc");
  const [page, setPage] = useState(0);

  const sorted = useMemo(() = {
    if (!sortKey) return DATA;
    return [...DATA].sort((a, b) = {   // copy — never mutate source
      if (a[sortKey] < b[sortKey]) return dir === "asc" ? -1 : 1;
      if (a[sortKey]  b[sortKey]) return dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [sortKey, dir]);

  const pageCount = Math.ceil(sorted.length / PAGE_SIZE);
  const rows = sorted.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const onSort = (key) = {
    if (sortKey === key) setDir((d) = (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setDir("asc"); }
    setPage(0);
  };

  return (
    <div
      <table
        <thead
          <tr
            {["name", "age"].map((key) = (
              <th key={key}
                <button onClick={() = onSort(key)} aria-label={`Sort by ${key}`}
                  {key} {sortKey === key ? (dir === "asc" ? "▲" : "▼") : ""}
                </button
              </th
            ))}
          </tr
        </thead
        <tbody
          {rows.map((r) = (
            <tr key={r.id}
              <td{r.name}</td
              <td{r.age}</td
            </tr
          ))}
        </tbody
      </table
      <div
        <button disabled={page === 0} onClick={() = setPage((p) = p - 1)}Prev</button
        <spanPage {page + 1} of {pageCount}</span
        <button disabled={page = pageCount - 1} onClick={() = setPage((p) = p + 1)}Next</button
      </div
    </div
  );
}
```
**Watch for:** sorting a **copy** (`[...DATA]`) so the original is untouched; resetting to page 0 on sort; disabling Prev/Next at bounds; stable `key={r.id}`.

---

## B5. Accessible Modal / Dialog (focus trap + return focus)

**Proves:** a11y depth, event handling, `useEffect` cleanup.

```jsx
import { useEffect, useRef } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  const dialogRef = useRef(null);
  const lastFocused = useRef(null);

  useEffect(() = {
    if (!isOpen) return;
    lastFocused.current = document.activeElement;      // remember trigger
    dialogRef.current?.focus();

    const onKey = (e) = {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") trapFocus(e);
    };
    document.addEventListener("keydown", onKey);
    return () = {
      document.removeEventListener("keydown", onKey);  // cleanup
      lastFocused.current?.focus();                    // restore focus
    };
  }, [isOpen, onClose]);

  const trapFocus = (e) = {
    const focusables = dialogRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)" }}
      onClick={onClose}                                 // click overlay closes
    
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onClick={(e) = e.stopPropagation()}            // don't close on inner click
        style={{ background: "#fff", padding: 20, maxWidth: 400, margin: "10% auto" }}
      
        <h2 id="modal-title"{title}</h2
        {children}
        <button onClick={onClose}Close</button
      </div
    </div
  );
}
```
**The four things graders test:** ESC closes, overlay-click closes (but inner click doesn't — `stopPropagation`), focus moves into the dialog on open and **returns to the trigger** on close, and Tab is **trapped** inside. `role="dialog"` + `aria-modal="true"` + `aria-labelledby`.

---

## B6. Star Rating (controlled, hover preview, keyboard)

```jsx
import { useState } from "react";

export default function StarRating({ max = 5, value = 0, onChange }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div role="radiogroup" aria-label="Rating"
      {Array.from({ length: max }, (_, i) = i + 1).map((star) = (
        <button
          key={star}
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star  1 ? "s" : ""}`}
          onClick={() = onChange(star)}
          onMouseEnter={() = setHover(star)}
          onMouseLeave={() = setHover(0)}
          onKeyDown={(e) = {
            if (e.key === "ArrowRight") onChange(Math.min(value + 1, max));
            if (e.key === "ArrowLeft") onChange(Math.max(value - 1, 1));
          }}
          style={{ color: star <= display ? "gold" : "#ccc", background: "none", border: "none" }}
        
          ★
        </button
      ))}
    </div
  );
}
```
**Note:** controlled via `value`/`onChange`; hover shows a *preview* without committing; arrow keys change rating; `role="radio"`/`aria-checked`.

---

## B7. Todo List (add / toggle / delete / filter + localStorage)

```jsx
import { useState, useEffect } from "react";

export default function TodoList() {
  const [todos, setTodos] = useState(() = {
    try { return JSON.parse(localStorage.getItem("todos")) || []; }
    catch { return []; }
  });
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all"); // all|active|done

  useEffect(() = {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const add = (e) = {
    e.preventDefault();                 // don't reload the page
    if (!text.trim()) return;
    setTodos((t) = [...t, { id: Date.now(), text: text.trim(), done: false }]);
    setText("");
  };
  const toggle = (id) =
    setTodos((t) = t.map((x) = (x.id === id ? { ...x, done: !x.done } : x)));
  const remove = (id) = setTodos((t) = t.filter((x) = x.id !== id));

  const visible = todos.filter((t) =
    filter === "all" ? true : filter === "active" ? !t.done : t.done
  );

  return (
    <div
      <form onSubmit={add}
        <input value={text} onChange={(e) = setText(e.target.value)} placeholder="Add todo" /
        <button type="submit"Add</button
      </form

      <div
        {["all", "active", "done"].map((f) = (
          <button key={f} aria-pressed={filter === f} onClick={() = setFilter(f)}{f}</button
        ))}
      </div

      <ul
        {visible.map((t) = (
          <li key={t.id}
            <label
              <input type="checkbox" checked={t.done} onChange={() = toggle(t.id)} /
              <span style={{ textDecoration: t.done ? "line-through" : "none" }}{t.text}</span
            </label
            <button aria-label={`Delete ${t.text}`} onClick={() = remove(t.id)}✕</button
          </li
        ))}
      </ul
    </div
  );
}
```
**Watch for:** immutable updates (`map`/`filter`, spread), `preventDefault` on submit, trimming empty input, stable `key`, lazy `useState` initializer for the localStorage read.

---

## B8. Image Carousel (auto-advance, pause on hover, timer cleanup)

```jsx
import { useState, useEffect } from "react";

export default function Carousel({ images }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() = {
    if (paused) return;
    const id = setInterval(() = setIndex((i) = (i + 1) % images.length), 3000);
    return () = clearInterval(id);      // cleanup on unmount / re-run
  }, [paused, images.length]);

  const go = (dir) =
    setIndex((i) = (i + dir + images.length) % images.length);

  return (
    <div
      onMouseEnter={() = setPaused(true)}
      onMouseLeave={() = setPaused(false)}
      aria-roledescription="carousel"
    
      <button aria-label="Previous" onClick={() = go(-1)}‹</button
      <img src={images[index]} alt={`Slide ${index + 1}`} /
      <button aria-label="Next" onClick={() = go(1)}›</button
      <div role="tablist"
        {images.map((_, i) = (
          <button
            key={i}
            role="tab"
            aria-selected={i === index}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() = setIndex(i)}
          /
        ))}
      </div
    </div
  );
}
```
**The classic test:** `clearInterval` in the cleanup so no leak/double-advance; modular arithmetic wraps around; pause on hover.

---

## B9. Infinite Scroll / Load More (IntersectionObserver)

```jsx
import { useState, useEffect, useRef, useCallback } from "react";

export default function InfiniteList({ fetchPage }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const sentinel = useRef(null);

  const load = useCallback(async () = {
    setLoading(true);
    const next = await fetchPage(page);
    setItems((prev) = [...prev, ...next]);  // append, don't refetch all
    setLoading(false);
  }, [page, fetchPage]);

  useEffect(() = { load(); }, [load]);

  useEffect(() = {
    const obs = new IntersectionObserver(
      (entries) = { if (entries[0].isIntersecting && !loading) setPage((p) = p + 1); },
      { threshold: 1 }
    );
    if (sentinel.current) obs.observe(sentinel.current);
    return () = obs.disconnect();          // cleanup
  }, [loading]);

  return (
    <div
      <ul{items.map((it) = <li key={it.id}{it.text}</li)}</ul
      {loading && <pLoading…</p}
      <div ref={sentinel} style={{ height: 1 }} /
    </div
  );
}
```
**Key:** append (`[...prev, ...next]`), `IntersectionObserver` on a sentinel div, `obs.disconnect()` cleanup.

---

## B10. Form with Validation (inline errors, submit gating)

```jsx
import { useState } from "react";

export default function SignupForm({ onSubmit }) {
  const [values, setValues] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({});

  const errors = {
    email: !values.email ? "Email is required"
      : !/^[^@]+@[^@]+\.[^@]+$/.test(values.email) ? "Invalid email" : "",
    password: values.password.length < 8 ? "Min 8 characters" : "",
  };
  const isValid = !errors.email && !errors.password;

  const change = (e) =
    setValues((v) = ({ ...v, [e.target.name]: e.target.value }));
  const blur = (e) =
    setTouched((t) = ({ ...t, [e.target.name]: true }));

  const submit = (e) = {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (isValid) onSubmit(values);
  };

  return (
    <form onSubmit={submit} noValidate
      <label htmlFor="email"Email</label
      <input id="email" name="email" value={values.email} onChange={change} onBlur={blur}
             aria-invalid={!!(touched.email && errors.email)} /
      {touched.email && errors.email && <span role="alert"{errors.email}</span}

      <label htmlFor="password"Password</label
      <input id="password" name="password" type="password"
             value={values.password} onChange={change} onBlur={blur}
             aria-invalid={!!(touched.password && errors.password)} /
      {touched.password && errors.password && <span role="alert"{errors.password}</span}

      <button type="submit" disabled={!isValid}Sign up</button
    </form
  );
}
```
**Watch for:** errors **derived** from values (not stored twice), `label htmlFor`/`id` pairing, `role="alert"` on errors, `aria-invalid`, submit disabled until valid, `preventDefault`.

---

## B11. Counter / Stopwatch (interval cleanup — the classic `useEffect` test)

```jsx
import { useState, useEffect, useRef } from "react";

export default function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() = {
    if (running) {
      intervalRef.current = setInterval(() = setSeconds((s) = s + 1), 1000);
    }
    return () = clearInterval(intervalRef.current); // cleanup — no leak, no double
  }, [running]);

  return (
    <div
      <p aria-live="polite"{seconds}s</p
      <button onClick={() = setRunning(true)} disabled={running}Start</button
      <button onClick={() = setRunning(false)} disabled={!running}Stop</button
      <button onClick={() = { setRunning(false); setSeconds(0); }}Reset</button
    </div
  );
}
```
**The one they test:** functional updater `setSeconds(s = s + 1)` (never `seconds + 1` — stale closure), and `clearInterval` cleanup so unmount/re-run doesn't leak. `aria-live="polite"` announces the tick.

---

## Run these before the test

You can drop any of these into your notebook's shared React playground to actually run them:

```bash
cd /Users/aniketsolanki/Desktop/work/aniket-solanki-engineering-notes/INTERVIEW_PREP/REACTJS/playground
npm install && npm run dev
```
Add a component under `src/problems/` and import it into the app. Reading is good; typing them once against a live render is what makes them stick.
