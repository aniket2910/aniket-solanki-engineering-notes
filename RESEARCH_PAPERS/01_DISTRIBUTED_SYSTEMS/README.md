# 01 · Distributed Systems

Papers about making **many machines behave like one** — caching, replication, sharding, failure handling, and consistency across servers, data centers, and continents. This is the "how do the giants stay up?" chapter: the systems behind feeds, timelines, and anything served to billions.

## 📄 Papers

| ID | Paper | Venue / Year | Key ideas |
| :--- | :--- | :--- | :--- |
| 001 | **[Scaling Memcache at Facebook](./001-scaling-memcache-at-facebook.md)** | NSDI 2013 | Look-aside cache, delete-on-write, leases (stale-set + thundering-herd), Gutter failover, mcsqueal invalidation (CDC), remote markers, region-scale consistency |

## 🎯 Goal of this chapter

Understand how a simple idea (a RAM cache in front of a database) is engineered into a fault-tolerant, planet-scale system — and to extract the *reusable patterns* (cache-aside, idempotent invalidation, change-data-capture, failover pools, bounded-staleness consistency) that recur across every large distributed system you'll meet later.
