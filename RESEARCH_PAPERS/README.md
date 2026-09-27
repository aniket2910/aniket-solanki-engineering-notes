# 📚 Research Papers — Deep Dives

A shelf of the **great systems & CS papers**, each rewritten as a self-contained, first-principles lesson: the history and the thinking that produced it → the pain it solved → what it is → how it works under the hood → how to implement the core idea → a Q&A bank and a hands-on exercise. You should be able to *understand a paper completely from its note here*, without opening the original.

These are not summaries or link dumps. Each note is a full textbook chapter that traces the idea back to its roots and rebuilds it from nothing.

---

## 🗂️ How this folder is organized (the filing rubric)

Papers are grouped into **numbered category chapters**, each with its own `README.md` index and numbered `NNN-paper-slug.md` lessons — same shape as the other tracks in this repo.

When a new paper deep-dive is written, it is filed into the category that best matches its *primary contribution*. The categories:

| # | Category | What belongs here | Example papers |
| :--- | :--- | :--- | :--- |
| 01 | **[Distributed Systems](./01_DISTRIBUTED_SYSTEMS/README.md)** | Making many machines act as one: caching, sharding, replication, failure handling, consistency | Scaling Memcache, Dynamo, Spanner, Chubby, ZooKeeper |
| 02 | **Storage & Databases** *(created when first paper lands)* | On-disk & in-memory data stores, indexing, transactions, query engines, file systems | Bigtable, GFS, LSM-trees, Aurora, the C-Store/column-store papers |
| 03 | **Consensus & Coordination** | Agreement under failure: how nodes decide, elect, and stay in sync | Paxos, Raft, Viewstamped Replication, PBFT |
| 04 | **Data Processing & Streaming** | Batch and stream computation over huge datasets | MapReduce, Dremel, Kafka, Spark/RDDs, Dataflow |
| 05 | **ML & AI Systems** | Systems that train/serve models, and landmark model/architecture papers | Attention Is All You Need, TensorFlow, Parameter Server, GPipe |
| 06 | **Networking & OS** | The layers underneath: protocols, scheduling, virtualization, the kernel | TCP congestion control, Borg, Xen, the End-to-End Arguments |

Higher-numbered categories are created lazily — a new chapter folder appears the first time a paper needs it.

### Where does a new paper go? (my decision procedure)

When Aniket asks for a deep dive on a single paper/topic, this is how the destination is chosen:

1. **If it clearly fits one category above** (by its *primary* contribution, not a side-topic), it's filed there without asking — e.g. *Raft* → 03, *MapReduce* → 04, *GFS* → 02.
2. **If it genuinely spans two** (e.g. Spanner = storage + consensus + distribution), it's placed under the one matching its *headline* idea and cross-linked from the other's README.
3. **If it fits none, or is ambiguous,** Aniket is asked where to keep it — and a **new numbered category** is proposed if it warrants one.

This rubric exists precisely so that "write me notes on \<paper\>" rarely needs a follow-up question about *where*.

---

## ✅ Progress

| Category | Papers | Status |
| :--- | :--- | :---: |
| 01 Distributed Systems | Scaling Memcache at Facebook | 🟢 1 done |
| 02 Storage & Databases | — | ⚪ empty |
| 03 Consensus & Coordination | — | ⚪ empty |
| 04 Data Processing & Streaming | — | ⚪ empty |
| 05 ML & AI Systems | — | ⚪ empty |
| 06 Networking & OS | — | ⚪ empty |

---

## 🧭 How to read a note here

Every lesson follows the same spine, so you always know where you are:

**The Core Question** (the hook) → **The Origin Story** (history & who figured it out and why) → **Why it exists** (the pain) → **What it is** (definition + mental model + analogy) → **How it works** (the deep mechanism) → **How to implement it** (runnable TypeScript of the core idea) → **Trade-offs & pitfalls** → **🧠 Q&A Bank** → **🛠️ Hands-on Exercise** → **✅ Recap**.
