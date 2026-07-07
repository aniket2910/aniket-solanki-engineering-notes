
```markdown
# Round 4: Technical Deep Dive

### Question 1: Node.js Event Loop and Concurrency
**Interviewer:** “Explain how Node.js handles asynchronous I/O with its event loop. What happens if you perform a CPU-intensive task?”  

**Candidate’s Response:**  
“Node.js uses an event loop (via libuv) to manage asynchronous operations. All JavaScript runs on a single main thread. When you initiate an async operation (like reading a file or network call), Node offloads it to the OS or a thread pool. Meanwhile, the event loop keeps running other tasks. When the I/O completes, a callback is queued. The event loop then takes callbacks from phases (timers, pending callbacks, poll, etc.) and executes them one by one. 

This model is great for I/O-bound tasks because the main thread isn’t stuck waiting – it just registers callbacks and moves on. However, for CPU-bound tasks (like heavy computation or loops), the event loop *blocks* while JavaScript runs. That means no other events can be processed until that task finishes. For example, a tight `for` loop will freeze the server. 

To handle CPU-heavy work, we should offload it. Options include: using `worker_threads` (in modern Node) to run code in a separate thread, spawning a child process, or moving the heavy computation into a microservice. Alternatively, breaking the task into asynchronous chunks (e.g. `setImmediate` or `process.nextTick`) so the event loop can process other events in between. But fundamentally, long synchronous JS will block the loop.”  

**Follow-up:** “What about `process.nextTick` and `setImmediate`? When would you use them?”  
**Candidate’s Additional Point:**  
“`process.nextTick()` queues a callback to run *before* the next event loop phase, whereas `setImmediate()` queues it at the end of the current poll phase. We use them to control ordering of async callbacks, but we have to be careful not to starve I/O (e.g. endless nextTicks). They are tools to manage micro-tasks vs check phases, but for heavy jobs I'd still use worker threads.”  

**Interviewer Feedback:**  
Solid explanation. You correctly described the single-threaded event loop and how Node offloads I/O, citing the Node.js docs. You also identified that CPU-bound tasks block the loop and mentioned worker threads, which is key. It might improve your answer to briefly outline what the Node event-loop phases are (timers, poll, check, etc.), but the high-level is fine. Also, you touched on `nextTick` vs `setImmediate`; that's good depth for SDE2. One missing detail: mention that libuv’s thread pool handles some operations like file I/O or crypto (which you did indirectly). Overall, a strong deep-dive answer.  

---

### Question 2: Kafka Partitions and Throughput
**Interviewer:** “Your resume mentions tuning a Kafka pipeline (100 -> 10,000 records/min). How do Kafka partitions affect throughput? How do you decide how many partitions to create?”  

**Candidate’s Response:**  
“Kafka achieves parallelism through partitions: each topic is split, and each partition can be consumed by a different consumer thread or node. From the consumer side, more partitions *usually* means higher throughput because you can have many consumers reading in parallel. However, too many partitions can also add overhead. From the *producer* side, adding partitions can actually slow down throughput. The broker has to do more coordination, and network/disk I/O can become a bottleneck, so write throughput may drop as partitions increase. 

In practice, a rule of thumb is to start with about 1-2 partitions per CPU core per broker. You can adjust that based on observed lag. For example, in our 6-broker cluster, we found 100 partitions gave good parallelism but beyond that producers slowed down unless we scaled out broker nodes. According to Instaclustr’s benchmarks, doubling partitions halved producer throughput in some cases.

So, I decide partitions by desired parallelism and target throughput. If one consumer can handle X msg/s, and I have k consumers, I need at least k partitions. Then I monitor: if there’s lag or underutilized consumers, I increase partitions or brokers. Also keep replication factor and broker resources in mind (since more partitions means more file handles and metadata overhead).”  

**Interviewer Feedback:**  
Very thorough. You explained both consumer and producer perspectives, citing the StackOverflow discussion where throughput drops with many partitions. You also gave a practical guideline (1-2 partitions/core) which shows real-world thinking. Good mention of balancing partitions vs cluster size. Next time, you might also mention partition keys (how you distribute data among partitions to avoid hot spots) and that you can reassign partitions or use `kafka-reassign-partitions` for scaling. But overall, this answer shows strong Kafka knowledge and experimental understanding.  

---

### Question 3: PostgreSQL Performance
**Interviewer:** “How do you optimize PostgreSQL database performance? Give examples of strategies or tools you’d use.”  

**Candidate’s Response:**  
“I start by analyzing slow queries with `EXPLAIN ANALYZE` to see the query plan. That tells me if it’s doing sequential scans, nested loops, etc. If a query is slow, common fixes include adding or tuning indexes on the columns used in JOINs or WHERE clauses. For example, ensure columns in filters are indexed. Also, keep PostgreSQL statistics up to date with `ANALYZE`, because bad statistics can make the planner pick the wrong join order or method. 

Other tips: avoid unnecessary columns or `SELECT *` if you don’t need them, since that reads extra data. Remove unused indexes or constraints that slow down writes. You can increase `work_mem` for large sorts or hash joins to avoid disk-spill sorts. For bulk loading, use `COPY` instead of individual inserts. 

In terms of concurrency, use row-level locks (e.g. `SELECT FOR UPDATE SKIP LOCKED` in a job queue) to avoid deadlocks or waiting. SKIP LOCKED is useful so that if another worker has locked a row, you skip it instead of blocking. If deadlocks still occur, catch the SQLSTATE error and retry, since deadlocks are transient. 

Monitoring is key too: use `pg_stat_statements` or a slow query log to find bottlenecks, and examine indexes there. In summary, use proper indexes, analyze queries, and adjust memory/config (like `max_connections`, `shared_buffers`) as needed. Profiling queries with `EXPLAIN ANALYZE` is crucial.”  

**Interviewer Feedback:**  
Comprehensive answer. You covered indexing (“cornerstone of performance”), query rewriting (from the EDB guide), and even server config like `work_mem`. Mentioning `COPY` for bulk insert is good. Your concurrency point about `SKIP LOCKED` was spot-on (and cites that StackOverflow tip). One missing piece: mention VACUUM/auto-vacuum to avoid bloat, but overall you hit all major areas. You showed understanding of both query-level and system-level tuning. Great.  

---

### Question 4: Cron Jobs & Fault Isolation
**Interviewer:** “Your experience includes re-architecting cron jobs for pre-aggregation with a ‘fault-isolation’ approach. Can you explain that pattern in general?”  

**Candidate’s Response:**  
“Sure. We had cron jobs that processed large batches (e.g. thousands of records). Sometimes a single bad record would cause the whole batch to fail, which delayed our dashboards. The solution was to isolate failures. We used a recursive splitting pattern: if a batch failed, we divided it into two smaller batches and retried them separately. This is like a binary split. Keep splitting a failing batch until you narrow down the bad record. Then you can log/skip it and resume processing the rest. 

This is an example of fault isolation or bulkheading: you limit the scope of failure to a small subset so it doesn’t take down everything. In microservices design, it’s akin to the bulkhead pattern where one failing component doesn’t crash others. We applied it at the data batch level. 

More generally, for scheduled jobs: I’d design them to be idempotent and resumable. Use queue tables with status flags, and workers pick up tasks with `FOR UPDATE SKIP LOCKED` so that if one worker fails, another can continue. For any long-run task, break it into smaller chunks (for example, one hour of data at a time) so failures are isolated. Also alerting is important: our system alerted the team (via Slack) when a batch failed, so we could intervene.  

In summary, fault isolation means breaking work into independent units so that one failure only affects a small part. This matches AWS’s advice to break workloads into small subsystems that fail independently.”  

**Interviewer Feedback:**  
Excellent explanation of fault isolation. You clearly described the binary-splitting technique and tied it to the bulkhead/fault-isolation principle. Using `SKIP LOCKED` and status flags shows practical understanding of reliable job scheduling. Mentioning alerts and idempotency also demonstrates production awareness. One thing to probe further could be how you monitor and alert on stalled jobs (e.g. using CloudWatch alarms). But overall, this answer shows a mature handling of failures.  

