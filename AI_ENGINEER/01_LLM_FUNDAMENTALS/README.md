# 🧠 01 · LLM Fundamentals

Just enough theory to make good engineering decisions — no math, no training loops. You'll understand *why* models cost what they cost, why they forget, and why they sometimes confidently make things up.

---

## 📂 Lessons

| ID | Lesson | Key ideas |
| :--- | :--- | :--- |
| `001` | [What is an LLM](./001-what-is-an-llm.md) | Next-token prediction, why it feels intelligent |
| `002` | [Tokens & Tokenization](./002-tokens-and-tokenization.md) | Tokens, why they matter for cost & limits |
| `003` | [Inference & Sampling Parameters](./003-inference-and-parameters.md) | temperature, top_p, max_tokens, stop |
| `004` | [Training, Fine-tuning & RAG](./004-training-finetuning-rag.md) | The three ways to "teach" a model, and when to use each |
| `005` | [Context Windows & Why Models Hallucinate](./005-context-window-and-hallucination.md) | Limits, knowledge cutoff, hallucination causes |

---

## 🎯 Goal of this chapter

You should be able to answer: *"What is a token, what's a context window, what does temperature do, and why did the model just invent a fake citation?"* — because every one of those affects how you build.

---

## 🔗 Best resource for this chapter

- **[3Blue1Brown — But what is a GPT? (video)](https://www.youtube.com/watch?v=wjZofJX0v4M)** — the clearest visual explanation of how LLMs work. Watch it once; you don't need the math.
