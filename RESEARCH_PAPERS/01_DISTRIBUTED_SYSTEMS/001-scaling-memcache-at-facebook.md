# Scaling Memcache at Facebook

**Paper:** *Scaling Memcache at Facebook* — Rajesh Nishtala, Hans Fugal, Steven Grimm, Marc Kwiatkowski, Herman Lee, Harry C. Li, Ryan McElroy, Mike Paleczny, Daniel Peek, Paul Saab, David Stafford, Tony Tung, Venkateshwaran Venkataramani. Published at **NSDI 2013** (USENIX Symposium on Networked Systems Design and Implementation).

This lesson is complete on its own. You do not need the paper open to understand any of it — everything the paper teaches is rebuilt here from first principles, with the reasoning that led Facebook's engineers to each decision.

---

## The Core Question

You have a website read by **billions of people**. Almost everything they do is a *read* — opening a profile, loading a feed, viewing a photo. Each of those reads touches dozens of pieces of data scattered across many databases. If every read hit the database, the databases would melt.

So you put a cache in front. Easy. But now the real question — the one this whole paper exists to answer:

**How do you turn a tiny single-machine cache into a system spanning thousands of machines across multiple continents, serving billions of requests per second, without ever showing users data that is too stale — and while individual machines are constantly dying?**

Caching one value in RAM is trivial. Caching *the world's social graph*, consistently, at that scale, is one of the hardest engineering problems there is. That gap is the subject of this lesson.

---

## The Origin Story (history & the thinking behind it)

### Before the cache: the read-heavy wall

To understand memcache you first have to feel the pain that created it. Rewind to the early 2000s. Web applications were built the obvious way: a web server receives a request, runs some code, queries a **relational database** (usually MySQL), formats the result into HTML, and returns it.

This works beautifully until you get popular. The bottleneck is almost always the database, and specifically **reads**. On a social site the numbers are lopsided in a way that shapes every decision that follows: reads outnumber writes by roughly **two orders of magnitude** (hundreds of reads for every write). A relational database is a marvel of correctness — transactions, joins, durability, ACID guarantees — but all of that machinery is *expensive*. Serving a simple "what's this user's name?" through the full transactional stack, from spinning disk through query planner, is like starting a freight train to deliver a single letter.

You can buy a bigger database server (scale **up**), but there's a ceiling — the biggest single machine money can buy still isn't enough, and it's a single point of failure. You can add read replicas, but replicas lag and still run the whole expensive query engine. The database's problem isn't that it's slow; it's that it's doing far *more work than a read needs*. A read just needs the answer, and it needs it from RAM, not disk.

### memcached: the single-machine answer (2003)

In **2003**, **Brad Fitzpatrick** was running **LiveJournal**, an early blogging/social platform, through his company Danga Interactive. LiveJournal was hitting exactly this database wall. His answer was a small, sharp tool he called **memcached** ("mem-cache-dee" — a memory cache *daemon*).

memcached is deliberately dumb, and that is its genius. It is:

- **In-memory only.** No disk, no durability. If it dies, the data is gone — and that's *fine*, because it's only a cache; the real data still lives in the database.
- **A pure key → value hash table.** You `get(key)`, `set(key, value)`, `delete(key)`. No queries, no joins, no schema, no transactions.
- **LRU-evicting.** When it fills up, it throws away the least-recently-used items to make room. It's a fixed-size box that keeps the hot data and drops the cold.
- **Single-machine.** One process on one server, managing that server's RAM.

Because it does so little, it does it *blazingly* fast — an answer straight from a RAM hash table, in microseconds. Fitzpatrick open-sourced it, and it spread across the web industry as the default way to take read load off a database.

But notice the word in that last list: **single-machine**. memcached manages *one server's* memory. That's where the story really begins.

### Facebook's leap: from `memcached` to `Memcache`

By the late 2000s Facebook had a problem no single machine could solve. Their working set — the data users actively touch — was measured in *terabytes*, far larger than any one server's RAM. And the request rate was measured in *billions per second*. One memcached process, however fast, was a grain of sand against that.

Facebook's engineers made a distinction the paper is careful to draw, and you must hold onto it for the rest of this lesson:

- **`memcached`** (lowercase) = the original single-machine binary Fitzpatrick wrote. The building block.
- **`Memcache`** (capital M) = the **distributed system** Facebook built *out of thousands of `memcached` instances* plus a large amount of surrounding software — clients, routers, invalidation pipelines, failover pools, cross-region protocols.

The paper's real subject is not the cache itself. It's **all the machinery around the caches** that makes ten thousand independent RAM hash tables behave like one coherent, fault-tolerant, planet-spanning cache. Fitzpatrick gave the world a fast box. Facebook's contribution — the research this paper documents — is *how to wire ten thousand of those boxes together and survive.*

The guiding philosophy, stated plainly in the paper, is worth internalizing because it explains every trade-off that follows: **they deliberately chose performance and availability over perfect consistency.** A social network can tolerate a user occasionally seeing a slightly stale comment count for a fraction of a second. It cannot tolerate the site being slow or down. Every design choice in this paper bends toward *fast and available*, accepting *small, bounded staleness* as the price.

---

## Why it exists (the pain it solves)

Strip away the scale for a moment. The core pain memcache removes is: **the database is being asked to answer the same cheap questions over and over, and each answer costs far more than it should.**

Concretely, without a distributed cache in front of the database:

- **Latency is bad.** Every read pays disk/query-engine cost. User-facing pages that assemble hundreds of items become slow.
- **Throughput hits a wall.** The database can only do so many queries per second. Past that, requests queue, latency spikes, and the site falls over.
- **You can't scale reads independently.** Databases are expensive and hard to shard for reads. Adding capacity means adding whole replicas of the entire expensive engine.

memcache exists to insert a layer that is **cheap, RAM-fast, and horizontally scalable** between the web servers and the databases — soaking up the overwhelming read traffic so the database only handles the small residue of writes and cache misses. But once that layer spans thousands of machines and multiple data centers, a *new* set of pains appears — stale data, thundering herds, cascading failures, cross-region lag — and the bulk of the paper is Facebook solving each of those in turn. That's the deep material below.

---

## What it is

**Definition.** Facebook's Memcache is a **distributed, demand-filled, look-aside cache** built from thousands of `memcached` servers, fronting Facebook's databases, and coordinated by a suite of custom software (routing clients, failover pools, and an invalidation pipeline) that keeps it fast, fault-tolerant, and *good enough* consistent across a single server, a data center, and the whole globe.

Two phrases in that definition carry most of the meaning:

**"Demand-filled" (a.k.a. lazy / cache-aside).** The cache does not proactively load data. It fills *on demand*: the first time someone asks for a key that isn't cached (a **miss**), the application fetches it from the database and puts it into the cache, so the *next* asker gets a hit. The cache learns the hot set by watching what's actually requested.

**"Look-aside" (the application orchestrates, not the cache).** The application code talks to the cache and the database *separately*. On a read it looks *aside* to the cache first; on a miss it goes to the database itself and then populates the cache. The cache is a passive box that never talks to the database. (Contrast this with a **read-through / write-through** cache, where the cache sits inline and fetches from the DB for you. Facebook chose look-aside for control and simplicity — the app decides exactly what to cache and when.)

### Mental model

Picture the cache as a **whiteboard next to a giant, slow filing cabinet (the database).**

- Someone asks you a question. You glance at the whiteboard. If the answer is written there — **hit** — you read it off instantly.
- If it's not on the whiteboard — **miss** — you walk to the filing cabinet, dig out the folder, read the answer, *and jot it on the whiteboard on your way back* so the next person who asks gets it instantly.
- When a fact *changes*, you don't carefully rewrite the whiteboard. You just **erase that line** (delete the key). The next person to ask will miss, walk to the (now-updated) cabinet, and rewrite the fresh answer on the board. Erasing is safer than rewriting, and you'll see exactly why below.

Now imagine not one whiteboard but a warehouse of ten thousand of them, each person only allowed to write on the specific board assigned to each topic, boards occasionally catching fire (server failure), and warehouses on different continents that must agree. That's the distributed problem.

### The two core paths (memorize these)

Every interaction is one of two flows:

```
READ (get):
  1. value = memcache.get(key)
  2. if value found  -> HIT, return it.       (the fast, common case)
  3. if not found    -> MISS:
        a. value = database.query(...)
        b. memcache.set(key, value)
        c. return value

WRITE (update):
  1. database.write(...)          <- update the source of truth first
  2. memcache.delete(key)         <- INVALIDATE (erase), don't overwrite
```

That's the whole skeleton. Almost everything else in the paper is defending this skeleton against scale, staleness, and failure. Note the write path **deletes** rather than **sets** — the single most important subtlety in the whole system, explained next.

---

## How it works (under the hood)

We'll build up in the same three "regions of scale" the paper uses, because the problems genuinely change as you zoom out:

1. **One cluster** — many web servers + many memcached servers in one group. Problems: *latency* and *load*.
2. **One region (data center)** — many clusters sharing one database. Problem: keeping clusters *consistent*.
3. **Many regions (the globe)** — data centers on different continents. Problem: *replication lag* across the world.

### Why write = delete, not update (the keystone idea)

Before the scale stuff, nail this down, because it recurs everywhere.

When data changes, why does memcache **delete** the key instead of **setting** the new value into the cache?

Two reasons:

**1. `delete` is idempotent; `set` is not.** Deleting a key twice, or in any order, always ends in the same state: the key is gone. Setting a value is *order-sensitive* — if two writers set the same key with different values, the final state depends on who wrote last, and at scale you cannot guarantee ordering. Idempotence means you can retry deletes, duplicate them, and reorder them freely without corrupting state. In a distributed system where messages get retried, duplicated, and reordered constantly, that property is gold.

**2. It avoids caching a value that was never the "final" truth.** If a write path *set* the cache with the value it just wrote, but the database applied a *different, later* write in between, the cache would now hold a value that's already wrong. By deleting instead, you force the *next reader* to fetch whatever the database currently holds — the real, current truth — and cache that. The cache is always filled from the authoritative source, never from a possibly-racing writer.

The cost: a delete throws away a value that a set could have preserved, causing an extra miss. Facebook judged that trade — correctness and simplicity for one extra miss — well worth it. Hold this idea; the **lease** mechanism below exists partly to make this delete-and-refill dance safe under races.

### Region of scale #1: within a single cluster

A **cluster** is a large group of web servers (the clients) plus a large group of `memcached` servers (the cache). The two goals here are **reduce latency** and **reduce load on the databases behind them**.

#### Sharding: which server holds which key?

No single `memcached` holds everything; the keyspace is spread across all of them. The client (a library living inside each web server) decides *which* `memcached` server owns a key using **consistent hashing**.

Consistent hashing (worth knowing in its own right): imagine hashing both keys *and* servers onto the same circular number line (a "ring"). A key is stored on the first server you meet walking clockwise from the key's position. The virtue is that when a server is added or removed, only the keys in its immediate arc need to move — roughly `1/N` of them — instead of the near-total reshuffle a plain `hash(key) % N` would cause when `N` changes. At Facebook's scale, where servers come and go constantly, "only move a small slice" is essential.

The topology is **all-to-all**: *every* web server can talk to *every* `memcached` server. This is simple and spreads load evenly, but it creates a networking nightmare the paper spends real effort on (incast, below).

#### Batching and the dependency DAG

A single web page might need hundreds of items. Fetching them one at a time — request, wait, request, wait — would be death by round-trips. So the client analyzes the data the page needs and builds a **directed acyclic graph (DAG)** of dependencies: items that don't depend on each other are fetched **concurrently and in batches**; only genuinely dependent fetches are serialized. This maximizes how many keys are in flight at once and minimizes the number of network round-trips. It's the difference between one trip to the store with a full list versus a hundred separate trips.

#### UDP for gets, TCP for sets/deletes

Here's a sharp, counterintuitive choice. For **get** requests, the client uses **UDP** — the connectionless, unreliable, no-handshake protocol — instead of TCP.

Why on earth use an unreliable protocol for your reads? Because a get is *cheap to retry as a miss*. UDP has no connection setup, no per-connection kernel state, and lower overhead — which matters enormously when every web server keeps talking to every cache server (all-to-all would need an explosion of TCP connections). If a UDP get packet is dropped or arrives out of order, the client simply **treats it as a cache miss** and falls back to the database. A miss is a normal, already-handled event, so "unreliable" costs you nothing but an occasional extra DB read. The paper reports UDP gets meaningfully cut latency versus TCP.

For **set** and **delete**, the client uses **TCP** (routed through a helper on the same machine — `mcrouter`, discussed later — which *coalesces* many web-server connections into far fewer connections to each cache server). Writes and invalidations *must* be reliable — losing a delete would leave stale data in the cache — so they get TCP's guarantees.

The principle: **match the transport to the cost of failure.** A lost read = a cheap miss = use fast/unreliable UDP. A lost invalidation = stale data = use reliable TCP.

#### Incast congestion and the sliding window

All-to-all communication plus heavy batching creates a specific, nasty failure called **incast**: a client fires off a batch of requests to many servers at once, and their replies all come *back at the same instant*, overwhelming the client's network link or switch buffers, causing dropped packets and — perversely — *more* retries and *more* congestion. A stampede of responses.

Facebook's fix is a **sliding window** that limits the number of *outstanding* (in-flight, not-yet-answered) requests a client may have at once. It's exactly analogous to TCP's congestion window, but applied at the memcache-request level. The window size is tuned: too small and you add round-trip latency (you're not asking for enough at once); too large and you invite incast. It self-limits the flood so responses trickle back at a rate the client's network can absorb.

#### Reducing load #1 — Leases (the elegant one)

**Leases** are the cleverest single mechanism in the paper. One idea solves **two** distinct problems: *stale sets* and *thundering herds*.

Here's the machinery. When a client does a `get` and it **misses**, the `memcached` server doesn't just say "not found." It hands back a **lease** — a 64-bit token — that says, in effect, *"You are the designated client responsible for going to the database and filling this key. Bring this token back with your `set`."*

**Problem A it solves — the stale set (a race condition).** Picture this interleaving:

```
Client A: get(k) -> MISS, receives lease L
Client A: reads k from the database (gets value V_old) ... (A is slow here)
                          ... meanwhile the database row for k is UPDATED to V_new ...
Someone : delete(k)      (the write path invalidates k — but k is already empty, no-op)
Client A: set(k, V_old, lease L)   <- about to write STALE data into the cache!
```

Without leases, Client A would happily write the now-stale `V_old` into the cache, and it would sit there wrong until the next invalidation. With leases, the trick is: **any `delete(k)` invalidates the outstanding lease for `k`.** So when Client A finally arrives with lease `L` to set the value, `memcached` sees that `L` was invalidated by the intervening delete and **rejects the set**. The stale value never lands. The cache stays empty and the next reader refetches the truly-current value. Leases turn "did an invalidation happen while I was fetching?" into a token check.

**Problem B it solves — the thundering herd (a.k.a. stampede).** Now imagine a *very hot* key — say, a celebrity's post that just got deleted from cache. In a single instant, **thousands** of web servers all `get` it, all **miss** at once, and all charge at the database simultaneously to refill it. The database gets hit by thousands of identical queries in the same millisecond and buckles. This is the thundering herd.

Leases fix it with **rate-limiting the token**: `memcached` will only hand out a lease for a given key **once every ~10 seconds**. The *first* client to miss gets the lease and goes to fill the key. Every *other* client that misses in that window is told **"a lease is already out — wait a moment and retry the get"** (by which time the first client will likely have refilled the key, turning their retry into a hit). So instead of thousands of database queries, exactly **one** goes through, and the herd is funneled through a single doorway. One miss, one DB read, thousands of satisfied hits.

Leases are the perfect example of the paper's flavor: a small, cheap token, threaded through the miss path, that simultaneously enforces correctness (no stale sets) and protects the database (no stampedes).

#### Reducing load #2 — Pools

Not all keys behave the same. Some are **low-churn** but expensive to recompute and very valuable to keep (you *really* want these to stay cached). Others are **high-churn** — accessed rapidly, changing constantly, cheap to miss. If you throw both into the same `memcached` LRU, the high-churn keys, by sheer volume of activity, will **evict** the precious low-churn keys, even though the low-churn keys were the ones most worth keeping. The busy, worthless data pushes out the quiet, valuable data.

The fix: partition the `memcached` servers into **pools**. A default "wildcard" pool holds most keys; separate pools isolate keys with distinct access patterns. High-churn keys live in their own pool and can only evict *each other*, never the low-churn treasures in a different pool. It's putting your good china in a different cabinet from the everyday dishes so the daily churn doesn't smash the heirlooms.

#### Reducing load #3 — Replication within a pool

If a *single* key (or small set of keys) is so blisteringly hot that one `memcached` server can't serve the request rate for it, you don't shard it finer — you **replicate** it onto multiple servers within the pool. Now the load for that hot key spreads across several servers. Facebook found replication beats finer sharding when the limit is *request rate on few keys* rather than *total data volume*.

#### Handling failure — Gutter servers

`memcached` servers die — hardware faults, network partitions, maintenance. What happens to all the keys a dead server held? Naively, every `get` for those keys now misses and stampedes the database. Worse, if the client *rehashes* those keys onto the surviving servers, it shifts extra load onto them, potentially tipping *them* over — a **cascading failure** rolling through the cluster.

Facebook's answer is a small set of idle standby servers called **Gutter**. When a client detects a `memcached` server is unresponsive, it redirects those requests to a **Gutter** server instead — but with a **short TTL** on entries there. The short TTL matters: Gutter is a temporary shock absorber, not a real replica, so its data is intentionally allowed to expire quickly rather than risk serving staleness for long. Crucially, Gutter *takes over for the specific failed server* rather than smearing its load across all healthy servers, which is what prevents the cascade. It's a designated spare tire: it gets you home, it isn't meant to be driven forever.

### Region of scale #2: within a region (multiple clusters, one database)

Zoom out. A **region** (data center) contains **multiple frontend clusters** (each cluster = web servers + its own memcache tier) all sharing a single **storage cluster** (the databases). Why multiple clusters instead of one giant one? Because a single cluster has diminishing returns — all-to-all networking, incast, and failure blast-radius all get worse as one cluster grows. Smaller clusters are more manageable; you just run several.

But now the same key is cached **independently in every cluster's memcache**. When the underlying data changes, you must **invalidate that key in *every* cluster**, or different users (hitting different clusters) will see different, stale values. This is the region-level consistency problem.

#### mcsqueal — invalidation from the database's own commit log

How do you reliably tell every cluster's memcache "delete key k" whenever the database changes? You could make the web server that did the write also broadcast the deletes — and Facebook does do some of that — but a web server can crash mid-way, missing some invalidations, and it's hard to make complete. The authoritative record of *what actually changed* is the **database's own commit log** (MySQL's binlog): every committed write is in there, durably, in order.

So Facebook built **mcsqueal**: a daemon that runs on the database servers, **tails the MySQL commit log**, extracts the cache keys affected by each committed write, and **broadcasts `delete` invalidations** to the memcache tiers across all clusters in the region. Because it reads the *commit* log, it only ever invalidates for changes that *truly committed* — no phantom invalidations from rolled-back transactions. It **batches** many deletes together for efficiency and ships them through the routing layer (`mcrouter`) which fans them out to every cluster.

This is a beautiful, reusable pattern you'll meet again as **Change Data Capture (CDC)**: instead of trusting application code to remember to emit every side-effect, you tap the database's own durable log of truth and derive the side-effects (here, cache invalidations) from it. The database's log becomes the single source of "what changed."

#### Regional pools

Replicating *every* key into *every* cluster's memcache wastes enormous memory — the same item held N times. For data that is accessed relatively infrequently or is large, Facebook uses a **regional pool**: a memcache tier **shared across all clusters in the region**, holding one copy instead of one-per-cluster. The trade-off is a slightly slower cross-cluster hop to reach it versus the memory saved by not replicating. Hot, latency-critical keys stay replicated per-cluster; colder or bulky keys move to the shared regional pool.

#### Cold cluster warmup

When you bring a **new (cold) cluster** online — or restart one — its memcache is empty. Every request misses and stampedes the database, and it can take *hours* to warm up naturally. Facebook's fix: let the cold cluster fill its misses from an already-**warm** cluster's memcache instead of from the database. The warm cache absorbs the warmup load in place of the database.

But this introduces a subtle race: the cold cluster might `get` a key from the warm cluster, receive a value, and cache it — *just* as that key is being updated in the database and deleted in the warm cluster. The cold cluster could end up holding a value the warm cluster already threw away. The fix is a brief **hold-off**: when the cold cluster deletes a key (because of a write), it refuses to accept a warm-cluster refill for that key for a short window (on the order of a couple of seconds), long enough for the warm cluster's own invalidation to settle. A small timed guard closes the race.

### Region of scale #3: across regions (the whole planet)

Now the biggest zoom. Facebook runs data centers on **different continents** to keep users close to a nearby one (physics: light takes ~tens of milliseconds to cross an ocean, and you can't beat that). Data is kept consistent across regions using **MySQL replication**: exactly **one region is the master** (holds the writable master databases); every other region is a **replica** with read-only copies that receive changes from the master over the replication stream.

The hard new fact of life: **replica databases lag the master.** A change written to the master takes some time — usually small, occasionally seconds under load — to arrive at a replica on another continent. This creates a **read-your-own-write** hazard.

#### The stale-read hazard, concretely

A user in a *replica* region updates something (say, posts a comment). Writes must go to the **master** (only the master is writable), so the web server sends the write across to the master region. Now that same user immediately reads the data back. Their read is served *locally* from the **replica** database — which **hasn't received the change yet** (replication is still in flight). So the read returns the *old* value, and — worse — the look-aside logic **caches that stale value** locally. Now the stale value is stuck in the local cache until the *next* invalidation arrives, long after the replication catches up. The user posts a comment and it appears to vanish.

#### Remote markers — the fix

Facebook's solution is the **remote marker**. The idea: leave a little flag in the *local* region that says *"this key was just written at the master and the local replica may not have caught up yet — don't trust the local copy; go ask the master."*

The dance, step by step, when a client in a **replica** region performs a write:

```
1. Set a "remote marker" key  r_k  in the LOCAL region's memcache
   (a small flag meaning "k is in-flight from the master").
2. Perform the write to the MASTER database, and arrange for the
   invalidation pipeline (mcsqueal) to DELETE r_k once the change
   has replicated back to this region.
3. Delete k from the local memcache (normal invalidation).
```

And on a subsequent **read** that misses in the local cache:

```
- get(k) -> MISS.
- Check: does the remote marker r_k exist?
    - r_k EXISTS  -> the local replica DB may be stale; route this
                     read to the MASTER region to get the fresh value.
    - r_k ABSENT  -> replication has caught up (mcsqueal deleted r_k);
                     safe to read from the local replica DB.
```

So during the brief window when a change is still in flight, reads for that key pay a small penalty (a hop to the master region) to get correct data; once replication catches up, the marker is gone and reads go local and fast again. It's a **temporary detour sign** posted at exactly the keys currently "under construction," automatically taken down (by mcsqueal deleting the marker) the moment the road is finished. Correctness during the danger window, full speed the rest of the time.

#### The consistency stance

Notice what Facebook did *not* build: they did not make every read globally strongly consistent (that would demand cross-continent coordination on every read — ruinously slow). They built a system that is **eventually consistent** with carefully **bounded, usually-tiny staleness**, plus targeted mechanisms (leases, remote markers) that eliminate the *specific* staleness scenarios users would actually notice, like not seeing their own just-posted comment. The paper reports that in practice the fraction of reads that are stale is very small. This is the whole philosophy in one sentence: **be as consistent as users can perceive, and no more, so you can stay fast and available.**

### A few more engineering details worth knowing

- **`mcrouter`** — the memcache routing layer that sits between clients and `memcached` servers. It coalesces the flood of connections (so a cache server sees a manageable number of TCP connections instead of one per web server), routes gets/sets/deletes, handles failover to Gutter, and fans out invalidations. Facebook later open-sourced `mcrouter` (around 2014) and it became a widely used piece of infrastructure in its own right.
- **Lossless restarts via shared memory.** Restarting a `memcached` to deploy new software would normally wipe its RAM cache — a cold restart that stampedes the database. Facebook stores the cache in a **System V shared memory** region so the data *survives* the process restarting. The new binary re-attaches to the still-warm memory. Upgrades without a cold cache.
- **Adaptive slab allocator.** `memcached` manages memory in fixed-size "slab classes" (buckets of pre-sized chunks) to avoid fragmentation. Facebook made it **adaptive** — it rebalances memory between slab classes based on the observed workload, so a shift in item sizes doesn't waste memory or cause needless evictions.
- **The scale, in the paper's own words.** The system is built to handle, in the paper's phrasing, "billions of requests per second" and hold "trillions of items." Those two numbers are the whole reason every mechanism above had to exist.

---

## How to implement it

You won't rebuild Facebook's stack, but you *can* build the core patterns in TypeScript and feel exactly why each piece exists. We'll go incrementally: naive look-aside → delete-on-write → thundering-herd protection with a lease. Everything below is runnable Node/TypeScript with a mock cache and DB.

### Step 0 — the pieces we're modeling

```typescript
// A stand-in for a single memcached server: just a Map, plus TTL support.
class MockMemcached {
  private store = new Map<string, { value: unknown; expiresAt: number }>();

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;              // MISS
    if (Date.now() > entry.expiresAt) {        // expired -> treat as MISS
      this.store.delete(key);
      return undefined;
    }
    return entry.value as T;                    // HIT
  }

  set(key: string, value: unknown, ttlMs = 60_000): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  delete(key: string): void {
    this.store.delete(key);                     // idempotent: deleting twice is fine
  }
}

// A stand-in for the slow, authoritative source of truth.
class MockDatabase {
  private rows = new Map<string, unknown>();

  async query<T>(key: string): Promise<T> {
    await sleep(50);                            // pretend the DB is slow (50ms)
    return this.rows.get(key) as T;
  }

  async write(key: string, value: unknown): Promise<void> {
    await sleep(50);
    this.rows.set(key, value);
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
```

### Step 1 — the naive look-aside cache (read + write)

This is the whole skeleton from the "What it is" section, in code.

```typescript
const cache = new MockMemcached();
const db = new MockDatabase();

async function read<T>(key: string): Promise<T> {
  const cached = cache.get<T>(key);
  if (cached !== undefined) return cached;      // HIT — fast path

  // MISS: go to the source of truth, then populate the cache on the way back.
  const value = await db.query<T>(key);
  cache.set(key, value);
  return value;
}

async function write(key: string, value: unknown): Promise<void> {
  await db.write(key, value);                    // 1. update source of truth FIRST
  cache.delete(key);                             // 2. INVALIDATE (delete, not set)
}
```

Two things to internalize here, both explained earlier:

- The write updates the **database first**, *then* touches the cache. If you invalidated the cache first and then wrote the DB, a reader could sneak in between, miss, read the *old* DB value, and re-cache the stale value — reintroducing exactly the staleness you were trying to remove.
- The write **deletes**; it does not set the new value. Idempotent and always refilled from the authoritative source. (Re-read the "Why write = delete" section if this feels arbitrary — it's the keystone.)

### Step 2 — feel the thundering herd

Now simulate a hot key going cold and a thousand readers arriving at once.

```typescript
let dbReads = 0;
class CountingDatabase extends MockDatabase {
  async query<T>(key: string): Promise<T> {
    dbReads++;                                   // count how often we hit the DB
    return super.query<T>(key);
  }
}

// 1000 concurrent readers for the same missing key:
async function stampede() {
  const readers = Array.from({ length: 1000 }, () => read("hot:key"));
  await Promise.all(readers);
  console.log(`DB reads: ${dbReads}`);           // -> ~1000. The herd trampled the DB.
}
```

With the naive `read` from Step 1, all thousand readers miss at the same instant (none has finished caching yet) and all thousand hit the database. That's the stampede. Now we fix it with a lease.

### Step 3 — leases: one client fills, the rest wait

We add a lease registry to the cache. On a miss, only the *first* asker gets a lease (permission to fill); others are told to wait and retry.

```typescript
class LeasingMemcached extends MockMemcached {
  private leases = new Map<string, number>();    // key -> lease token
  private nextToken = 1;

  // Returns either a HIT, or a MISS carrying a lease decision.
  getWithLease<T>(key: string):
    | { status: "hit"; value: T }
    | { status: "miss"; lease: number }          // you are the filler
    | { status: "wait" }                         // someone else is already filling
  {
    const value = this.get<T>(key);
    if (value !== undefined) return { status: "hit", value };

    if (this.leases.has(key)) return { status: "wait" };   // herd control

    const token = this.nextToken++;
    this.leases.set(key, token);                 // hand this ONE caller the lease
    return { status: "miss", lease: token };
  }

  // A set only succeeds if the caller still holds a valid lease.
  setWithLease(key: string, value: unknown, lease: number, ttlMs = 60_000): boolean {
    if (this.leases.get(key) !== lease) return false;  // lease invalidated -> reject (stale-set guard)
    this.set(key, value, ttlMs);
    this.leases.delete(key);
    return true;
  }

  // Any delete invalidates the outstanding lease -> a racing set will be rejected.
  delete(key: string): void {
    super.delete(key);
    this.leases.delete(key);                     // this is what defeats the stale set
  }
}
```

Now the herd-safe read:

```typescript
const lcache = new LeasingMemcached();

async function readWithLease<T>(key: string): Promise<T> {
  for (;;) {
    const r = lcache.getWithLease<T>(key);
    if (r.status === "hit") return r.value;

    if (r.status === "wait") {                   // someone else is filling — back off and retry
      await sleep(5);
      continue;                                  // likely a HIT next time around
    }

    // status === "miss": we hold the lease, we are responsible for filling.
    const value = await db.query<T>(key);
    lcache.setWithLease(key, value, r.lease);    // rejected automatically if invalidated meanwhile
    return value;
  }
}
```

Re-run the 1000-reader stampede against `readWithLease`: the first reader gets the lease and does the single DB query; the other 999 get `wait`, back off, and by their retry the key is filled — so they get hits. **DB reads collapse from ~1000 to ~1.** That is the thundering-herd fix, and the same `delete`-invalidates-the-lease line also blocks the stale-set race from Step "How it works." One small token, both problems.

### What this toy leaves out (and the paper doesn't)

Everything *distributed*: consistent-hashing the keys across many servers, UDP-vs-TCP transport choices, incast windowing, Gutter failover, cross-cluster `mcsqueal` invalidation, regional pools, and cross-region remote markers. The point of the toy is to make the two hardest *local* ideas — look-aside with delete-on-write, and leases — concrete in your hands. The distributed pieces are variations layered on top of exactly this core.

---

## Trade-offs, when to use, and pitfalls

**When to reach for a look-aside cache like this:**

- **Read-heavy** workloads where the same data is read far more than it's written (the classic social/web profile of ~100:1 reads:writes).
- Data that is **expensive to compute or fetch** but **tolerant of small staleness** — a like count, a rendered profile, a feed fragment. If a value is briefly a few seconds old, nobody is harmed.
- When you need to **scale reads horizontally** and independently of your database.

**When NOT to:**

- **Strong-consistency / correctness-critical** data — account balances, inventory decrements, anything where a stale read causes real harm (double-spend, oversell). Memcache's whole design *accepts* bounded staleness; don't put money in it without additional guarantees.
- **Write-heavy** or **rarely-re-read** data, where the cache is churned or invalidated so fast it barely earns a hit. You pay the invalidation and consistency complexity for little benefit.
- When the working set is small enough that your database's own buffer cache already serves reads from RAM — adding memcache is then just complexity.

**Common mistakes and gotchas:**

- **Setting on write instead of deleting.** The tempting "optimization" of writing the new value straight into the cache reintroduces the stale-set race. Delete; let the next reader refill from truth. (Keystone idea.)
- **Invalidating the cache *before* writing the DB.** A reader can slip into the gap, miss, read the old DB value, and re-cache stale data. Always: **write DB, then invalidate.**
- **No thundering-herd protection.** A single hot key expiring can stampede your database into the ground. Use leases, request coalescing, or a "single-flight" lock so only one filler goes to the DB per key.
- **Rehashing failed servers' keys onto healthy ones.** This spreads load and can cascade failures across the tier. Use dedicated failover capacity (Gutter) that absorbs a failed server's load without overloading the survivors.
- **Forgetting cross-region replication lag.** In a multi-region setup, reading your own just-made write from a lagging replica shows the user stale data (their comment "disappears"). You need a remote-marker-style mechanism to route those reads to the source of truth during the replication window.
- **Mixing high-churn and low-churn keys in one pool.** The busy keys evict the valuable ones. Partition into pools by access pattern.
- **Treating the cache as durable.** It isn't. It can vanish (crash, restart, eviction) at any moment; the database must always remain the source of truth, and the system must be correct when the cache is empty.

---

## 🧠 Q&A Bank

**1. What is the difference between `memcached` (lowercase) and `Memcache` (capital)?**
`memcached` is the original single-machine, in-memory key-value cache daemon (created by Brad Fitzpatrick in 2003 for LiveJournal). `Memcache` is Facebook's *distributed system* built from thousands of `memcached` instances plus surrounding software — clients, routing, failover pools, and an invalidation pipeline — that makes those independent caches behave as one coherent, fault-tolerant, planet-scale cache. The paper is about the second thing.

**2. What does "look-aside, demand-filled" mean?**
*Look-aside* means the application talks to the cache and the database separately and orchestrates both itself — it looks *aside* to the cache first, and on a miss goes to the DB itself and populates the cache. The cache never talks to the DB. *Demand-filled* means the cache isn't preloaded; it fills lazily on the first miss for a key, learning the hot set from real traffic.

**3. On a write, why does memcache *delete* the key instead of *setting* the new value?**
Two reasons. (1) `delete` is **idempotent** — safe to retry, duplicate, and reorder, which matters in a distributed system where messages do all three — whereas `set` is order-sensitive and a late `set` can clobber a newer value. (2) Deleting forces the next reader to refill from the **authoritative database**, so the cache is never populated with a possibly-stale value from a racing writer. The cost is one extra miss, which Facebook judged well worth the correctness and simplicity.

**4. Leases solve two different problems with one mechanism. What are they, and how?**
(a) **Stale sets:** any `delete(k)` invalidates the outstanding lease for `k`, so if the underlying data changed while a client was fetching, that client's later `set` (carrying the now-invalid lease) is *rejected* — the stale value never lands. (b) **Thundering herds:** `memcached` hands out a lease for a hot key only once every ~10 seconds; the first misser gets it and fills the key, while every other misser is told to *wait and retry* (and gets a hit on retry). One DB read instead of thousands.

**5. Why use UDP for gets but TCP for sets and deletes?**
A lost or reordered get can simply be treated as a **cache miss** — an already-handled, cheap event — so gets use connectionless, low-overhead **UDP** for speed (crucial given all-to-all communication). Sets and deletes *must* be reliable — a lost delete leaves stale data in the cache forever — so they use **TCP**. The principle: match the transport to the cost of losing the message.

**6. What is incast congestion and how does Facebook control it?**
With all-to-all communication and batched requests, a client fires many requests at once and all the replies return *simultaneously*, overwhelming its network link and causing drops and retries. Facebook limits the number of **outstanding (in-flight) requests** via a **sliding window** (analogous to TCP's congestion window), so responses arrive at a rate the client can absorb.

**7. What problem do Gutter servers solve, and why not just rehash a dead server's keys onto the survivors?**
When a `memcached` server dies, its keys would all miss and stampede the database. **Gutter** is a small pool of idle standby servers that temporarily take over a *failed* server's requests (with short TTLs). Rehashing onto surviving servers is dangerous because it piles extra load on them and can **cascade** the failure through the tier; Gutter absorbs the load without overloading the healthy servers.

**8. Within a region, how are cache invalidations propagated to every cluster reliably?**
Via **mcsqueal**: a daemon on the database servers that **tails the MySQL commit log**, extracts the affected cache keys from committed writes, and broadcasts batched `delete` invalidations to all clusters' memcache tiers (through `mcrouter`). Because it reads the *commit* log, it only invalidates for changes that truly committed. This is the **Change Data Capture (CDC)** pattern: derive side-effects from the database's own durable log of truth rather than trusting app code to emit them.

**9. What is the cross-region stale-read hazard, and how do remote markers fix it?**
Only the master region is writable, and replica databases *lag*. A user in a replica region writes (to the master) then immediately reads locally from the *not-yet-updated* replica — getting, and caching, stale data (their write seems to vanish). The fix: on write, set a **remote marker** `r_k` locally; on a read miss, if `r_k` exists, route the read to the **master region** (fresh data) instead of the stale local replica. The invalidation pipeline deletes `r_k` once replication catches up, after which reads go local again. Correctness during the danger window, full speed afterward.

**10. What consistency model did Facebook choose, and why?**
**Eventual consistency with bounded, usually-tiny staleness** — deliberately *not* strong global consistency. Strong consistency would require cross-continent coordination on reads, which is ruinously slow. They instead keep the system fast and available and add targeted mechanisms (leases, remote markers) to kill the *specific* staleness cases users would actually notice. Stated as a principle: be as consistent as users can perceive, and no more.

**11. (Why-question) Why do multiple smaller clusters exist within a region instead of one enormous cluster?**
A single cluster has diminishing returns as it grows: all-to-all networking, incast risk, and failure blast-radius all worsen with size. Several smaller, independently manageable clusters are more robust — at the cost of a new problem (keeping the *same* key consistent across each cluster's independent memcache), which mcsqueal-driven invalidation solves.

**12. (What-happens-if) What happens if you invalidate the cache *before* writing the database?**
You open a race: between the invalidation and the DB write, a reader can miss, read the *old* value from the DB, and re-cache it — leaving stale data in the cache after your write completes. Correct order is **write the database first, then invalidate the cache**, so any refill happens from already-updated truth.

**13. (History) Where did `memcached` come from, and what pain did it address?**
Brad Fitzpatrick created it in **2003** for **LiveJournal** (Danga Interactive), which was hitting the database wall: a read-heavy site sending every read through MySQL's expensive transactional engine. memcached is a deliberately dumb, in-memory, single-machine hash table that answers reads from RAM in microseconds, offloading the database. Facebook later scaled that single-machine idea into a distributed system — the subject of this paper.

---

## 🛠️ Hands-on Exercise

**Goal:** Extend the Step-3 `LeasingMemcached` toy into a **two-cluster** simulation with a working invalidation broadcast — a miniature of the region-level problem.

Build:

1. Two independent `LeasingMemcached` instances, `clusterA` and `clusterB`, both fronting **one** shared `MockDatabase`.
2. A tiny `read(cluster, key)` and `write(key, value)` where `write` updates the DB and then must invalidate the key in **both** clusters (your stand-in for `mcsqueal` broadcasting the delete everywhere).
3. A test that: caches `k` in *both* clusters (read it through each), then does a `write(k, newValue)`, then reads `k` from each cluster again and asserts **both** return the new value.

**Then break it on purpose:** make `write` invalidate only `clusterA`. Read `k` from `clusterB` and watch it serve the **stale** value. That failing read is *exactly* the region-consistency problem mcsqueal exists to prevent — feeling it fail firsthand is the point.

**Hint:** you don't need real networking; a shared array of cluster references that `write` loops over to call `.delete(key)` on each is enough to model the broadcast. The lesson is in *who has to be told* when data changes, and what goes wrong when someone is missed.

---

## ✅ Recap

- **Memcache = thousands of dumb single-machine `memcached` caches + a lot of smart glue.** The research isn't the cache; it's the machinery that makes ten thousand caches act as one, stay available while machines die, and stay *consistent enough* across the planet.
- **Look-aside with delete-on-write is the keystone.** Read: check cache, on miss fill from DB. Write: update DB first, then *delete* (not set) the key — because deletes are idempotent and force refills from authoritative truth.
- **Leases are the elegant core mechanism:** one 64-bit token, threaded through the miss path, simultaneously blocks stale sets (a delete invalidates the lease) and tames thundering herds (one lease per hot key per ~10s funnels the stampede into a single DB read).
- **Failure and consistency are handled with targeted, pragmatic tools:** Gutter for server failover without cascades, mcsqueal (Change Data Capture off the MySQL binlog) for regional invalidation, and remote markers for read-your-own-write across regions.
- **The governing philosophy is "consistent enough, always fast, always available."** Facebook chose bounded, usually-tiny staleness over strong global consistency, then surgically eliminated the staleness cases users would actually notice.

---

## 📎 Primary source (optional)

The lesson above is complete on its own; nothing here is required to understand the topic. For a reader who wants to see the original with their own eyes:

- Rajesh Nishtala et al., **"Scaling Memcache at Facebook,"** *Proceedings of the 10th USENIX Symposium on Networked Systems Design and Implementation (NSDI '13)*, 2013.
- Brad Fitzpatrick, **"Distributed Caching with Memcached,"** *Linux Journal*, 2004 — the original write-up of the single-machine `memcached` that Facebook later scaled.
