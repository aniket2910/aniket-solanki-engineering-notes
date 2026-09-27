# 📚 06 · RAG (Retrieval-Augmented Generation)

**The single most in-demand AI Engineering skill.** RAG lets a model answer questions about *your* data — internal docs, a product manual, a codebase — by retrieving the relevant pieces and putting them in the prompt. It's how you kill hallucinations and keep answers current without any training.

This chapter ties together everything from 04 (Embeddings) and 05 (Vector DBs).

---

## 📂 Lessons (coming next)

| ID | Lesson | Key ideas |
| :--- | :--- | :--- |
| `001` | What is RAG & Why | Grounding answers in real data |
| `002` | The RAG Pipeline | load → chunk → embed → store → retrieve → generate |
| `003` | Build a RAG App in TypeScript | End-to-end "chat with your docs" |
| `004` | Improving RAG | Chunking strategy, reranking, evaluation, citations |

---

## 🎯 Goal of this chapter

Build a working "chat with your documents" app, and know the levers to make its answers accurate and trustworthy.

---

## 🧠 The one-sentence mental model

RAG = **open-book exam.** Instead of forcing the model to memorize everything (and guess when it can't), you let it look up the relevant page right before answering.

---

## 🔗 Best resources

- **[Anthropic — RAG / Contextual retrieval](https://www.anthropic.com/news/contextual-retrieval)**
- **[Pinecone — RAG guide](https://www.pinecone.io/learn/retrieval-augmented-generation/)**
- **[Vercel AI SDK — RAG guide](https://ai-sdk.dev/docs/guides/rag-chatbot)** — TypeScript, end-to-end.
