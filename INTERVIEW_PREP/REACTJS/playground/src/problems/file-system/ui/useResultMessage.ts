import { useState } from "react";
import type { Result } from "../core/result";

/** Turns a store command's Result into an inline error message. One place, reused by every form. */
export function useResultMessage() {
  const [error, setError] = useState<string | null>(null);

  function report<T>(result: Result<T>): result is { ok: true; value: T } {
    setError(result.ok ? null : result.error.message);
    return result.ok;
  }

  return { error, report };
}
