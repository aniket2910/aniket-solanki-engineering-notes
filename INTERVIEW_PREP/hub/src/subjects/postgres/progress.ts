import { createProgress } from "../../lib/progress.ts";

export type { ProblemProgress } from "../../lib/progress.ts";
export { usePersistentFlag } from "../../lib/progress.ts";

export const { useProgress, useProblemProgress, resetProgress, loadDraft, saveDraft } = createProgress("sql50");
