// The DSA judge: turns note test cases into real calls and grades the answers.
//
// Pure functions only, so the same file runs in the browser's Web Worker and in the
// Node check script. LeetCode's input conventions are rebuilt here: a linked list is
// written as an array, a tree as its level-order array with nulls, a design problem as
// two parallel arrays of method names and arguments.

export type ArgKind = "value" | "list" | "tree" | "graph";

/** Turns the parsed test arguments into the real call arguments. */
export type Prepare =
  | "args" // each arg converted by `args[i]`
  | "cycleList" // [values, pos] → head of a list whose tail links back to index pos
  | "intersection" // [intersectVal, listA, listB, skipA, skipB] → [headA, headB]
  | "treeNodes" // [rootArray, pVal, qVal] → [root, nodeP, nodeQ]
  | "spread" // variadic: sum(1, 2, 3)
  | "guessGame" // [n, pick] → [n], with LeetCode's guess(num) API answering for `pick`
  | "badVersion"; // [n, bad] → [n], with isBadVersion(v) true from `bad` on

export type Returns =
  | "value"
  | "list"
  | "tree"
  | "nodeVal" // a node → its val (or null)
  | "nextPointers" // perfect-tree next pointers → [1,#,2,3,#]
  | "graph" // clone graph: adjacency list, checked to be a real copy
  | { inplace: number } // void function: grade the mutated argument
  | { inplacePrefix: number }; // returns k: grade the first k items of the argument

export type Compare =
  | "exact"
  | "unordered" // any order of the outer array
  | "unorderedDeep" // any order inside each inner array too
  | "anyOf" // expected is a list of acceptable answers
  | "topoOrder" // any valid topological order of (n, adj)
  | "reorganized"; // any rearrangement with no two equal neighbours ("" when impossible)

export type Test = { args: unknown[]; expected: unknown; label?: string };

export type JudgeSpec = {
  kind?: "function" | "class";
  entry: string;
  prepare?: Prepare;
  args?: readonly ArgKind[];
  returns?: Returns;
  compare?: Compare;
  /** Tests that replace the ones parsed from the note (for prose-only or design-style tests). */
  tests?: Test[];
};

export type TestResult = {
  label: string;
  input: string;
  expected: string;
  got: string;
  pass: boolean;
  error?: string;
  logs: string[];
  ms: number;
};

// ───────────────────────────── data structures ─────────────────────────────

export class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  next: TreeNode | null = null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

/** LeetCode's graph node (Clone Graph) and next-pointer node share this shape. */
export class GraphNode {
  val: number;
  neighbors: GraphNode[];
  constructor(val?: number, neighbors?: GraphNode[]) {
    this.val = val === undefined ? 0 : val;
    this.neighbors = neighbors === undefined ? [] : neighbors;
  }
}

// LeetCode's "hidden API" problems call a function they don't define. The harness
// provides it, answering for whatever the current test case set.
const hidden = { pick: 0, bad: 0, calls: 0 };

function guess(num: number): number {
  hidden.calls++;
  return num > hidden.pick ? -1 : num < hidden.pick ? 1 : 0;
}

function isBadVersion(version: number): boolean {
  hidden.calls++;
  return version >= hidden.bad;
}

export const harnessGlobals = { ListNode, TreeNode, _Node: GraphNode, Node: GraphNode, guess, isBadVersion };

type AnyNode = { val: unknown; next?: AnyNode | null; left?: AnyNode | null; right?: AnyNode | null };

export function toList(values: unknown): ListNode | null {
  if (!Array.isArray(values)) return null;
  const dummy = new ListNode();
  let tail = dummy;
  for (const v of values) tail = tail.next = new ListNode(v as number);
  return dummy.next;
}

export function fromList(head: AnyNode | null | undefined): unknown[] {
  const out: unknown[] = [];
  const seen = new Set<AnyNode>();
  for (let n = head; n; n = n.next) {
    if (seen.has(n)) throw new Error("The returned list has a cycle.");
    seen.add(n);
    out.push(n.val);
  }
  return out;
}

export function toTree(values: unknown): TreeNode | null {
  if (!Array.isArray(values) || !values.length || values[0] === null) return null;
  const root = new TreeNode(values[0] as number);
  const queue = [root];
  let i = 1;
  while (queue.length && i < values.length) {
    const node = queue.shift()!;
    if (i < values.length && values[i] !== null) queue.push((node.left = new TreeNode(values[i] as number)));
    i++;
    if (i < values.length && values[i] !== null) queue.push((node.right = new TreeNode(values[i] as number)));
    i++;
  }
  return root;
}

export function fromTree(root: AnyNode | null | undefined): unknown[] {
  const out: unknown[] = [];
  const queue: (AnyNode | null | undefined)[] = [root];
  while (queue.length) {
    const n = queue.shift();
    if (!n) {
      out.push(null);
      continue;
    }
    out.push(n.val);
    queue.push(n.left ?? null, n.right ?? null);
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

function findInTree(root: AnyNode | null, val: unknown): AnyNode | null {
  if (!root) return null;
  if (root.val === val) return root;
  return findInTree(root.left ?? null, val) ?? findInTree(root.right ?? null, val);
}

/** [[2,4],[1,3],[2,4],[1,3]] (1-indexed neighbours) → node 1. */
function toGraph(adj: unknown): GraphNode | null {
  if (!Array.isArray(adj) || !adj.length) return null;
  const nodes = adj.map((_, i) => new GraphNode(i + 1));
  adj.forEach((ns: number[], i) => (nodes[i].neighbors = ns.map((n) => nodes[n - 1])));
  return nodes[0];
}

function fromGraph(start: GraphNode | null, original: GraphNode | null): unknown {
  if (!start) return [];
  const byVal = new Map<number, GraphNode>();
  const stack = [start];
  const originals = new Set<GraphNode>();
  for (const s = [original]; s.length; ) {
    const n = s.pop();
    if (!n || originals.has(n)) continue;
    originals.add(n);
    s.push(...n.neighbors);
  }
  while (stack.length) {
    const n = stack.pop()!;
    if (byVal.has(n.val)) continue;
    if (originals.has(n)) throw new Error(`Node ${n.val} is the original node, not a copy.`);
    byVal.set(n.val, n);
    stack.push(...n.neighbors);
  }
  return [...byVal.keys()].sort((a, b) => a - b).map((v) => byVal.get(v)!.neighbors.map((n) => n.val));
}

function nextPointers(root: AnyNode | null): unknown[] {
  const out: unknown[] = [];
  for (let level = root; level; level = level.left ?? null) {
    for (let n: AnyNode | null | undefined = level; n; n = n.next) out.push(n.val);
    out.push("#");
  }
  return out;
}

// ───────────────────────────── running ─────────────────────────────

const convert = (kind: ArgKind | undefined, v: unknown) =>
  kind === "list" ? toList(v) : kind === "tree" ? toTree(v) : kind === "graph" ? toGraph(v) : v;

function prepareArgs(spec: JudgeSpec, raw: unknown[]): unknown[] {
  const args = structuredClone(raw);
  switch (spec.prepare) {
    case "cycleList": {
      const [values, pos] = args as [number[], number];
      const head = toList(values);
      if (head && pos >= 0) {
        let tail = head;
        let target: ListNode | null = null;
        for (let i = 0, n: ListNode | null = head; n; n = n.next, i++) {
          if (i === pos) target = n;
          tail = n;
        }
        tail.next = target;
      }
      return [head];
    }
    case "intersection": {
      const [, listA, listB, skipA, skipB] = args as [number, number[], number[], number, number];
      const headA = toList(listA.slice(0, skipA));
      const headB = toList(listB.slice(0, skipB));
      const shared = toList(listA.slice(skipA));
      const tailOf = (h: ListNode | null) => {
        while (h && h.next) h = h.next;
        return h;
      };
      if (headA) tailOf(headA)!.next = shared;
      if (headB) tailOf(headB)!.next = shared;
      return [headA ?? shared, headB ?? shared];
    }
    case "treeNodes": {
      const [rootArr, p, q] = args;
      const root = toTree(rootArr);
      return [root, findInTree(root, p), findInTree(root, q)];
    }
    case "spread":
      return args;
    case "guessGame":
      hidden.pick = args[1] as number;
      return [args[0]];
    case "badVersion":
      hidden.bad = args[1] as number;
      return [args[0]];
    default:
      return args.map((v, i) => convert(spec.args?.[i], v));
  }
}

function shapeResult(spec: JudgeSpec, result: unknown, callArgs: unknown[]): unknown {
  const r = spec.returns ?? "value";
  if (r === "list") return fromList(result as AnyNode);
  if (r === "tree") return fromTree(result as AnyNode);
  if (r === "nodeVal") return result == null ? null : (result as AnyNode).val;
  if (r === "nextPointers") return nextPointers(result as AnyNode);
  if (r === "graph") return fromGraph(result as GraphNode, callArgs[0] as GraphNode);
  if (typeof r === "object" && "inplace" in r) return callArgs[r.inplace];
  if (typeof r === "object" && "inplacePrefix" in r) {
    const k = result as number;
    return { k, prefix: (callArgs[r.inplacePrefix] as unknown[]).slice(0, k) };
  }
  return result === undefined ? null : result;
}

/** Runs a design problem: ops = ["MinStack","push",…], params = [[],[-2],…]. */
function runDesign(Cls: new (...a: unknown[]) => Record<string, (...a: unknown[]) => unknown>, ops: string[], params: unknown[][]) {
  const out: unknown[] = [];
  let obj: Record<string, (...a: unknown[]) => unknown> | null = null;
  ops.forEach((op, i) => {
    if (i === 0) {
      obj = new Cls(...(params[0] ?? []));
      out.push(null);
      return;
    }
    if (typeof obj![op] !== "function") throw new Error(`Your class has no method "${op}".`);
    const v = obj![op](...(params[i] ?? []));
    out.push(v === undefined ? null : v);
  });
  return out;
}

export function runTests(entry: unknown, spec: JudgeSpec, tests: Test[], capture: (logs: string[]) => () => void): TestResult[] {
  return tests.map((t, i) => {
    const logs: string[] = [];
    const release = capture(logs);
    const started = Date.now();
    const base = { label: t.label ?? `Case ${i + 1}`, input: describeInput(spec, t), expected: show(t.expected), logs };
    try {
      let got: unknown;
      if (spec.kind === "class") {
        got = runDesign(entry as never, t.args[0] as string[], t.args[1] as unknown[][]);
      } else {
        const callArgs = prepareArgs(spec, t.args);
        const result = (entry as (...a: unknown[]) => unknown)(...callArgs);
        got = shapeResult(spec, result, callArgs);
      }
      const expected = normaliseExpected(spec, t);
      return { ...base, got: show(got), pass: matches(spec, got, expected, t.args), ms: Date.now() - started };
    } catch (error) {
      return { ...base, got: "", pass: false, error: messageOf(error), ms: Date.now() - started };
    } finally {
      release();
    }
  });
}

function normaliseExpected(spec: JudgeSpec, t: Test): unknown {
  const r = spec.returns;
  if (typeof r === "object" && "inplacePrefix" in r && Array.isArray(t.expected)) {
    const [k, arr] = t.expected as [number, unknown[]];
    return { k, prefix: arr.slice(0, k) };
  }
  return t.expected;
}

// ───────────────────────────── comparing ─────────────────────────────

export function matches(spec: JudgeSpec, got: unknown, expected: unknown, args: unknown[]): boolean {
  const mode = spec.compare ?? "exact";
  if (mode === "anyOf") return (expected as unknown[]).some((e) => deepEqual(got, e));
  if (mode === "unordered") return deepEqual(sortOuter(got), sortOuter(expected));
  if (mode === "unorderedDeep") return deepEqual(sortOuter(sortInner(got)), sortOuter(sortInner(expected)));
  if (mode === "topoOrder") return isTopoOrder(got, args[0] as number, args[1] as number[][]);
  if (mode === "reorganized") return isReorganized(got, args[0] as string, expected as string);
  return deepEqual(got, expected);
}

function sortInner(v: unknown): unknown {
  if (!Array.isArray(v)) return v;
  return v.map((x) => (Array.isArray(x) ? [...x].sort(cmp) : x));
}

function sortOuter(v: unknown): unknown {
  return Array.isArray(v) ? [...v].sort(cmp) : v;
}

function cmp(a: unknown, b: unknown): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  const x = JSON.stringify(a);
  const y = JSON.stringify(b);
  return x < y ? -1 : x > y ? 1 : 0;
}

function isTopoOrder(got: unknown, n: number, adj: number[][]): boolean {
  if (!Array.isArray(got) || got.length !== n || new Set(got).size !== n) return false;
  const pos = new Map(got.map((v, i) => [v, i]));
  return adj.every((ns, u) => ns.every((v) => (pos.get(u) ?? -1) < (pos.get(v) ?? -1)));
}

function isReorganized(got: unknown, input: string, expected: string): boolean {
  if (expected === "") return got === "";
  if (typeof got !== "string" || got.length !== input.length) return false;
  if ([...got].sort().join("") !== [...input].sort().join("")) return false;
  for (let i = 1; i < got.length; i++) if (got[i] === got[i - 1]) return false;
  return true;
}

export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) < 1e-5;
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  return ka.length === kb.length && ka.every((k) => deepEqual((a as never)[k], (b as never)[k]));
}

// ───────────────────────────── display ─────────────────────────────

export function show(v: unknown): string {
  if (v === undefined) return "undefined";
  try {
    return JSON.stringify(v, (_k, x) => (x === Infinity ? "Infinity" : x === -Infinity ? "-Infinity" : x)) ?? String(v);
  } catch {
    return String(v);
  }
}

function describeInput(spec: JudgeSpec, t: Test): string {
  if (spec.kind === "class") {
    const [ops, params] = t.args as [string[], unknown[][]];
    return ops.map((op, i) => `${op}(${(params[i] ?? []).map(show).join(", ")})`).join(" → ");
  }
  return t.args.map(show).join(", ");
}

function messageOf(error: unknown): string {
  return error instanceof Error ? `${error.name}: ${error.message}` : String(error);
}

// ───────────────────────────── loading code ─────────────────────────────

/**
 * Evaluates transpiled JS and returns the entry function/class. The code sits inside
 * a block so a note's own `class ListNode` can shadow the harness one without a clash.
 */
export function loadEntry(js: string, entry: string): unknown {
  const names = Object.keys(harnessGlobals);
  const body = `"use strict";\n{\n${js}\n;return typeof ${entry} !== "undefined" ? ${entry} : undefined;\n}`;
  const factory = new Function(...names, body);
  const value = factory(...names.map((n) => harnessGlobals[n as keyof typeof harnessGlobals]));
  if (value === undefined) throw new Error(`Couldn't find \`${entry}\` in your code. Keep the function/class name as given.`);
  return value;
}
