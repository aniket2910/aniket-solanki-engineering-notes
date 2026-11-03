// TypeScript → JavaScript by stripping the types (sucrase: fast, tiny, no type-check).
// Type errors don't stop a run, the same as pasting TS into a JS judge would not.

import { transform } from "sucrase";

export function transpile(ts: string): string {
  return transform(ts, { transforms: ["typescript"], disableESTransforms: true }).code;
}
