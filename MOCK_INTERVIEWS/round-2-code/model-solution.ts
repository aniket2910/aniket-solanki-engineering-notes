/**
 * MODEL SOLUTION — Round 2 (Machine Coding): In-Memory Task Queue Library
 *
 * Layout note: in a real interview submission, split this into files —
 *   types.ts / backoff.ts / attempt-runner.ts / task-queue.ts / demo.ts
 * It is kept as one file here for easy side-by-side reading, with section banners.
 *
 * The three design decisions that carry this solution (say these OUT LOUD in the interview):
 *
 * 1. A failed task RELEASES its concurrency slot during backoff. Retry waits happen on a
 *    scheduled timer, and the task re-enters the queue when the timer fires. Sleeping inside
 *    the worker slot means a handful of failing tasks starves every healthy task behind them.
 *
 * 2. A fresh AbortController PER ATTEMPT. An aborted signal can never be un-aborted, so a
 *    controller created per task poisons every retry after the first timeout.
 *
 * 3. The library cannot kill a running promise. On timeout it stops WAITING (the race) and
 *    it ASKS the handler to stop (the abort signal) — but a handler that ignores the signal
 *    keeps running as a zombie. Name this honestly instead of pretending timeout = termination.
 */

// ============================== types ==============================

export interface Task<P = unknown, R = unknown> {
  id: string;
  payload: P;
  handler: (payload: P, signal: AbortSignal) => Promise<R>;
}

export interface FailureRecord {
  attempt: number; // 1-based
  error: string;   // message only, so the DLQ stays serializable/loggable
  at: number;      // epoch ms
}

export interface DLQEntry<P = unknown> {
  task: Task<P, unknown>;
  failures: FailureRecord[]; // FULL history — every attempt, not just the last error
  deadAt: number;
}

export class TimeoutError extends Error {
  constructor(taskId: string, ms: number) {
    super(`task "${taskId}" timed out after ${ms}ms`);
    this.name = 'TimeoutError';
  }
}

// ==================== pluggable backoff (strategy) ====================
// The queue depends on this interface only — swapping fixed for exponential
// (or jittered, or per-error-type) never touches queue code.

export interface BackoffStrategy {
  /** Delay before the retry that follows failed attempt `attempt` (1-based). */
  delayMs(attempt: number): number;
}

export class FixedBackoff implements BackoffStrategy {
  constructor(private readonly ms: number) {}
  delayMs(): number {
    return this.ms;
  }
}

export class ExponentialBackoff implements BackoffStrategy {
  constructor(private readonly baseMs: number, private readonly capMs = 30_000) {}
  delayMs(attempt: number): number {
    return Math.min(this.capMs, this.baseMs * 2 ** (attempt - 1));
  }
}

// ==================== attempt runner (one attempt, one timeout, one signal) ====================

class AttemptRunner {
  constructor(private readonly timeoutMs: number) {}

  async run<P, R>(task: Task<P, R>): Promise<R> {
    // Fresh controller per attempt — an aborted signal stays aborted forever,
    // so reusing one across attempts hands every retry a dead signal.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    const timeout = new Promise<never>((_, reject) => {
      controller.signal.addEventListener(
        'abort',
        () => reject(new TimeoutError(task.id, this.timeoutMs)),
        { once: true }
      );
    });

    const handlerPromise = task.handler(task.payload, controller.signal);
    // If the timeout wins the race, the handler may still reject later ("zombie").
    // That late rejection must not crash the process with an unhandled rejection.
    handlerPromise.catch(() => {});

    try {
      return await Promise.race([handlerPromise, timeout]);
    } finally {
      clearTimeout(timer);
    }
  }
}

// ============================== task queue ==============================

type TaskState = 'queued' | 'running' | 'retry-scheduled';

interface InternalItem<P = unknown, R = unknown> {
  task: Task<P, R>;
  attempt: number; // attempts made so far
  failures: FailureRecord[];
  resolve: (r: R) => void;
  reject: (e: Error) => void;
}

export interface TaskQueueOptions {
  concurrency: number; // N
  maxRetries: number;  // R — total attempts = 1 + R
  timeoutMs: number;   // T
  backoff: BackoffStrategy;
}

export class TaskQueue {
  private readonly waiting: InternalItem[] = [];
  private readonly pendingRetries = new Map<string, { timer: NodeJS.Timeout; item: InternalItem }>();
  private readonly states = new Map<string, TaskState>();
  private readonly dlq = new Map<string, DLQEntry>();
  private readonly attemptRunner: AttemptRunner;
  private runningCount = 0;
  private shuttingDown = false;
  private drainWaiters: (() => void)[] = [];

  constructor(private readonly opts: TaskQueueOptions) {
    if (opts.concurrency < 1) throw new Error('concurrency must be >= 1');
    if (opts.maxRetries < 0) throw new Error('maxRetries must be >= 0');
    this.attemptRunner = new AttemptRunner(opts.timeoutMs);
  }

  /**
   * Duplicate policy (decided, documented, defended):
   * - An id that is queued, running, or waiting on a retry is REJECTED. The id is the
   *   caller's idempotency key; silently dropping or replacing would hide caller bugs.
   * - An id in the DLQ MAY be resubmitted: the DLQ entry is a historical record of a dead
   *   run, not a live task. replay() removes the record before resubmitting, so a live
   *   task and its DLQ ghost can never both be "active".
   */
  submit<P, R>(task: Task<P, R>): Promise<R> {
    if (this.shuttingDown) return Promise.reject(new Error('queue is shutting down'));
    const state = this.states.get(task.id);
    if (state) return Promise.reject(new Error(`duplicate task id "${task.id}" (currently ${state})`));

    return new Promise<R>((resolve, reject) => {
      this.enqueue({
        task: task as Task,
        attempt: 0,
        failures: [],
        resolve: resolve as (r: unknown) => void,
        reject,
      });
    });
  }

  getDeadLetters(): DLQEntry[] {
    // Defensive copies — handing out the internal array lets callers corrupt replay()
    return [...this.dlq.values()].map((e) => ({ ...e, failures: [...e.failures] }));
  }

  /** Replayed tasks re-enter through submit(): fresh attempt budget, same dedup rules. */
  replay(taskId: string): Promise<unknown> {
    const entry = this.dlq.get(taskId);
    if (!entry) return Promise.reject(new Error(`task "${taskId}" is not in the DLQ`));
    if (this.shuttingDown) return Promise.reject(new Error('queue is shutting down'));
    this.dlq.delete(taskId);
    return this.submit(entry.task);
  }

  /**
   * Drain semantics (decided, documented, defended):
   * - Intake closes immediately; already-queued tasks still run to completion.
   * - Tasks sleeping on a retry timer are CANCELLED and dead-lettered. Blocking a deploy
   *   for a 30s exponential backoff is worse than dead-lettering; the DLQ + replay() is
   *   exactly the recovery path for work interrupted by shutdown.
   * - Tasks that fail while draining are dead-lettered rather than retried, so the drain
   *   always terminates.
   */
  async shutdown(drainTimeoutMs?: number): Promise<void> {
    this.shuttingDown = true;
    for (const { timer, item } of this.pendingRetries.values()) {
      clearTimeout(timer);
      this.moveToDLQ(item);
    }
    this.pendingRetries.clear();
    return this.whenDrained(drainTimeoutMs);
  }

  stats() {
    return {
      running: this.runningCount,
      waiting: this.waiting.length,
      retryScheduled: this.pendingRetries.size,
      dead: this.dlq.size,
    };
  }

  // ------------------------------ internals ------------------------------

  private enqueue(item: InternalItem): void {
    this.states.set(item.task.id, 'queued');
    this.waiting.push(item);
    this.pump();
  }

  /** Fill free slots. Called on submit, on completion, and when a retry timer fires. */
  private pump(): void {
    while (this.runningCount < this.opts.concurrency && this.waiting.length > 0) {
      const item = this.waiting.shift()!;
      void this.runItem(item);
    }
    this.checkDrained();
  }

  private async runItem(item: InternalItem): Promise<void> {
    this.runningCount++;
    this.states.set(item.task.id, 'running');
    item.attempt++;
    try {
      const result = await this.attemptRunner.run(item.task);
      this.states.delete(item.task.id);
      item.resolve(result);
    } catch (err) {
      this.onFailure(item, err instanceof Error ? err : new Error(String(err)));
    } finally {
      // Slot is released the moment the attempt settles — backoff NEVER occupies a slot.
      this.runningCount--;
      this.pump();
    }
  }

  private onFailure(item: InternalItem, error: Error): void {
    item.failures.push({ attempt: item.attempt, error: error.message, at: Date.now() });

    const retriesLeft = item.attempt <= this.opts.maxRetries;
    if (!retriesLeft || this.shuttingDown) {
      this.moveToDLQ(item);
      return;
    }

    this.states.set(item.task.id, 'retry-scheduled');
    const delay = this.opts.backoff.delayMs(item.attempt);
    const timer = setTimeout(() => {
      this.pendingRetries.delete(item.task.id);
      this.enqueue(item); // re-enters the queue; competes fairly with new work
    }, delay);
    this.pendingRetries.set(item.task.id, { timer, item });
  }

  private moveToDLQ(item: InternalItem): void {
    this.states.delete(item.task.id);
    this.dlq.set(item.task.id, {
      task: item.task,
      failures: [...item.failures],
      deadAt: Date.now(),
    });
    item.reject(
      new Error(
        `task "${item.task.id}" dead-lettered after ${item.attempt} attempt(s): ` +
          `${item.failures[item.failures.length - 1]?.error}`
      )
    );
    this.checkDrained();
  }

  private isDrained(): boolean {
    return this.runningCount === 0 && this.waiting.length === 0 && this.pendingRetries.size === 0;
  }

  private checkDrained(): void {
    if (!this.shuttingDown || !this.isDrained()) return;
    const waiters = this.drainWaiters;
    this.drainWaiters = [];
    for (const w of waiters) w();
  }

  private whenDrained(timeoutMs?: number): Promise<void> {
    if (this.isDrained()) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
      let timer: NodeJS.Timeout | undefined;
      const waiter = () => {
        if (timer) clearTimeout(timer);
        resolve();
      };
      this.drainWaiters.push(waiter);
      if (timeoutMs !== undefined) {
        timer = setTimeout(() => {
          this.drainWaiters = this.drainWaiters.filter((w) => w !== waiter);
          reject(new Error(`drain timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      }
    });
  }
}

/**
 * HOW I WOULD TEST THE TIMEOUT PATH (the interviewer will ask):
 *
 * 1. Deterministic unit test with fake timers (jest.useFakeTimers / sinon):
 *    - submit a handler that returns `new Promise(() => {})` (never settles)
 *    - advanceTimersByTime(timeoutMs)
 *    - expect the submit() promise to reject with TimeoutError, and expect the
 *      handler's received signal to have fired 'abort'
 * 2. Signal freshness: handler that hangs on attempt 1 and records `signal.aborted`
 *    at the start of every attempt — assert it is false on EVERY attempt (this exact
 *    test catches the reused-AbortController bug).
 * 3. Zombie safety: handler that rejects AFTER the timeout already won the race —
 *    assert the process emits no unhandledRejection.
 * 4. Fairness: concurrency 1, one always-failing task + one instant task — assert the
 *    instant task completes before the failing task exhausts its backoff schedule
 *    (this exact test catches the slot-holding-backoff bug).
 */

// ============================== demo ==============================
// Run: RUN_DEMO=1 npx tsx model-solution.ts

async function demo() {
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  const at = () => `${Date.now() - t0}ms`;

  const queue = new TaskQueue({
    concurrency: 2,
    maxRetries: 2,
    timeoutMs: 300,
    backoff: new FixedBackoff(400),
  });

  // 1. Failing task: backoff must NOT block the healthy task behind it
  let flakyAttempts = 0;
  queue
    .submit({
      id: 'flaky',
      payload: null,
      handler: async () => {
        flakyAttempts++;
        if (flakyAttempts < 3) throw new Error(`boom #${flakyAttempts}`);
        return 'recovered on attempt 3';
      },
    })
    .then((r) => console.log(`[${at()}] flaky -> ${r}`));

  queue
    .submit({ id: 'instant', payload: null, handler: async () => 'done' })
    .then((r) => console.log(`[${at()}] instant -> ${r} (not starved by flaky's backoff)`));

  // 2. Hanging task: fresh signal every attempt, full failure history in DLQ
  queue
    .submit({
      id: 'hanger',
      payload: null,
      handler: (_p, signal) => {
        console.log(`[${at()}] hanger attempt starts, signal.aborted=${signal.aborted}`);
        return new Promise(() => {}); // never settles -> timeout every attempt
      },
    })
    .catch((e: Error) => console.log(`[${at()}] hanger -> ${e.message}`));

  // 3. Duplicate id while live -> rejected
  await sleep(50);
  await queue
    .submit({ id: 'flaky', payload: null, handler: async () => 'x' })
    .catch((e: Error) => console.log(`[${at()}] duplicate flaky -> ${e.message}`));

  await sleep(2000);
  console.log(`[${at()}] DLQ:`, JSON.stringify(queue.getDeadLetters(), null, 2));

  // 4. Replay from DLQ (fresh budget) — this time the handler succeeds instantly
  const dead = queue.getDeadLetters()[0];
  if (dead) {
    dead.task.handler = async () => 'replayed fine';
    await queue.replay(dead.task.id).then((r) => console.log(`[${at()}] replay -> ${r}`));
  }

  // 5. Graceful shutdown
  await queue.shutdown(1000);
  console.log(`[${at()}] drained, stats:`, queue.stats());
}

if (process.env.RUN_DEMO) void demo();
