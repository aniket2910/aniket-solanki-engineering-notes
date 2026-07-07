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

