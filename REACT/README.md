# ⚛️ React — Deep-Dive Notes

First-principles, textbook-style deep dives into how React actually works under the hood — the kind of understanding you'd have if you'd watched the ideas get invented. Each chapter is self-contained: read only these pages and you'll understand the topic completely, from its historical origin through to hands-on implementation.

---

## 📂 Chapters

| Chapter | Topic | What you'll understand |
| :--- | :--- | :--- |
| `01` | [Reconciliation & the Fiber Architecture](./01_RECONCILIATION_AND_FIBER/) | React's core rendering algorithm: how it diffs trees in O(n), why Fiber made rendering interruptible, and how scheduling/concurrency decides what renders first |

More chapters get added here as the track grows.

---

## 🧭 How to read these

Start at chapter `01`, lesson `001`, and go in order — later lessons build on earlier ones. Every lesson follows the same shape: the core question → the origin story (where the idea came from and why) → what it is → how it works under the hood → how to implement it → trade-offs → a Q&A bank for active recall → a hands-on exercise.
