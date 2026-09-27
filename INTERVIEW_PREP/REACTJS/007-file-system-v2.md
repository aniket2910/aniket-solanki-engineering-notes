# File System Data Layer — v2 (the 60-minute interview version)

**Runnable code:** [`playground/src/problems/file-system-v2/`](playground/src/problems/file-system-v2/) — run with `cd playground && npm install && npm run dev`, then pick **File System v2 (60-min)** in the sidebar.

**How this relates to v1:** [006-file-system.md](006-file-system.md) is the "no time limit" version: layered folders, an external store, `Result` types, a labels slice, and per-row subscriptions. That's the design you *talk about*. This v2 is what you can actually **type by hand in about 45 minutes while explaining yourself**: one data file (~175 lines), one hook, one recursive component. Same core idea, far less ceremony. Learn v2 by heart, and use v1 for the follow-up answers.

## ⚡ In one line

Store the tree as a **flat map of id → node** with `parentId` and `childIds`, and write every operation as a **pure function `(state, ...args) => newState`**. It plugs straight into `useState`, gives O(1) lookups, and a move never touches the files inside the folder.

## 🔍 What the interviewer is really testing

- **Can you pick the right data model fast, and say why?** Normalized over nested is the whole game. Say it in the first 10 minutes.
- **Can you ship working CRUD + search in the time box?** A complete, simple solution beats half of a beautiful one.
- **Do you think out loud about edge cases?** Duplicate names, moving a folder into itself, deleting the root, orphans after a delete.
- **Do you know what you left out?** The senior move is ending with "here's what I'd add next and why", not trying to build all of it.

## Why it exists (the problem)

In a live round you have ~60 minutes for clarifying, designing, coding, and discussing. The v1 solution is right but takes well over an hour to type. Interviewers don't mark down a missing `Result` type or a missing store abstraction. They do mark down an unfinished solution, or a candidate who goes silent while coding. v2 is sized so you finish with time to spare and spend that time on the discussion that actually earns the offer.

## What it is

Three small files, typed in this order:

```text
fileSystem.ts      types → helpers → create → read → update → delete → search   (the actual answer)
useFileSystem.ts   useState + one run(op) wrapper that catches errors            (5 minutes)
TreeItem.tsx       recursive row with prompt()-based actions                     (10 minutes)
```

**Mental model:** the data layer is a set of pure functions over one plain object. React just holds the current object in `useState` and swaps it for the new one each write.

## 🎈 Real-life analogy (how to think about it)

**Coding a solution in an interview is like cooking in a timed kitchen challenge.** You don't try the seven-course menu; you plate one dish cleanly and then *describe* the rest. So: cook the main (normalized store + CRUD + search), plate it (a tiny UI), and while the judges taste it, walk them through the courses you'd add next (a `Result` type, a labels table, per-row subscriptions, lazy loading).

For the data model itself, use the same picture as v1: **a warehouse ledger**. Every item has a tag number (`id`), and its card says which box it's in (`parentId`). Each box's card lists its contents (`childIds`). Moving a box means updating three cards, and nothing inside the box gets relabelled.

## 🔧 How it works — the 60-minute game plan

This is the heart of the note. Each phase has **what to do** and **what to say**.

### Phase 1 · Clarify (0–5 min) — don't touch the keyboard

Ask, then state your assumptions out loud:

- "Is the whole org's tree loaded on the client, or loaded folder by folder?" → **Assume it's all loaded, and mention lazy loading at the end.**
- "Must names be unique inside a folder? Case-sensitive?" → **Assume unique, case-insensitive, like Windows and macOS.**
- "Should I include a UI, or is the data layer the focus?" → **Data layer first, a minimal UI if time allows.**
- "Search by name only, or also by type?" → **Name substring, plus an optional type filter.**

**Say:** "I'll build the data layer as pure TypeScript functions first, so it's testable without React, then wire a small UI on top."

### Phase 2 · Data model (5–12 min) — sketch it before coding

Write this in comments or on the whiteboard:

```text
state = {
  rootId: "r1",
  nodes: {
    r1: { id, name: "Acme", type: "folder", parentId: null, childIds: ["f1","f2"] },
    f1: { id, name: "Eng",  type: "folder", parentId: "r1", childIds: ["x1"] },
    x1: { id, name: "a.pdf",type: "file",   parentId: "f1", childIds: [] },
  }
}
```

**Say (this paragraph is worth memorizing):**
"I'll avoid a nested tree and normalize it: one flat map keyed by id. Each node stores its `parentId` and a folder stores its `childIds`. That gives O(1) lookup by id, breadcrumbs in O(depth) by walking up, and moving a folder only updates three nodes, because children point at their parent by id, not by path. For React, every write returns a new state object and only replaces the nodes that changed, so unchanged nodes keep their references. For extensibility, each node gets a `meta` bag for custom fields, and bigger features like labels or permissions get their own maps keyed by node id, so the core never changes."

Then the complexity table, out loud: read O(1), path O(depth), create/rename O(siblings), move O(depth + siblings), delete O(subtree), search O(n).

### Phase 3 · Types + helpers (12–20 min)

Type the types first. They're the contract, and the interviewer can already follow your design.

```ts
export type NodeType = "folder" | "file";

export interface FsNode {
  id: string;
  name: string;
  type: NodeType;
  parentId: string | null; // null only for the org root
  childIds: string[]; // always [] for files
  createdAt: number;
  updatedAt: number;
  meta: Record<string, unknown>; // extension point: custom fields, tags, etc.
}

export interface FsState {
  rootId: string;
  nodes: Record<string, FsNode>;
}
```

**Say:** "I'm using one interface with a `type` field to save time. In production I'd make it a discriminated union, so files can't have `childIds` at all."

Then the helpers. Each is a few lines, and each one stops you repeating a check in every operation:

```ts
function getOrThrow(state: FsState, id: string): FsNode {
  const node = state.nodes[id];
  if (!node) throw new Error(`Item ${id} not found`);
  return node;
}

function assertFolder(node: FsNode): void {
  if (node.type !== "folder") throw new Error(`"${node.name}" is not a folder`);
}

function cleanName(name: string): string {
  const clean = name.trim();
  if (!clean) throw new Error("Name can't be empty");
  return clean;
}

function assertUniqueName(state: FsState, parent: FsNode, name: string, ignoreId?: string): void {
  const taken = parent.childIds.some(
    (id) => id !== ignoreId && state.nodes[id].name.toLowerCase() === name.toLowerCase(),
  );
  if (taken) throw new Error(`"${name}" already exists in "${parent.name}"`);
}

// The only place that writes: copy the map, swap in changed nodes.
function withNodes(state: FsState, ...changed: FsNode[]): FsState {
  const nodes = { ...state.nodes };
  changed.forEach((node) => (nodes[node.id] = node));
  return { ...state, nodes };
}
```

**Say:** "`withNodes` is the single write path. It copies the map and replaces only the changed nodes. Everything else keeps its reference, which is what React compares." And: "I'm throwing errors for speed. The UI wrapper catches them. With more time I'd return a `Result` type instead."

### Phase 4 · Create + Read (20–27 min)

```ts
export function createRoot(orgName: string): FsState {
  const now = Date.now();
  const root: FsNode = {
    id: crypto.randomUUID(), name: orgName, type: "folder", parentId: null,
    childIds: [], createdAt: now, updatedAt: now, meta: {},
  };
  return { rootId: root.id, nodes: { [root.id]: root } };
}

export function createNode(state: FsState, parentId: string, name: string, type: NodeType): FsState {
  const parent = getOrThrow(state, parentId);
  assertFolder(parent);
  const clean = cleanName(name);
  assertUniqueName(state, parent, clean);

  const now = Date.now();
  const node: FsNode = {
    id: crypto.randomUUID(), name: clean, type, parentId,
    childIds: [], createdAt: now, updatedAt: now, meta: {},
  };
  return withNodes(state, node, { ...parent, childIds: [...parent.childIds, node.id], updatedAt: now });
}

export const getNode = (state: FsState, id: string): FsNode | undefined => state.nodes[id];

export function getChildren(state: FsState, folderId: string): FsNode[] {
  return getOrThrow(state, folderId).childIds.map((id) => state.nodes[id]);
}

// Breadcrumbs: follow parentId up to the root. O(depth).
export function getPath(state: FsState, id: string): FsNode[] {
  const path: FsNode[] = [];
  let current: FsNode | undefined = state.nodes[id];
  while (current) {
    path.unshift(current);
    current = current.parentId ? state.nodes[current.parentId] : undefined;
  }
  return path;
}
```

**Say while typing `createNode`:** "Guard clauses first: parent exists, it's a folder, the name is valid and unique. Then build the node and write exactly two objects: the new node and the parent with the new child id." Client-side ids from `crypto.randomUUID()` also enable optimistic creates later, so mention that.

### Phase 5 · Update + Delete (27–40 min)

```ts
export function renameNode(state: FsState, id: string, newName: string): FsState {
  const node = getOrThrow(state, id);
  if (!node.parentId) throw new Error("Can't rename the root");
  const clean = cleanName(newName);
  assertUniqueName(state, getOrThrow(state, node.parentId), clean, id);
  return withNodes(state, { ...node, name: clean, updatedAt: Date.now() });
}

export function moveNode(state: FsState, id: string, targetId: string): FsState {
  const node = getOrThrow(state, id);
  const target = getOrThrow(state, targetId);
  if (!node.parentId) throw new Error("Can't move the root");
  assertFolder(target);
  if (node.parentId === targetId) return state;

  // Cycle check: walk up from the target; if we meet the node, target is inside it.
  if (getPath(state, targetId).some((n) => n.id === id)) {
    throw new Error("Can't move a folder into itself");
  }
  assertUniqueName(state, target, node.name);

  const oldParent = getOrThrow(state, node.parentId);
  const now = Date.now();
  return withNodes(
    state,
    { ...node, parentId: targetId, updatedAt: now },
    { ...oldParent, childIds: oldParent.childIds.filter((c) => c !== id), updatedAt: now },
    { ...target, childIds: [...target.childIds, id], updatedAt: now },
  ); // descendants untouched: they point at their parent by id, not by path
}

export function updateMeta(state: FsState, id: string, patch: Record<string, unknown>): FsState {
  const node = getOrThrow(state, id);
  return withNodes(state, { ...node, meta: { ...node.meta, ...patch }, updatedAt: Date.now() });
}

export function deleteNode(state: FsState, id: string): FsState {
  const node = getOrThrow(state, id);
  if (!node.parentId) throw new Error("Can't delete the root");

  // Collect the whole subtree, or descendants stay behind as orphans.
  const toDelete: string[] = [];
  const stack = [id];
  while (stack.length) {
    const current = state.nodes[stack.pop()!];
    toDelete.push(current.id);
    stack.push(...current.childIds);
  }

  const parent = getOrThrow(state, node.parentId);
  const nodes = { ...state.nodes };
  toDelete.forEach((d) => delete nodes[d]);
  nodes[parent.id] = { ...parent, childIds: parent.childIds.filter((c) => c !== id) };
  return { ...state, nodes };
}
```

**Say at the cycle check** (interviewers often wait to see if you catch this): "If I move `Engineering` into its own `Runbooks` subfolder, that whole branch gets cut off from the root. I reuse `getPath` on the target: if the node I'm moving is one of the target's ancestors, reject."

**Say at delete:** "Deleting a folder has to remove its whole subtree from the map, or the files inside become orphans that search still finds. I use an explicit stack instead of recursion, so a very deep tree can't overflow the call stack. In production I'd soft-delete with a `trashedAt` field so it's O(1) and undoable."

### Phase 6 · Search (40–44 min)

```ts
// Linear scan of the flat map — fine for thousands of loaded items.
export function searchNodes(state: FsState, query: string, type?: NodeType): FsNode[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return Object.values(state.nodes).filter(
    (n) => n.id !== state.rootId && n.name.toLowerCase().includes(q) && (!type || n.type === type),
  );
}
```

**Say:** "Because the map is flat, search is just a filter, no recursive walk. It's O(n), which is fine for what a client has loaded. At Drive scale this becomes a server call, debounced from the input."

### Phase 7 · Minimal React UI (44–54 min)

The hook. One `run` wrapper serves every operation, because they all share the shape `(state) => newState`:

```ts
export function useFileSystem() {
  const [state, setState] = useState<FsState>(createSeed);
  const [error, setError] = useState<string | null>(null);

  function run(op: (s: FsState) => FsState) {
    try {
      setState(op(state));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return { state, error, run };
}
```

Then a recursive `TreeItem` ([`TreeItem.tsx`](playground/src/problems/file-system-v2/TreeItem.tsx)) that renders a row with buttons, sorts children (folders first, then A→Z), and renders a `TreeItem` for each child. Actions use `window.prompt` for names.

**Say:** "I'm using `prompt()` for inputs because the data layer is what's being assessed. In a real app these would be inline edit fields." And: "Sorting happens in the view, not in the store, because order is a display choice."

If time is short, **skip the UI entirely** and instead show a few calls in a comment or console: create → move → search → delete. The prompt says "data layer". A working, tested data layer is a complete answer.

### Phase 8 · Wrap-up discussion (54–60 min) — where the offer is won

Run through these, briefly, in this order:

1. **Complexity recap** — the table from Phase 2.
2. **Extensibility** — "`meta` covers custom fields today. Labels would be `labelsByNode: Record<nodeId, labelId[]>`, a separate map, so tagging doesn't touch the tree code. Permissions: an ACL map per node, with inheritance resolved by walking up `parentId`, the same way as breadcrumbs. The client only uses permissions to hide buttons; the server enforces them. On delete, those maps must drop the deleted ids too."
3. **Render performance** — "Right now every `TreeItem` gets the whole state, so any change re-renders the tree. The upgrade is to wrap rows in `memo`, pass only an id, and have each row subscribe to its own node through an external store with `useSyncExternalStore`. Because untouched nodes keep their references, only changed rows re-render."
4. **Scale** — lazy-load children per folder, server-side search, virtualize long lists, optimistic updates with rollback to the previous state object.
5. **Error handling** — replace `throw` with a `Result` type, so failure is typed data and never escapes into React.

Everything in this list is built in [v1](006-file-system.md), so you can answer any follow-up in depth.

### If you're running behind — the cut list

Cut in this order, and **say what you're cutting**, because that's judgment too:

1. The UI (describe it instead).
2. `updateMeta` (mention it in one line).
3. The type filter in search.
4. `createdAt`/`updatedAt` fields.

Never cut: the normalized model, the cycle check, the subtree delete, the duplicate-name check. Those are what's being scored.

## 💻 In code

Everything above is the real code, in typing order. The full files:

- [`fileSystem.ts`](playground/src/problems/file-system-v2/fileSystem.ts) — the whole data layer (types → helpers → CRUD → search)
- [`useFileSystem.ts`](playground/src/problems/file-system-v2/useFileSystem.ts) — `useState` + the `run` wrapper
- [`TreeItem.tsx`](playground/src/problems/file-system-v2/TreeItem.tsx) — the recursive row
- [`index.tsx`](playground/src/problems/file-system-v2/index.tsx) — search box + error + tree
- [`seed.ts`](playground/src/problems/file-system-v2/seed.ts) — demo data (in an interview, just create two or three nodes inline)

**Practice drill:** delete `fileSystem.ts` in a scratch copy, set a 45-minute timer, and rewrite it from the Phase 2 sketch while talking out loud. Then diff it against this one.

## 🏗️ Code quality & principles applied

**Decomposition:** pure data functions (`fileSystem.ts`) → one hook that owns state and errors (`useFileSystem.ts`) → one presentational recursive component (`TreeItem.tsx`). Three pieces, and each has one job.

**Principles, tied to lines:**

- **Normalization / single source of truth** — each node lives once in `nodes`. Paths are computed by `getPath`, never stored.
- **DRY** — `getOrThrow`, `assertFolder`, `cleanName`, `assertUniqueName`, and `withNodes` are each reused by several operations.
- **Guard clauses / fail fast** — every operation validates at the top, so the happy path at the bottom stays flat.
- **Immutability** — no function mutates its input, which is why `setState(op(state))` works and React sees the change.
- **Separation of concerns** — data rules live in `fileSystem.ts`, React state in the hook, display sorting in the component, styles in CSS.
- **KISS / YAGNI** — one interface instead of a union, `throw` instead of `Result`, `prompt` instead of forms. Each is a deliberate time trade-off, and you say so.

**Sentences to say:**

- "I'll get a complete, simple version working first, then talk about what I'd harden."
- "Each helper removes a check I'd otherwise repeat in three places."
- "I'm cutting X for time. Here's how I'd add it."

**What you deliberately did NOT do, and the one-liner for each:**

- No store abstraction, no Context → "`useState` is enough for one screen. I'd move to an external store when many components need slices."
- No per-row memoization → "It's the first optimization I'd make; the immutable design already supports it."
- No labels or permissions code → "The `meta` field and the separate-map pattern cover them. I'll sketch rather than build."

## 🗣️ Keywords to say

- **Normalized state** — flat map by id, relations as ids.
- **Parent pointer / adjacency list** — `parentId` up, `childIds` down.
- **Pure function / immutable update** — returns new state, never mutates.
- **Structural sharing** — unchanged nodes keep their references.
- **Guard clauses** — validate first, and return or throw early.
- **Invariants** — unique sibling names, no cycles, root protected, no orphans.
- **Derived state** — paths and sorted order are computed, not stored.
- **Extension point** — `meta` bag plus separate maps keyed by node id.
- **Time-boxing / scoping** — say what you're cutting and why.

## 🎯 How it's asked in interviews

**Phrasings that are this problem:** "Design the data layer for Google Drive / a file explorer", "build a folder tree with CRUD", "VS Code sidebar", "nested comments / org chart / category tree state". If the user edits a tree, normalize it.

**Follow-up ladder:** complexity of each operation → "move a folder with 10k files?" → "what stops a cycle?" → "why does the whole tree re-render?" → "how would you add tags / permissions?" → "2 million files?" → "two users editing at once?". Every answer is in the Phase 8 list, with depth in [v1](006-file-system.md).

**Traps specific to the time-boxed round:**

- **Starting to code before stating the model.** Five minutes on the sketch saves fifteen minutes of rewrites, and the interviewer scores the reasoning.
- **Building the UI first.** If time runs out, you've shown a tree with no data layer, which was the actual question.
- **Going silent while typing.** Narrate each guard clause as you write it.
- **Mutating state** (`parent.childIds.push(id)`). It's quick to write, but React won't see the change, and it's a red flag.
- **Forgetting the cycle check or the subtree delete.** These are the two things most likely to be probed.
- **Over-engineering early** (generics, plugin systems, a Redux setup). It burns the clock and reads as poor prioritization.

**Model answer arc:** clarify (5) → sketch model + complexities (7) → types & helpers (8) → create/read (7) → update/delete (13) → search (4) → UI or console demo (10) → discussion (6).

## 🔗 Linked concepts

- [File System Data Layer v1](006-file-system.md) — the full-depth version: external store, `Result` types, labels slice, per-row subscriptions. Use it for every "how would you improve this?" follow-up.
- [Debounced Input](005-debounce-input.md) — the answer to "search hits the server on every keystroke".

## 🧠 Rapid-fire Q&A

**Q: First thing you say after reading the prompt?**
A: The clarifying questions (whole tree loaded? unique names? UI needed?), then "I'll normalize it into a flat map keyed by id, with parent and child pointers."

**Q: Why is `move` cheap?**
A: It updates three nodes: the moved node's `parentId` and the two parents' `childIds`. Descendants point at their parent by id, so they don't change.

**Q: How does your cycle check work?**
A: `getPath(target)` lists the target's ancestors. If the node being moved is among them, the target is inside it, so reject.

**Q: Why throw instead of returning errors?**
A: Speed in a time box. One `run` wrapper catches for every operation. In production I'd return a `Result` type, so errors are typed and can't escape.

**Q: Why does `setState(op(state))` use `state` and not the functional updater?**
A: To catch the error synchronously in the same `try`. It's safe here because each click triggers one write. If writes could batch, I'd move to `useReducer` or an external store.

**Q: Why sort in the component, not the store?**
A: Display order is a view choice (name, date, size), so the store keeps insertion order and the view sorts. For huge folders I'd memoize it or sort on write.

**Q: How would you add tags without changing `FsNode`?**
A: A separate `labelsByNode: Record<nodeId, labelId[]>` map, cleaned up on delete. The tree code doesn't change.

**Q: What's the first performance fix?**
A: Memoized rows that take an id and subscribe to their own node, so a rename re-renders one row instead of the whole tree.

**Q: What did you cut, and why?** (A design-choice question — have this ready.)
A: The discriminated union, the `Result` type, and a real store. Each was a deliberate time trade-off, and the design already supports adding them without a rewrite.

## ✅ Cheat lines

- **Clarify 5, model 7, code 30, UI 10, discuss 6.** Never code before the model is said out loud.
- **Flat map + `parentId` + `childIds`**, and every write is `(state) => newState` through `withNodes`.
- **Never cut:** cycle check, subtree delete, unique names, root guard.
- **Finish simple, then talk about hardening.** The discussion is where "senior" gets decided.
