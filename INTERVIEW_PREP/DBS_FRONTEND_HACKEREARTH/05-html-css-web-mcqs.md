# 05 — HTML, CSS & Web Platform

DBS reliably asks about `DOCTYPE`, `async` vs `defer`, storage APIs, Shadow DOM, CSS specificity, box model, flexbox, and HTTP basics.

---

### Q1. What does `<!DOCTYPE html>` do?
A) Imports HTML5
B) Tells the browser to render in **standards mode** (not quirks mode); it's not a tag, it's a document declaration
C) Loads a stylesheet
D) Nothing

**Answer: B.** Omitting it triggers **quirks mode**, where old/inconsistent box-model and layout rules apply.

---

### Q2. `async` vs `defer` on `<script>`
A) They're identical
B) Both download in parallel without blocking parsing; `async` executes as soon as it's ready (order not guaranteed, can interrupt parsing); `defer` executes after HTML is fully parsed, in document order
C) `defer` blocks parsing
D) `async` runs after DOMContentLoaded

**Answer: B.**
- Plain `<script>`: blocks parsing to download **and** execute.
- `async`: parse continues, executes ASAP, **order not preserved** — good for independent scripts (analytics).
- `defer`: parse continues, executes after parse in order — good for scripts that depend on the DOM/each other.

---

### Q3. `localStorage` vs `sessionStorage` vs cookies
A) All the same
B) `localStorage`: ~5–10MB, persists until cleared, not sent to server. `sessionStorage`: same size, cleared when the tab closes. Cookies: ~4KB, sent with every HTTP request, can have expiry/HttpOnly/Secure
C) Cookies are the largest
D) `sessionStorage` persists forever

**Answer: B.** Key exam facts: only cookies travel to the server; `sessionStorage` is per-tab; `localStorage` survives restarts.

---

### Q4. What is the Shadow DOM?
A) A hidden copy of the DOM
B) An encapsulated DOM subtree attached to an element (Web Components) — its markup and **scoped styles** don't leak in or out
C) The Virtual DOM
D) A dark-mode DOM

**Answer: B.** It provides style + markup encapsulation; e.g. `<video>` controls live in a shadow tree.

---

### Q5. CSS specificity — which rule wins?
```css
#nav .item a { color: red; }   /* Rule 1 */
div a.link   { color: blue; }  /* Rule 2 */
```
for `<div id="nav"><span class="item"><a class="link">…`
A) Rule 1 (red)
B) Rule 2 (blue)
C) Whichever is last
D) Both

**Answer: A (red).** Specificity (id, class, element): Rule 1 = (1,1,1), Rule 2 = (0,1,2). An ID outweighs any number of classes/elements.

---

### Q6. Specificity ordering, lowest → highest?
A) inline > id > class > element
B) element < class < id < inline style < `!important`
C) `!important` < inline
D) class > id

**Answer: B.** `!important` overrides normal declarations (avoid it); inline styles beat selectors; IDs beat classes; classes beat element/type selectors.

---

### Q7. `box-sizing: border-box` means?
A) Width excludes padding and border
B) The element's declared `width`/`height` **includes** content + padding + border (not margin)
C) Adds a border box
D) Same as `content-box`

**Answer: B.** Default is `content-box` (width = content only, padding/border add on top). `border-box` makes sizing predictable.

---

### Q8. Default `flex-direction` and what `justify-content` controls?
A) column; cross axis
B) row; the **main axis** (horizontal when direction is row)
C) row; the cross axis
D) column; main axis

**Answer: B.** `flex-direction: row` is default. `justify-content` = main axis; `align-items` = cross axis.

---

### Q9. In `display: flex` with `flex-direction: column`, `align-items` now controls?
A) Vertical alignment
B) Horizontal alignment (the cross axis is now horizontal)
C) Nothing
D) Font size

**Answer: B.** When the main axis is vertical (column), the cross axis is horizontal — `align-items` moves items left/right.

---

### Q10. `position: absolute` is positioned relative to?
A) The viewport always
B) The nearest **positioned** ancestor (one with `position` other than `static`); falls back to the initial containing block if none
C) Its normal-flow position
D) Its parent always

**Answer: B.** `relative` = relative to itself (stays in flow). `fixed` = relative to the viewport. `sticky` = relative until a scroll threshold, then fixed.

---

### Q11. Difference between `visibility: hidden` and `display: none`?
A) Identical
B) `visibility: hidden` hides but **keeps the space** (still in layout); `display: none` removes it from layout entirely
C) `display: none` keeps space
D) Both remove from the accessibility tree only

**Answer: B.**

---

### Q12. What is the CSS box model (outer → inner)?
A) content → padding → border → margin
B) margin → border → padding → content
C) border → margin → padding → content
D) padding → margin → content → border

**Answer: B.** From outside in: margin, border, padding, content.

---

### Q13. HTTP status codes — match the family
A) 2xx error, 4xx success
B) 2xx success, 3xx redirect, 4xx client error, 5xx server error
C) 4xx server error
D) 5xx redirect

**Answer: B.** e.g. 200 OK, 301 moved permanently, 304 not modified, 401 unauthorized, 403 forbidden, 404 not found, 500 server error.

---

### Q14. Difference between `GET` and `POST`?
A) None
B) `GET` retrieves data, params in the URL, cacheable, idempotent, no body; `POST` submits data in the body, not cached, not idempotent
C) `POST` is faster
D) `GET` has a body

**Answer: B.**

---

### Q15. What is CORS?
A) A CSS layout mode
B) Cross-Origin Resource Sharing — a browser security mechanism where the server uses `Access-Control-Allow-Origin` headers to permit requests from other origins
C) A React feature
D) A caching header

**Answer: B.** The browser enforces the same-origin policy; CORS headers are how a server opts in to cross-origin access.

---

### Q16. The typical SPA render flow is:
A) Server renders every page fully on each click
B) Browser loads one HTML shell + JS bundle → JS renders the UI → subsequent navigation swaps views client-side via the router and fetches data over AJAX/fetch (no full page reload)
C) Every route is a separate HTML file
D) SPAs don't use JavaScript

**Answer: B.** One document, client-side routing, partial data fetches — vs a traditional multi-page app that requests a new document per navigation.

---

### Q17. `null` vs `undefined` for a missing DOM element from `getElementById`?
A) Returns `undefined`
B) Returns `null` if no element matches
C) Throws
D) Returns `false`

**Answer: B.** `document.getElementById("missing")` returns `null` — guard before using it.

---

### Q18. Event delegation is?
A) Attaching a listener to every child
B) Attaching **one** listener to a common ancestor and using event bubbling (`event.target`) to handle events from many children — fewer listeners, works for dynamically added elements
C) Delegating to the server
D) A React-only concept

**Answer: B.**

---

### Q19. What's the difference between `event.preventDefault()` and `event.stopPropagation()`?
A) Same thing
B) `preventDefault()` cancels the browser's default action (e.g. form submit, link navigation); `stopPropagation()` stops the event from bubbling to ancestors
C) `stopPropagation` cancels default
D) Both stop bubbling

**Answer: B.**

---

### Q20. Which HTML5 semantic tags improve accessibility/SEO?
A) `<div>` and `<span>` only
B) `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>` — they convey structure to assistive tech and crawlers
C) `<table>` for layout
D) `<b>` and `<i>`

**Answer: B.** Semantic tags describe meaning, not just appearance.
