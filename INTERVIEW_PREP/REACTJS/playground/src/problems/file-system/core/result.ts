/**
 * Errors as values. Every write returns a Result instead of throwing, so the UI
 * can show "name already exists" without try/catch, and a failed op can never
 * leave the store half-updated (it simply isn't committed).
 */

export type FsErrorCode =
  | "NOT_FOUND"
  | "NOT_A_FOLDER"
  | "INVALID_NAME"
  | "NAME_TAKEN"
  | "CYCLE"
  | "ROOT_IS_PROTECTED";

export interface FsError {
  readonly code: FsErrorCode; // stable, machine-readable — the UI can map it to i18n text
  readonly message: string;
}

export type Result<T> = { ok: true; value: T } | { ok: false; error: FsError };

export const ok = <T>(value: T): Result<T> => ({ ok: true, value });

export const fail = (code: FsErrorCode, message: string): Result<never> => ({
  ok: false,
  error: { code, message },
});
