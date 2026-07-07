/*
Build a reusable TypeScript library — not a service, no HTTP, no database — that an application team could import to run background tasks reliably.

Functional requirements:

submit(task) — callers submit tasks. A task has an id, a payload, and an async handler function that may succeed, throw, or hang.
Bounded concurrency — at most N tasks execute at once (configurable). Everything else waits in the queue.
Retries with pluggable backoff — a failed task retries up to R times. Backoff strategy must be swappable (fixed delay vs. exponential) without modifying the queue code.
Task timeout — a task running longer than T ms is treated as failed. Think carefully about what "treated as failed" means when the underlying promise never settles.
Dead-letter queue — a task that exhausts retries lands in a DLQ with its failure history (attempt count, errors, timestamps). Expose a way to inspect and replay DLQ entries.
Graceful shutdown — shutdown() stops accepting new tasks, lets in-flight tasks drain, and resolves when the queue is empty or a drain-timeout passes.
Non-functional expectations (this is where SDE-2 vs SDE-1 shows):

Clean separation of concerns — if I find one god class doing queueing, retrying, and timing out, that's my first code-review comment.
Duplicate submission: same task id submitted twice while the first is still queued or running — decide the behavior and defend it.
Node is single-threaded, but this problem is full of concurrency: interleaved async completions, retry timers firing during shutdown, a replay racing a drain. I will probe these.
Tests: you don't have to write them all, but I'll ask how you'd test the timeout path — so design for it.
Format & rules:

Timebox: ~75 minutes in real life. Take the time you need here.
Clarifying questions first if you have them — that's evaluated too. Candidates who start typing immediately usually build the wrong thing.
Write real code, not pseudocode. Since we're doing this in your notes repo: put it in MOCK_INTERVIEWS/round-2-code/ (any file layout you like — the layout is also a signal), or paste it in chat if you prefer. Tell me when you're done or if you want to talk through a decision mid-way — thinking out loud is welcome here.
*/
export interface Task {
  id: string;
  payload: any;
  handler: (payload: any, signal: AbortSignal) => Promise<any>;
}

export interface DLQEntry {
  task: Task;
  error: Error;
  attempts: number;
  failedAt: number;
}

export class TaskQueue {
  private queue: (() => Promise<void>)[] = [];
  private activeIds = new Set<string>(); // Prevent duplicates
  private activeCount = 0;
  private dlq: DLQEntry[] = [];
  private isShuttingDown = false;
  private onDrained: (() => void) | null = null;

  constructor(
    private concurrency: number,
    private maxRetries: number,
    private getBackoffDelay: (attempt: number) => number,
    private timeoutMs = 5000 // Default 5s timeout
  ) {
    if (concurrency <= 0) {
      throw new Error('Concurrency must be at least 1');
    }
  }

  submit(task: Task): Promise<any> {
    if (this.isShuttingDown) {
      return Promise.reject(new Error('Queue is shutting down'));
    }
    if (this.activeIds.has(task.id)) {
      return Promise.reject(new Error(`Duplicate task ID: ${task.id}`));
    }

    this.activeIds.add(task.id);

    return new Promise((resolve, reject) => {
      // Wrapper to handle execution, retries, and timeout
      const executeTask = async () => {
        let attempts = 0;
        const controller = new AbortController();

        while (attempts <= this.maxRetries) {
          attempts++;
          let timeoutTimer: NodeJS.Timeout | null = null;
          
          try {
            // Task timeout race
            const timeoutPromise = new Promise<never>((_, rej) => {
              timeoutTimer = setTimeout(() => {
                controller.abort();
                rej(new Error(`Task timed out after ${this.timeoutMs}ms`));
              }, this.timeoutMs);
            });
            // Ensure timeout rejection is flagged as handled
            timeoutPromise.catch(() => {});

            const handlerPromise = task.handler(task.payload, controller.signal);
            
            const result = await Promise.race([handlerPromise, timeoutPromise]);
            if (timeoutTimer) clearTimeout(timeoutTimer);

            this.activeIds.delete(task.id);
            resolve(result);
            return;
          } catch (err: any) {
            if (timeoutTimer) clearTimeout(timeoutTimer);

            const willRetry = attempts <= this.maxRetries && !this.isShuttingDown;
            if (willRetry) {
              const delay = this.getBackoffDelay(attempts);
              await new Promise((res) => setTimeout(res, delay));
            } else {
              // DLQ case
              const error = err instanceof Error ? err : new Error(String(err));
              this.dlq.push({ task, error, attempts, failedAt: Date.now() });
              this.activeIds.delete(task.id);
              reject(error);
              return;
            }
          }
        }
      };

      // Push task wrapper to queue
      this.queue.push(async () => {
        this.activeCount++;
        try {
          await executeTask();
        } finally {
          this.activeCount--;
          this.processNext();
        }
      });

      this.processNext();
    });
  }

  private processNext() {
    if (this.activeCount >= this.concurrency) return;
    if (this.queue.length === 0) {
      if (this.activeCount === 0 && this.onDrained) {
        this.onDrained();
      }
      return;
    }

    const nextRun = this.queue.shift()!;
    nextRun();
  }

  shutdown(drainTimeoutMs: number): Promise<void> {
    this.isShuttingDown = true;

    if (this.activeCount === 0 && this.queue.length === 0) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const shutdownTimer = setTimeout(() => {
        reject(new Error('Shutdown timed out before all tasks drained'));
      }, drainTimeoutMs);

      this.onDrained = () => {
        clearTimeout(shutdownTimer);
        resolve();
      };
    });
  }

  getDLQ(): DLQEntry[] {
    return this.dlq;
  }

  replay(taskId: string): Promise<any> {
    if (this.isShuttingDown) {
      return Promise.reject(new Error('Queue is shutting down'));
    }
    const idx = this.dlq.findIndex((e) => e.task.id === taskId);
    if (idx === -1) {
      return Promise.reject(new Error(`Task not found in DLQ: ${taskId}`));
    }

    const [entry] = this.dlq.splice(idx, 1);
    return this.submit(entry.task);
  }

  // State inspection
  getActiveCount(): number {
    return this.activeCount;
  }

  getQueueLength(): number {
    return this.queue.length;
  }
}
