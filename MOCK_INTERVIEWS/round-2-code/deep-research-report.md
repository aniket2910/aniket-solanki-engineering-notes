**Files:**  
- `Round1.md`  
- `Round2.md`  
- `Round3.md`  
- `Round4.md`  
- `Round5.md`  
- `Round6.md`  
- `Round7.md`  

```markdown
# Round 1: HR Screener & Core Pitch

**Question 1:** _“Tell me about your background and what you’re looking for.”_  
**Candidate’s Response (example):**  
“I’m Aniket Solanki, currently SDE-2 at Pluralsight India with about 3.5 years of experience building full-stack applications and high-throughput backend pipelines.  In my current role, I worked extensively with Node.js (Express/NestJS), PostgreSQL, Kafka, Redis, and AWS.  For example, I dramatically cut our dashboard load times by pre-aggregating data on a schedule, and I built a Kafka pipeline that processed over 160M records to generate our top-10 courses report.  I’ve also led small teams (I was acting tech lead for a 3-person squad) and mentored interns through projects. I’m now looking for a role where I can take on more ownership of architecture and work on large-scale systems — especially since I’m aiming for a senior-level position. I’m excited about your company because it’s known for technical rigor and impactful products, and I believe my background aligns well with the technologies and challenges you focus on.”  

**Interviewer Feedback:**  
Good opening. You clearly summarized your experience and key projects. You highlighted measurable achievements (dashboard speedup, Kafka pipeline) which shows impact. You connected your goals (more ownership, large-scale systems) with what the company does. One thing to watch: it could be stronger to tie *specific* experiences back to the new role’s needs. For example, mention how your Kafka/data pipeline work could apply to this company’s data challenges. Also, avoid sounding rehearsed — you have a lot of facts, which is great, but try to weave them into a natural story.  

**Next Question:** “Why are you considering leaving Pluralsight after 3.5 years? What’s motivating your move now?”  

---

### Question 2: “Why are you looking to leave your current role?”  
**Candidate’s Response (example):**  
“I’ve learned a lot at Pluralsight, especially about building scalable data pipelines and leading small projects. However, after 3.5 years, I’m looking for new challenges and growth. I feel ready to take on bigger architecture responsibilities and mentor a larger team. For instance, while I enjoyed optimizing the dashboard and Kafka jobs, those systems are now mature. I’d like to work on newer problems – maybe using machine learning in the pipeline or scaling to an even larger user base. Also, I want to be in an environment that encourages deeper architectural design across the full stack. Your role at [Company] is appealing because it involves designing high-throughput services, which fits my interest and lets me leverage my Node/Kafka/Postgres experience.”  

**Interviewer Feedback:**  
Your answer is positive and focused on growth, which is good. You emphasized wanting bigger challenges and more ownership, rather than criticizing your current job. That shows professionalism. You also linked your experience (dashboard/Kafka work) to the new role’s focus on high-throughput services, which is excellent. One missing element: concrete examples of what you *specifically* hope to do differently. For instance, you mentioned interest in ML or larger scale; tying that to something this company does would strengthen your pitch. Otherwise, this was a solid explanation.  

**Next Question:** “Can we discuss your compensation expectations?”  

---

### Question 3: “What salary are you expecting?”  
**Candidate’s Response (example):**  
“Based on my experience and the market, I’m targeting around 40+ LPA (lakhs per annum). I researched similar SDE-2 roles in Bangalore, and given my skills (Node.js, Kafka, AWS, etc.) and record of impact, that seems reasonable. For example, Indeed suggests preparing a salary range by researching industry trends and knowing your value. At my level, I’ve seen peers with comparable experience and tech stacks in Bangalore commanding 38–45 LPA. I also have potential offers in hand in that range, which reflects the market. I believe 40+ LPA is fair given the value I can bring.”  

**Interviewer Feedback:**  
You handled the question directly and confidently, citing market research. Quoting career-advice (like the Indeed tip on preparing a range) is a nice touch. You gave a clear number and rationale, which anchors the negotiation. One caution: don’t mention competitors or other offers too early unless asked, as it can backfire. Also, be prepared for pushback (maybe they’re at a lower band). For now, your answer is strong: it’s backed by research and your accomplishments.  

**Next:** If the interviewer pushes back on budget, we’ll move to negotiation round later.

```

```markdown
# Round 2: Machine Coding

**Question 1:** _“We have a list of asynchronous tasks (e.g. network or DB calls). How would you process them in Node.js with at most N tasks running concurrently, and ensure errors don’t crash the whole process?”_  

**Candidate’s Response (example):**  
“I’d write a function to manage a pool of concurrent promises. For example, I can maintain an index and a counter for in-progress tasks. Pseudocode: 

```js
async function runWithConcurrency(tasks, limit) {
  const results = new Array(tasks.length);
  let inFlight = 0, i = 0;
  return new Promise((resolve, reject) => {
    function launch() {
      if (i === tasks.length && inFlight === 0) {
        return resolve(results);
      }
      while (inFlight < limit && i < tasks.length) {
        const idx = i++;
        inFlight++;
        tasks[idx]()
          .then(res => {
            results[idx] = res;
          })
          .catch(err => {
            // Handle task error but continue others
            results[idx] = err;
          })
          .finally(() => {
            inFlight--;
            launch();
          });
      }
    }
    launch();
  });
}
```

This function takes an array of task functions (returning Promises) and runs up to `limit` at once. When a task finishes (either success or error), it decrements the in-flight count and launches more. Errors for individual tasks are caught so they don’t reject the entire Promise; I could collect them or log them. 

This leverages Node’s async nature (non-blocking I/O). Since Node.js is single-threaded for JS code, we don’t have traditional threads locking issues. Concurrency here is about managing multiple outstanding async calls. I’d also ensure each task’s function uses proper `await/try-catch` internally or returns a rejected promise on failure. That way, one failing task won’t crash the loop — I catch it above. For cleanup, I’d use `finally` to always trigger the next batch. 

If deeper fault tolerance is needed (e.g. retries), we could wrap the `tasks[idx]()` call in a retry loop or use libraries like `p-retry`. But the core idea is: use async functions and a simple semaphore-like counter to cap concurrency.”  

**Interviewer Feedback:**  
Good answer. You provided code to demonstrate the solution and explained it clearly. You correctly use a counter and `Promise` to manage concurrency, and you handle errors without halting everything. You also noted Node’s single-threaded model (no need for locks on JS objects) and how to catch individual errors, which is excellent. One suggestion: check that tasks are defined (e.g. they should be functions returning a promise, not immediate promises) and mention edge cases (what if `limit` <= 0). Also, consider memory leaks: if there are a million tasks, the recursion/callback could cause a large promise chain; you might choose a loop or iterative solution to avoid stack issues. But overall, your design is solid and shows good clean-code practice and OOP structure in JS.  

**Next Question:** “Suppose one of these tasks takes unexpectedly long (hung or very slow). How could you modify your code to avoid waiting indefinitely?” (Follow-up on handling timeouts)

```

```markdown
# Round 3: Problem Solving / DSA

**Question 1:** _“You have a large array of course IDs representing course completions (e.g. `[5,2,5,3,2,5, …]`). Describe how to find the top 10 most frequent courses. Provide code (in JavaScript/TypeScript or pseudocode) and discuss time/space complexity.”_  

**Candidate’s Response (example):**  
“To find the top 10 courses, I’d first count frequencies using a hash map (object or `Map`). That’s O(n) time and space for n records. Then I need to select the 10 highest counts. 

One approach (O(n log n)): transform the map into an array of `[course, freq]` and sort descending by `freq`, then take first 10. But with a large n, a better way is a min-heap (priority queue) of size 10. 

Pseudocode using a min-heap:
```js
const freqMap = new Map();
for (const id of courses) {
  freqMap.set(id, (freqMap.get(id) || 0) + 1);
}
// Use a min-heap keyed by frequency:
const heap = new MinHeap((a,b) => a.freq - b.freq);
for (const [course, freq] of freqMap) {
  heap.push({course, freq});
  if (heap.size() > 10) {
    heap.pop(); // remove smallest freq
  }
}
// Now heap contains the top 10 courses (not sorted). Extract:
const top10 = [];
while (!heap.empty()) {
  top10.push(heap.pop().course);
}
```
This is overall O(n + m log 10), where m = number of unique courses (m ≤ n). Since log10 is constant, it’s essentially O(n). The heap operations (insert/pop) are O(log k) with k=10, so practically constant.  

If the data is extremely large (e.g. doesn’t fit in memory), we could stream it: count frequencies in chunks or use an external sort (like “TopK by streaming”) but conceptually the same: maintain a running top-10.  

_Complexity:_ Counting is O(n). Heap operations are O(m log 10) ≈ O(m). So time ≈ O(n + m). Space is O(m) for the map, plus O(10) for heap.  

I could also mention a bucket-sort approach: if frequencies aren’t too large, we could bucket by frequency to get true O(n) without logs, but the heap is simpler and works well for k=10. [37†L136-L142][37†L188-L195]”

**Interviewer Feedback:**  
Good solution. You correctly used a hashmap plus a min-heap to efficiently get the top frequencies, and you explained the complexity clearly. The reference to a “bucket sort” (from [37]) was insightful, though not necessary. One thing to probe: edge cases and scaling. For example, what if courses array is *huge* (160M)? Your memory usage (O(m)) might still be large. We might discuss sampling or approximate counts (like a Count-Min Sketch) if needed. Also, ensure to handle ties and ordering if asked. But overall, your DSA approach and code logic are correct and well-justified for an interview.  

**Next Question:** “What if you only have a stream of data (you can’t store all counts in a map)? How would you approximate the top courses with fixed memory?” (Follow-up probing large-scale data)

```

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

```

```markdown
# Round 5: System Design

### Question 1: High-Throughput Metrics Ingestion  
**Interviewer:** “Design a system that ingests large volumes of metrics (e.g. user events) in real time, processes them, and makes them available for analysis. How would you architect it?”  

**Candidate’s Response:**  
“I’d use a distributed event-streaming approach. First, each application instance (or server) publishes events to a message broker like Kafka, which is suited for high-throughput pipelines. Kafka can handle many producers and can buffer events durably. 

Components:  
- **Producers:** The app servers push events (e.g. user clicks, metrics) to a Kafka topic. We might use a schema/serialization (like Avro or JSON) for consistency.  
- **Kafka Cluster:** Set up a Kafka cluster with multiple brokers. Partition the topic by a logical key (e.g. user ID or metric type) so that load is balanced. We’d start with ~1-2 partitions per core per broker. If we need more parallelism, add brokers or increase partitions while monitoring the impact on producer throughput.  
- **Consumers:** A consumer group of worker processes (could be NodeJS, Go, Java) that subscribe to the topic. Each consumer reads from some partitions. They process events (e.g. aggregate counts, filter, enrich) and then write results to a datastore.  
- **Storage:** For real-time analytics, we might use a time-series database (like InfluxDB or TimescaleDB) or a data warehouse (Snowflake) for analytics queries. If we just need counts/aggregates, maybe store into Redis or Cassandra depending on query patterns.  

Key points: ensure *exactly-once* or *at-least-once* semantics as needed. Kafka with idempotent producers or writing transactions can help ensure each event is processed exactly once. Consumers should commit offsets after processing. We should also plan for *fault tolerance*: if a consumer fails, another in the group will pick up its partitions.  

For scaling: use more brokers for throughput, and auto-scale consumer instances based on lag. Use load tests to size: Kafka is designed for high throughput. Make sure network, disk I/O, and Zookeeper (or KRaft) are scaled appropriately. Use monitoring (Kafka metrics, consumer lag) to spot bottlenecks.  

Also consider *rate limiting*: if downstream storage is slower, we could have backpressure. We might pause or buffer. In some designs, a second Kafka topic or buffer queue absorbs bursts.  

This design is loosely-coupled (EDA), so it scales horizontally.”  

**Interviewer Feedback:**  
Solid high-level design. You incorporated Kafka effectively for real-time ingestion (citing it as the industry standard). You mentioned partitions, scaling, and fault tolerance. You could improve by drawing or enumerating trade-offs (e.g. Kafka vs. Kinesis) and mention schema registry or serialization. Also, ensure you address ordering (if any). But your description of producers->Kafka->consumers->storage is clear, and you considered scaling (adding brokers/consumers). Good job.  

---

### Question 2: Rate Limiter Design  
**Interviewer:** “How would you design a rate limiter for an API, so that each user/IP can make at most 100 requests per minute? Consider a distributed system.”  

**Candidate’s Response:**  
“One common approach is the **Token Bucket** algorithm. Each user has a bucket that fills at a fixed rate (e.g. 100 tokens per minute) and can hold up to 100 tokens. Each request consumes a token. If the bucket is empty, requests are rejected or delayed. This allows short bursts (using the stored tokens) but enforces the long-term rate. 

Implementation-wise, in a single server you could track a timestamp and token count per user. For distributed, we could use Redis: store for each user a key with the token count and last refill time. Use an atomic Lua script (or Redis commands) to refill tokens and consume one on each request. Redis’s single-threaded nature ensures atomic updates without race conditions.  

Alternatively, a **Sliding Window** counter is an easy method: store timestamps of requests (or counts per small interval) in Redis or a fixed window counter. But token bucket is more precise. 

For scale, if we have many servers, they can all check Redis. Redis or any fast in-memory store is a good central store; or use a consistent hashing so that rate-limit keys are sharded across Redis nodes. 

If we want approximate limiting with less memory, we could use a leaky bucket or fixed window counters (for example, increment a Redis key like `user123:60s` and expire it). But that’s coarser. 

Important details: ensure the algorithm is thread-safe (use Redis INCR commands or locks). Handle clock skew carefully (use server time). For a robust system, also log when limits are hit and potentially inform the client. 

In summary: I’d use a token bucket or sliding window approach, likely backed by Redis or Memcached for distributed coordination. The token bucket is well-known for handling bursts gracefully.”

**Interviewer Feedback:**  
Good answer covering common algorithms. You correctly described token bucket and how to implement it with Redis, citing how tokens fill at a steady rate. You also mentioned sliding window as an alternative. This shows you know multiple techniques. One addition: mention that Redis’ sorted sets or simple key TTL can be used for sliding windows, and discuss trade-offs (memory vs. strictness). Also, consider distribution: some systems use client-side leaky bucket plus an API gateway. But overall, this demonstrates you understand rate limiting at scale.  

```

```markdown
# Round 6: Behavioral / Leadership (STAR Format)

**Question 1: Tech Lead Experience**  
_Tell me about a time you acted as a tech lead for a team project._  

**Candidate’s Response (example):**  
“**Situation:** In early 2025 at Pluralsight, our team had to deliver a new dashboard feature under a tight deadline. I was asked to step in as acting tech lead for our 3-engineer team for that sprint.  

**Task:** My role was to design the feature architecture, delegate tasks, and ensure quality. We needed a reliable pre-aggregation pipeline to power a real-time metrics dashboard.  

**Action:** First, I gathered requirements and broke them into tasks. I assigned one engineer to build the NestJS service framework, another to implement data aggregation queries in Postgres, and the third to develop the React frontend. I also wrote a prototype of the backend using Redis streams for buffering. We had daily check-ins. I reviewed everyone's design choices: for example, I suggested using Redis hash maps for quick lookups in the service and capping our Postgres query with proper indexes (recalling from a past performance-tuning discussion). When someone hit a roadblock with Kafka throughput, I organized a quick knowledge-sharing session on Kafka partitions (drawing on our Kafka tuning experience).

Throughout, I encouraged open discussion. When disagreements arose (e.g. which cache library to use), I facilitated by weighing pros/cons with the team’s input.  

**Result:** We delivered the feature on time. The dashboard worked smoothly and under load. The team later awarded me a Spot Bonus for my leadership and for bridging the gaps in our skillsets. Moreover, all three engineers learned new concepts (one of them became comfortable with full-stack development for the first time). The project success was acknowledged by our VP as a model of cross-functional teamwork.”  

**Interviewer Feedback:**  
This is a strong STAR response. You clearly outlined a situation and your actions as tech lead. Mentioning concrete actions (task assignment, design reviews, knowledge sessions) is excellent. You also connected to your technical expertise (Postgres indexing, Kafka tuning) which shows technical leadership. The result quantifies success (delivered on time, spot bonus). For improvement, you could briefly mention any challenge you overcame during that period (like a conflict or a critical bug) to add depth. But overall, well done.  

---

**Question 2: Handling Conflict**  
_Describe a time you had a conflict with a teammate or stakeholder. How did you resolve it?_  

**Candidate’s Response (example):**  
“**Situation:** On another project, a colleague and I disagreed on how to structure a new microservice’s API. I favored a RESTful design, while he wanted GraphQL for flexibility.

**Task:** We needed an API that the frontend could easily consume for multiple types of data queries, and we had limited time.  

**Action:** I suggested we list criteria: performance, ease of use, team familiarity, and time to implement. We held a meeting to discuss. I acknowledged his point that GraphQL can reduce over-fetching, but I also pointed out that our team had more experience in REST and that time constraints made a quick REST API deliverable. He explained some front-end use cases where flexible queries were beneficial. 

To resolve this, I proposed a compromise: we would implement a REST API first (which we knew we could build quickly and was standard for our stack), but we’d design it with versioning and possible extensibility. In parallel, I gave myself a small spike task: build a simple GraphQL wrapper prototype around our data model to compare effort. After that, we realized the REST approach was indeed faster for our limited scope, and we planned to revisit GraphQL in a later phase if needed. 

**Result:** This compromise was accepted. The API shipped on schedule. The process improved our communication — we learned to explicitly list pros/cons and prototype before deciding. Later, my colleague and I even co-wrote a blog post on choosing REST vs GraphQL, which was well-received internally.”  

**Interviewer Feedback:**  
Good answer. You demonstrated empathy (acknowledging the other’s perspective) and a pragmatic approach (criteria list, prototyping). You reached a compromise without conflict escalation. Highlighting the outcome (shipping on time, team learning) is strong. For feedback: be cautious on tone (“the colleague wanted GraphQL”) to ensure it doesn’t sound like he was wrong; instead, emphasize the analysis. But the candidate shows good conflict-resolution skills and openness to alternatives.  

---

**Question 3: Failure or Mistake**  
_Tell me about a time something went wrong (failure) on a project. What happened and what did you learn?_  

**Candidate’s Response (example):**  
“**Situation:** Early in my career, I was responsible for writing a script to migrate some old user data to a new database schema. I wrote it, tested it lightly, and ran it overnight on production data. 

**Task:** The task was to transform and load thousands of user records.  

**Action:** Unfortunately, I had a bug in the script’s filtering logic, so when it ran, it duplicated some records and missed others. I found out the next morning via alerts and user complaints. Immediately, I rolled back the last migration batch. Then I fixed the script and ran tests on a copy of production data before retrying. I also put in place better checks: counting records before/after, and a dry-run mode with logs. I documented the mistake and my fix, and shared it in our team retro meeting. 

**Result:** After these changes, the migration completed correctly. The incident taught me to **never run untested scripts on production data**. It also improved our process: now all migrations require peer code reviews and test runs in staging with realistic data. This mistake actually led to more robust deployment practices.  

**Interviewer Feedback:**  
This is a very honest and constructive answer. You showed accountability and learning from the error (“never run untested scripts”). Importantly, you demonstrated taking corrective action (rollback, logging) and implementing process improvements (peer review, dry-run mode). That’s exactly the kind of post-mortem ownership we look for. I might ask a follow-up on how you notify stakeholders when you roll back (communication under pressure), but overall, this answer highlights maturity and responsibility.  

```

```markdown
# Round 7: Salary Negotiation

**Interviewer:** “We see you’re targeting 40 LPA. Our budget for SDE-2 is usually around 32-35 LPA. Could you consider something in that range?”  

**Candidate’s Response (example):**  
“I appreciate that information. My expectation is grounded in both my experience and market data. For context, at Pluralsight I’ve delivered significant technical improvements (dashboard, Kafka pipeline, etc.), and I’ve already stepped up as a tech lead. Indeed advises researching industry salary trends to set realistic ranges. Based on that, I found that engineers with similar experience and skills (Node.js, Kafka, AWS, etc.) in Bangalore are valued in the 38–45 LPA range. I also benchmarked roles at companies like Razorpay and Grab where senior engineers are in the 35–42 LPA range. 

Given this, I was targeting around 40 LPA as a midpoint, but I’m open to discussing the full compensation package. For instance, maybe we could explore performance bonuses or equity to bridge the gap. I want to make sure that the offer reflects both my current level of responsibility and the significant impact I can bring here. If 40 is too high to start, I’d be willing to understand your constraints and see if we can meet halfway, or include other incentives. But ideally, I’m looking for a minimum that matches my market value and lets me commit fully.”  

**Interviewer:** “I understand. Let me take that back to our team. One option is to start at 35 LPA with a review in 6 months based on performance. How does that sound?”  

**Candidate’s Response (example):**  
“I appreciate the flexibility. A performance-linked review could work. If the mid-year review can guarantee a clear pathway to reach 40 LPA (assuming targets are met), I think that would be fair. I’d just ask for transparency in how those targets are defined. Another idea, if it’s agreeable, is a signing bonus to compensate the difference in the short term, with the understanding that my base salary aligns with the level after 6 months of demonstrated results.”  

**Interviewer Feedback:**  
Candidate remained calm and professional under pushback, which is great. They justified their number with market data and were willing to explore alternatives (bonus, fast review). This is effective negotiation. Just be careful not to fixate on one number—opening the door to other compensation shows pragmatism. The candidate did well to anchor at 40, then work toward compromise, in line with salary advice about knowing your worth.  

```

**List of files:** `Round1.md`, `Round2.md`, `Round3.md`, `Round4.md`, `Round5.md`, `Round6.md`, `Round7.md`.