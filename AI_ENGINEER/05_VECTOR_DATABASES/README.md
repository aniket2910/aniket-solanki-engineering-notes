# 🗄️ 05 · Vector Databases

Once you can turn text into embeddings, you need somewhere to **store millions of them and search by similarity fast**. That's a vector database. It answers "find me the chunks most similar to this query" in milliseconds.

---

## 📂 Lessons (coming next)

| ID | Lesson | Key ideas |
| :--- | :--- | :--- |
| `001` | What & Why | Similarity search at scale, ANN indexes |
| `002` | The Landscape | pgvector, Pinecone, Chroma, Qdrant, Weaviate — how to choose |
| `003` | Hands-on in TypeScript | Store & query vectors end-to-end |

---

## 🎯 Goal of this chapter

Load a handful of documents, embed them, store them, and retrieve the closest matches to a query — the "retrieval" half of RAG.

---

## 🧭 Quick guidance

- Already use **Postgres**? Start with **[pgvector](https://github.com/pgvector/pgvector)** — no new infra.
- Want zero-setup for learning? **[Chroma](https://www.trychroma.com)** runs locally in minutes.
- Need managed scale? **[Pinecone](https://www.pinecone.io)** or **[Qdrant](https://qdrant.tech)**.

---

## 🔗 Best resources

- **[Pinecone — Vector DB learning center](https://www.pinecone.io/learn/vector-database/)**
- **[pgvector README](https://github.com/pgvector/pgvector)**
