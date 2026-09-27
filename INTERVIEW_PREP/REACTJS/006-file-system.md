# File System Data Layer (Google Drive / File Explorer)

**Runnable code:** [`playground/src/problems/file-system/`](playground/src/problems/file-system/) — run with `cd playground && npm install && npm run dev`, then pick **File System Data Layer** in the sidebar. Search, create, rename to a name that already exists (see the error), move a folder into its own child (blocked), tag items with labels, delete a folder (its labels get cleaned up too).

**Doing this in a timed round?** This v1 is the full-depth design with no time limit. For the version you can type by hand in about 45 minutes, with a minute-by-minute plan and what to say at each step, see [v2 — the 60-minute version](007-file-system-v2.md).

**The prompt, as usually given:** design the client-side data layer for an org-level content system (like a file explorer or Google Drive). Data belongs to the organization, it's hierarchical (folders contain files and folders). Design the in-memory data structures and implement CRUD + Search in TypeScript. It must be efficient for a UI that renders and updates often, and extensible for labels, permissions, and custom metadata later.

## ⚡ In one line

Don't store the tree as nested JSON — store it **normalized**: one flat map `id → node`, each node holding a `parentId` pointer and each folder an ordered `childIds` list; write with **pure, immutable functions** so only the touched nodes get new references; and put every future feature (labels, permissions) in **its own table keyed by node id**, so adding a feature never changes the core tree.

## 🔍 What the interviewer is really testing

- **Data modeling judgment.** The whole question is "do you reach for a normalized map over a nested tree, and can you explain why?" Everything else follows from that one choice.
- **Complexity per operation, for a UI.** Can you say what each of create / read / rename / move / delete / search costs, and why a move is cheap even for a folder holding 10,000 files?
- **React-friendly updates.** Do you know that React decides what to re-render by comparing references, and that immutable updates with **structural sharing** are what make "update often" cheap?
- **Invariants and edge cases.** Duplicate names, moving a folder into itself (cycles), deleting the root, orphaned descendants after delete, stale extension data. Candidates who guard these unprompted stand out.
- **Extensibility as design, not as a promise.** "Just add a field later" isn't an answer. Show *where* labels and permissions plug in, and that it doesn't touch existing code (open/closed).

## Why it exists (the problem)

The obvious model is a nested object: `{ name, children: [{ name, children: [...] }] }`. It looks exactly like the UI, and it hurts for every operation that isn't "render the whole thing top-down":

- **Find by id** means walking the tree: O(n).
- **Update a deep node immutably** means finding it, then cloning every ancestor up to the root by hand.
- **Move** means a deep search to remove it and another to insert it.
- **Search** needs a recursive walk that also has to rebuild the path as it goes.
- If you use the **path as identity** (`/Engineering/Runbooks`), renaming a folder silently changes the identity of everything inside it.

A normalized store fixes all of these at once. It's the same reason databases normalize tables, and the same shape Redux recommends in its "Normalizing State Shape" guide.

## What it is

Three layers, each with one job:

```text
core/   pure TypeScript — types, CRUD ops, search, labels slice. No React.
store/  one mutable variable (the current snapshot) + subscribe. Framework-agnostic.
ui/     React components that each subscribe to just the slice they draw.
```

The state shape:

```ts
FsState = {
  tree: {
    orgId, rootId,
    nodes: { [id]: FolderNode | FileNode }   // flat index — every node lives exactly once
  },
  labels: {                                   // a feature slice, added "later"
    labels: { [labelId]: Label },
    byNode: { [nodeId]: labelId[] }
  }
}
```

**Mental model:** the tree is a *graph stored as a table*. Relationships are ids, never nested objects. The nested tree the user sees is something the UI *builds* from the table while rendering.

## 🎈 Real-life analogy (how to think about it)

**A warehouse inventory ledger.**

- Every box and every item gets a **tag number** when it arrives. That's the `id`, and it never changes.
- The ledger has one **card per tag**. An item's card says "lives in box #42" (`parentId`). A box's card lists the tags inside it (`childIds`). That ledger is `nodes`.
- To find anything, you look up its tag in the ledger. You don't open boxes one by one (O(1) lookup).
- To **move** a box to another shelf, you update three cards: the box's "lives in" line, the old shelf's list, and the new shelf's list. Nothing *inside* the box gets re-labelled, because contents point at the box's tag, not at its location. That's why a move costs the same no matter how full the box is.
- **Labels and permissions** are separate binders keyed by tag number ("tag 17 → Confidential"). Adding a new binder next year doesn't mean reprinting a single card. That's the extensibility story.
- **Immutability:** when something changes you don't erase a card. You write fresh copies of only the changed cards and a new index page. The old index page still points at the old cards, so undo and "did this card change?" checks are free.

## 🔧 How it works (under the hood)

### 1. The node types

A **discriminated union** on `kind`. Shared fields sit on a base; kind-specific fields sit on each variant. `switch (node.kind)` narrows the type for you.

- `id`, `name`, `parentId` (null only for the root), `createdBy`/`createdAt`/`updatedAt`, `metadata`
- Folder adds `childIds` (**kept in display order**: folders first, then natural A→Z)
- File adds `mimeType`, `sizeBytes`

**Org ownership:** the org is the owner (`tree.orgId`). `createdBy` is an audit field, not ownership, so nothing breaks when an employee leaves. Access is a separate concern (permissions, below).

### 2. Operations and their cost

`n` = total loaded nodes, `k` = items in one folder, `d` = depth, `s` = subtree size.

| Operation | How | Cost |
|-----------|-----|------|
| Read node | `nodes[id]` | O(1) |
| List children | `folder.childIds` (already sorted) | O(k) to render, O(1) to get |
| Breadcrumbs / path | follow `parentId` up to root | O(d) |
| Create | validate name, check siblings, insert into sorted `childIds` | O(k) |
| Rename | same checks, re-position in parent's `childIds` | O(k) |
| Move | cycle check (walk up from target) + fix two `childIds` + one `parentId` | O(d + k) |
| Delete | collect the whole subtree, remove each from the index | O(s) |
| Search | linear scan of the flat index, score, sort, take top N | O(n) |

**Honest footnote interviewers respect:** every immutable write does `{ ...tree.nodes }`, which is an O(n) *shallow* copy (it copies pointers, not nodes). For thousands to tens of thousands of nodes that's cheap in practice. If it ever shows up in a profile, the next steps are a persistent data structure (Immutable.js's HAMT-based `Map` gives near O(log n) updates) or a mutable `Map` plus a version counter. Say this — it shows you know where the model bends.

### 3. Why immutability makes the UI fast

React (and `React.memo`, and `useSyncExternalStore`) decide whether something changed with a reference check (`Object.is`). A rename produces:

```text
before:  nodes ──► { A, B, C, D, E }
after:   nodes'──► { A, B', C', D, E }     // B renamed, C is its parent (re-sorted childIds)
                     ▲        ▲  ▲         // A, D, E are the SAME objects as before
```

Every row subscribes to `nodes[id]` for its own id. Rows A, D, E get the same reference back and don't re-render. Only B and its parent C do. That's **structural sharing**: new copies along the change, shared references everywhere else.

It also makes **no-ops free**: renaming to the same name returns the *same* state object, and the store skips notifying anyone.

### 4. Why the store lives outside React

The data layer is a tiny external store (the same contract Redux and Zustand expose): `getState()` + `subscribe()`. React binds to it with `useSyncExternalStore`, the built-in hook for exactly this since React 18.

Why not `useState` in a top-level component, or state in Context?

- **Context re-renders every consumer** whenever its value changes. Put the whole file tree in Context and one rename re-renders every row. Here Context carries the **store object**, which never changes identity, so the Provider never triggers renders. Each component subscribes to its own slice.
- **Errors come back synchronously.** A command runs the pure op and returns a `Result`. With `setState(prev => ...)` you can't easily hand a "name already taken" error back to the form that asked.
- **Testable without React.** The core is plain functions: `(state, input) → Result<newState>`.

**Selector rule (a real trap):** a `useSyncExternalStore` snapshot must return a *cached* reference. A selector like `s => getChildren(s).sort(...)` builds a new array on every read, so React sees "changed" every time. It warns "The result of getSnapshot should be cached to avoid an infinite loop". Two fixes are used in the code:
- `childIds` are **sorted on write**, so the row just reads the stored array. Reads (renders) vastly outnumber writes, so pay the cost on the rare side.
- `getLabelIds` returns one shared `NO_LABELS` constant for "no labels" instead of a fresh `[]`.

### 5. Invariants every write protects

- **Names**: trimmed, non-empty, ≤ 255 chars, no `/` or `\`. Unique among siblings, case-insensitively (explorer rule).
- **No cycles**: you can't move a folder into itself or a descendant. Check: walk *up* from the target; if you hit the folder being moved, reject. O(d), not a subtree scan.
- **Root is protected**: can't rename, move, or delete it.
- **No orphans**: delete removes the entire subtree from the index. Otherwise search would keep finding "deleted" files, and memory would leak.
- **Cascade to feature slices**: delete returns `removedIds`, and the store prunes the labels slice in the *same* commit. That's `ON DELETE CASCADE` for the client.
- **All-or-nothing**: a failed op returns `{ ok: false }` and is never committed. The store can't end up half-updated.

### 6. Extensibility: three levels, each for a different kind of change

1. **Custom metadata** (`node.metadata: Record<string, unknown>`) — for open-ended, per-org fields like "department" or "retentionDays". No code change needed; `patchMetadata` merges. Suggest namespaced keys (`"legal.retentionDays"`) to avoid collisions.
2. **Feature slices** keyed by `NodeId` — for real features with their own rules. Labels are implemented this way ([`core/labels.ts`](playground/src/problems/file-system/core/labels.ts)); it never imports tree code. Permissions would be the same template. Bonus: tagging a file changes the labels slice only, so the file's node reference is unchanged and its row doesn't re-render for tree reasons.
3. **New node kinds** — add a variant to the union (`{ kind: "shortcut", targetId }`). TypeScript then flags every `switch` that doesn't handle it.

**Permissions sketch** (the most common follow-up). Store an ACL per node and resolve *inheritance* by walking up, exactly like breadcrumbs:

```ts
type Role = "viewer" | "editor" | "owner";
type AclState = Record<NodeId, Record<PrincipalId, Role>>; // principal = user or group

function effectiveRole(tree: TreeState, acl: AclState, nodeId: NodeId, who: PrincipalId): Role | undefined {
  // Closest explicit grant wins; otherwise inherit from the parent. O(depth).
  for (let id: NodeId | null = nodeId; id; id = tree.nodes[id]?.parentId ?? null) {
    const role = acl[id]?.[who];
    if (role) return role;
  }
  return undefined;
}
```

Say clearly: **client-side permissions are for UX only** (hide or disable buttons). The server is the real enforcer.

### 7. What changes at real Drive scale

Worth two sentences in the interview, not an implementation:

- You can't load a whole org into the browser. Load **per folder on expand** (a folder gets a `childrenStatus: "idle" | "loading" | "loaded"`), and run search on the **server**. The client scan stays for "search what's loaded" / instant filtering.
- Writes become **optimistic**: apply locally with a client-generated id (`crypto.randomUUID()`), send to the server, and on failure restore the previous snapshot. Immutability makes that rollback a pointer swap.
- A folder with 5,000 children needs **virtualization** (render only visible rows).

## 💻 In code

**The naive version (what to say you're avoiding):**

```ts
// Nested: looks like the UI, but every operation starts with a search.
type NestedFolder = { name: string; children: (NestedFolder | { name: string })[] };
// rename(id) → recursive find O(n) → clone every ancestor by hand → easy to get wrong.
```

**The normalized types** ([`core/types.ts`](playground/src/problems/file-system/core/types.ts)):

```ts
interface BaseNode {
  readonly id: NodeId;
  readonly name: string;
  readonly parentId: NodeId | null;       // parent pointer → path is O(depth)
  readonly createdBy: UserId;             // audit only; the org owns the node
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly metadata: Readonly<Record<string, unknown>>;
}
export interface FolderNode extends BaseNode { readonly kind: "folder"; readonly childIds: readonly NodeId[] }
export interface FileNode extends BaseNode { readonly kind: "file"; readonly mimeType: string; readonly sizeBytes: number }
export type FsNode = FolderNode | FileNode;
```

**Errors as values** ([`core/result.ts`](playground/src/problems/file-system/core/result.ts)). The UI shows the message and switches on the stable `code`:

```ts
export type Result<T> = { ok: true; value: T } | { ok: false; error: FsError };
```

**A write op — move** ([`core/tree-ops.ts`](playground/src/problems/file-system/core/tree-ops.ts)). Guard clauses up top, then build exactly three new objects:

```ts
export function moveNode(tree: TreeState, id: NodeId, targetId: NodeId, ctx: OpContext): Result<TreeState> {
  const found = requireNonRoot(tree, id);            // shared guard: exists + not root
  if (!found.ok) return found;
  const { node, parent } = found.value;
  const target = getFolder(tree, targetId);
  if (!target) return fail("NOT_A_FOLDER", "Items can only be moved into a folder.");
  if (target.id === parent.id) return ok(tree);       // no-op → same reference → no re-render
  if (isInSubtree(tree, target.id, node.id)) return fail("CYCLE", "Can't move a folder into itself or its subfolder.");
  if (isNameTaken(tree, target, node.name)) return fail("NAME_TAKEN", `"${node.name}" already exists there.`);

  const now = ctx.now();
  const moved: FsNode = { ...node, parentId: target.id, updatedAt: now };
  const oldParent: FolderNode = { ...parent, childIds: parent.childIds.filter((c) => c !== id), updatedAt: now };
  const newParent: FolderNode = { ...target, childIds: insertSorted(tree, target.childIds, moved), updatedAt: now };
  return ok(writeNodes(tree, [moved, oldParent, newParent])); // descendants untouched
}
```

`ctx` injects `now()`, `newId()`, and `userId`. The core never calls `Date.now()` or `crypto` directly, so tests are deterministic (Dependency Inversion).

**Search** ([`core/search.ts`](playground/src/problems/file-system/core/search.ts)). Filters are just predicates, so a new filter is one more `push`:

```ts
type Filter = (node: FsNode, state: FsState) => boolean;

function buildFilters({ kind, labelId }: SearchQuery): Filter[] {
  const filters: Filter[] = [];
  if (kind) filters.push((node) => node.kind === kind);
  if (labelId) filters.push((node, state) => getLabelIds(state.labels, node.id).includes(labelId));
  return filters;
}
// scan → score (exact 3 > prefix 2 > contains 1) → sort → top N → build paths ONLY for those N
```

**The store facade** ([`store/fileSystemStore.ts`](playground/src/problems/file-system/store/fileSystemStore.ts)). Commit only on success; delete updates tree and labels in one commit:

```ts
remove(id: NodeId): Result<void> {
  const result = deleteNode(state().tree, id, ctx);
  if (!result.ok) return result;
  const { tree, removedIds } = result.value;
  store.setState({ tree, labels: pruneLabels(state().labels, removedIds) }); // atomic cascade
  return ok(undefined);
},
```

**A row subscribes to itself** ([`ui/TreeRow.tsx`](playground/src/problems/file-system/ui/TreeRow.tsx)):

```tsx
const TreeRow = memo(function TreeRow({ id, level }: TreeRowProps) {
  const { fs, selection } = useExplorer();                              // stable stores from Context
  const node = useSelector(fs, (s) => s.tree.nodes[id]);                // re-renders only if THIS node changed
  const isSelected = useSelector(selection, (sel) => sel === id);       // boolean → 2 rows re-render per click
  // ...render the row, then <TreeRow id={childId} /> for each of node.childIds
});
```

Selection lives in a **separate** tiny store: it's this viewer's UI state, not shared org data.

## 🏗️ Code quality & principles applied

**Decomposition — and why those boundaries:**

- `core/` = pure logic, split by responsibility: `tree.ts` (reads), `tree-ops.ts` (writes), `search.ts`, `labels.ts` (a feature), `result.ts` (error shape), `types.ts`. None of it imports React.
- `store/` = the only mutable variable, plus React bindings. `createStore` is generic and reused for the selection store.
- `ui/` = small components, each under ~75 lines: `TreeRow`, `FileTree`, `DetailsPanel` (composes `RenameForm`, `CreateForm`, `MoveControl`, `LabelToggles`), `SearchPanel`. One shared `useResultMessage` hook turns any `Result` into an inline error.

**Principles by name, tied to the code:**

- **Normalization / single source of truth** — every node lives once in `nodes`. Paths, breadcrumbs, and the nested tree are *derived*, never stored, so they can't drift.
- **Separation of concerns** — domain data (store) vs UI state (selection, expanded) vs presentation (CSS classes; label colors are tokens like `"red"` mapped to classes, no inline styles).
- **Open/Closed** — labels were added as a new slice without editing tree code; permissions follow the same template.
- **Single Responsibility** — `writeNodes` is the only place that writes the index; `requireNonRoot` is the only "exists and not root" check; `validateName` the only name rule.
- **DRY** — rename/move/delete share `requireNonRoot`; create/rename/move share `validateName`, `isNameTaken`, `insertSorted`.
- **Dependency Inversion** — clock, id generator, and user are injected through `OpContext`.
- **Fail fast / guard clauses** — every op validates at the top, and the happy path stays flat.
- **Immutability + structural sharing** — this is what makes the "efficient for frequent UI updates" requirement true, not just claimed.
- **Defense in depth** — `MoveControl` only offers valid folders, but the store still rejects cycles. The UI is never the only guard.

**Sentences to say while coding:**

- "Before writing code: I'll normalize this. A flat map by id with parent pointers makes lookup O(1), path O(depth), and a move doesn't touch descendants."
- "Ids are identity, not paths. Otherwise renaming a folder would change the identity of everything under it."
- "Every write is a pure function returning a new state, and untouched nodes keep their references. That's what lets `memo`'d rows skip re-rendering."
- "I'm returning a `Result` instead of throwing, so a failed op is never half-applied and the form can show the error."
- "Labels go in their own table keyed by node id. That's the extension point: permissions slot in the same way without touching the tree code."
- "I sort `childIds` on write, because renders happen far more often than renames, and it keeps selectors returning stable references."

**What was deliberately NOT done (and why):**

- **No generic plugin/extension registry.** With one feature slice, `remove` calls `pruneLabels` directly. When a third slice shows up, extract a `pruneAll(removedIds)` list. Building it now is YAGNI.
- **No Immutable.js / HAMT.** The object-spread copy is fine at this size. Mention it as the scaling path, don't pay the dependency and API cost up front (KISS).
- **No search index (trie / inverted index).** A linear scan of thousands of names is fast. An index costs memory and has to be updated on every write. Add it only when profiling says so.
- **No permissions implementation.** Sketched, not built. The requirement was "accommodate later", and the slice pattern proves it can.
- **No soft-delete / trash.** One sentence in the interview: "In production I'd soft-delete with a `trashedAt` field so delete is O(1) and undoable, and purge on the server."

## 🗣️ Keywords to say

- **Normalized state** — each entity stored once in a map by id; relations as ids. The core answer.
- **Adjacency list / parent pointer** — `childIds` down, `parentId` up. Both directions exist so both "list children" and "path to root" are cheap.
- **Structural sharing** — new objects only along the change; everything else reused by reference.
- **Referential equality / `Object.is`** — how React, `memo`, and `useSyncExternalStore` detect change.
- **Derived state** — paths, breadcrumbs, the visual tree: computed from the source of truth, not stored.
- **Discriminated union** — `kind: "folder" | "file"` lets TypeScript narrow and flags unhandled new kinds.
- **External store / `useSyncExternalStore`** — state outside React with `getState` + `subscribe`; components subscribe to slices. Tear-free under concurrent rendering.
- **Selector** — a function picking the slice a component needs. Must return a stable reference.
- **Invariants** — rules every write preserves: unique sibling names, no cycles, no orphans, root protected.
- **Cascade delete** — removing a node also cleans every feature table keyed by it.
- **Errors as values / `Result` type** — no throwing across layers; failure is data.
- **Optimistic update + rollback** — apply locally, confirm with the server, restore the old snapshot on failure.
- **Lazy loading / pagination of children**, **virtualization** — the scale story.
- **Principle vocabulary:** normalization, single source of truth, open/closed, SRP, DRY, dependency inversion, separation of concerns, KISS/YAGNI.

## 🎯 How it's asked in interviews

**Same problem, different wording:**

- "Design the state for a file explorer / Google Drive / Dropbox."
- "Build a folder tree component with add, rename, delete." (A UI prompt, but the data model decides whether you pass.)
- "Model a nested comments thread / org chart / category tree / Notion page tree / Jira epics → stories → subtasks."
- "Design a Redux store for hierarchical data."
- "Implement a VS Code sidebar."

If the data is **a tree the user edits**, it's this problem. Normalize it.

**The follow-up ladder:**

1. "What's the complexity of each operation?" — have the table ready.
2. "How do you move a folder? What if it has 10,000 files?" — O(depth + k), descendants untouched.
3. "What stops me moving a folder into its own child?" — cycle check by walking up from the target.
4. "How do you avoid re-rendering the whole tree on a rename?" — immutable updates + structural sharing + per-row selectors, stores in Context rather than state.
5. "How would you add tags / permissions?" — feature slices keyed by id; inheritance by walking up.
6. "The org has 2 million files. Now what?" — lazy-load per folder, server-side search, virtualization, optimistic writes.
7. "Two people edit the same folder at once." — server is the source of truth; push updates (WebSocket/SSE) apply as the same pure ops; conflict = server wins, with a toast. Mention versions/ETags for "reject if stale".
8. "How would you implement undo?" — keep previous snapshots (cheap, thanks to structural sharing) or store inverse commands.

**Traps & gotchas:**

- **Using the path as the id.** Rename and move then cascade through every descendant. Ids must be stable.
- **Only storing `children` (no `parentId`).** Breadcrumbs and cycle checks then need a full-tree search.
- **Only storing `parentId` (no `childIds`).** Listing a folder becomes an O(n) scan every render.
- **Deleting a folder but not its descendants.** Orphans stay in the map, search still returns them, memory leaks.
- **Forgetting to clean feature tables on delete.** Labels pointing at ids that no longer exist.
- **Mutating in place** (`node.name = x`). The reference doesn't change, so memoized rows don't update. A classic "why isn't my UI updating?" bug.
- **Selectors that build new arrays/objects.** Infinite re-render warnings with `useSyncExternalStore`, or wasted renders with `memo`.
- **Putting the whole tree in Context state.** Every consumer re-renders on every change.
- **Case sensitivity.** `Report.pdf` vs `report.pdf` — decide and say it. Windows/macOS treat them as the same by default; Google Drive actually allows duplicate names because identity is the id. Ask which behavior they want.
- **Recursion depth.** A recursive subtree walk on a pathologically deep tree can overflow the stack. The code uses an explicit stack.

**Model answer sketch (how a strong candidate runs the 45 minutes):**

1. **Clarify (2 min):** "Is the whole org loaded, or per folder? Unique names per folder? Ordering? Do permissions inherit?" State assumptions.
2. **Model (5 min):** draw `nodes: Record<id, Node>` with `parentId` and `childIds`, a discriminated union for kinds, `orgId` on the tree, `createdBy` as audit only. Say *why* normalized over nested, and why ids over paths.
3. **Complexity table (2 min):** read O(1), path O(d), create/rename O(k), move O(d + k), delete O(subtree), search O(n).
4. **Code the core (20 min):** types → `Result` → reads (`getPath`, `isInSubtree`, `collectSubtree`) → writes (create, rename, move, delete) with guard clauses and shared helpers → search with predicate filters. Narrate the invariants as you add each guard.
5. **Wire to React (5 min):** external store + `useSyncExternalStore`, per-row selectors, stores (not state) in Context.
6. **Extensibility (5 min):** metadata bag → labels slice with cascade prune → permissions sketch with inheritance.
7. **Scale (3 min):** lazy loading, server search, virtualization, optimistic updates with rollback.

## 🔗 Linked concepts

- [Debounced Input](005-debounce-input.md) — the classic way to stop search-as-you-type from hammering a *server* search. For the client-side scan here, `useDeferredValue` keeps typing responsive instead.
- [useRef & Refs](003-useref-and-refs.md) — relevant if the follow-up is "focus the new folder's name input after create" or keyboard navigation between tree rows.
- [Controlled vs Uncontrolled Components](002-controlled-vs-uncontrolled-components.md) — the rename and create forms are controlled inputs; `key={node.id}` resets the rename draft when the selection changes.

## 🧠 Rapid-fire Q&A

**Q: Why normalize instead of storing a nested tree?**
A: Because every operation except "render top-down" starts with finding a node. A flat map makes that O(1), keeps each node in one place, and lets an immutable update replace just the changed nodes instead of cloning a whole path.

**Q: Why store both `parentId` and `childIds`? Isn't that duplication?**
A: It's a deliberate two-way index. `childIds` makes listing a folder O(k), `parentId` makes paths and cycle checks O(depth). The cost is keeping them consistent, which is why only a few write functions touch them, all going through `writeNodes`.

**Q: What does moving a folder with 10,000 files cost?**
A: O(depth + k): a walk up for the cycle check, then updating one `parentId` and two `childIds` lists. Descendants reference their parent by id, so none of them change.

**Q: How do you detect a cycle on move?**
A: Walk up from the target folder via `parentId`. If you reach the folder being moved, the target is inside it, so reject. That's O(depth), no subtree scan.

**Q: Why does delete cost O(subtree) when everything else is cheap?**
A: Every descendant has to leave the index, or they become orphans that search still finds and memory never frees. The alternative is soft delete: set `trashedAt` in O(1) and filter it out, then purge on the server.

**Q: How does a rename avoid re-rendering the whole tree?**
A: The update creates new objects only for the renamed node and its parent. Every row subscribes to `nodes[id]` via a selector, so rows whose node reference didn't change skip rendering.

**Q: Why an external store with `useSyncExternalStore` instead of `useReducer` + Context?**
A: Context re-renders all consumers when its value changes, so a tree in Context re-renders everything. Here Context holds the stable store object and each component subscribes to its own slice. Commands also return `Result`s synchronously, and the core is testable without React.

**Q: Why return `Result` instead of throwing?**
A: Failures like "name taken" are expected, not exceptional. As values, they're typed, the form can show them directly, and a failed op is simply never committed, so state can't end up half-updated.

**Q: Why are labels a separate slice instead of `node.labels`?**
A: Open/closed: the feature is added without editing the tree code or node type. It also keeps tagging from changing the node's reference, and the same template works for permissions and comments. The price is cascading deletes, handled with `removedIds`.

**Q: Design question — why is `childIds` sorted on write instead of sorting in the component?**
A: Renders happen far more often than renames, so pay the sort on the rare side. It also means selectors return the stored array, which is a stable reference. If users can switch sort order, you'd derive the sorted list with `useMemo` instead.

**Q: How would permissions work?**
A: An ACL slice `nodeId → { principal → role }`. The effective role is the closest explicit grant, found by walking up the parent chain (O(depth)). The client uses it only to hide or disable actions; the server enforces it.

**Q: The org has millions of files. What changes?**
A: Load children per folder on expand with a loading status, move search to the server, virtualize long lists, and make writes optimistic with client-generated ids and rollback to the previous snapshot on failure.

## ✅ Cheat lines

- **Flat map by id + `parentId` up + `childIds` down.** Lookup O(1), path O(depth), move doesn't touch descendants.
- **Ids are identity, paths are derived.** Never key anything by path.
- **Pure ops, immutable writes, structural sharing.** Only touched nodes get new references, so only their rows re-render.
- **Features are tables keyed by node id.** Labels, permissions, comments plug in without touching the tree, and delete cascades via `removedIds`.
- **Guard the invariants:** unique sibling names, no cycles, root protected, no orphans. Every write returns a `Result`.
