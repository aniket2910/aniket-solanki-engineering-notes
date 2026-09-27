# 🤖 AI Engineer Path

A structured, self-paced notebook for becoming an **AI Engineer** — the person who *builds applications on top of existing AI models* (LLMs like GPT, Claude, Gemini) rather than training models from scratch.

This path follows the [roadmap.sh AI Engineer roadmap](https://roadmap.sh/ai-engineer), rewritten in plain language with real-world analogies and **runnable TypeScript / JavaScript examples** — the same stack you already use.

---

## 🎯 Who this is for

You are a working JavaScript/React engineer who wants to build AI-powered features and products (chatbots, RAG search, agents, copilots) **without** a PhD in machine learning. AI Engineering is an *applied* discipline: you treat the model as a smart API and focus on wiring, prompting, retrieval, tools, and shipping.

---

## 🗺️ The Roadmap at a Glance

Work through these in order. Each chapter has its own `README.md` index with individual lessons.

| # | Chapter | What you'll be able to do |
| :--- | :--- | :--- |
| 00 | **[Introduction](./00_INTRODUCTION/README.md)** | Understand what an AI Engineer is, how LLM apps are wired, and set up your environment |
| 01 | **[LLM Fundamentals](./01_LLM_FUNDAMENTALS/README.md)** | Explain tokens, inference, context windows, temperature, and why models hallucinate |
| 02 | **[Model Providers](./02_MODEL_PROVIDERS/README.md)** | Call OpenAI, Anthropic, and run open models locally; pick the right model for a job |
| 03 | **[Prompt Engineering](./03_PROMPT_ENGINEERING/README.md)** | Write reliable prompts, few-shot, chain-of-thought, and force structured JSON output |
| 04 | **[Embeddings](./04_EMBEDDINGS/README.md)** | Turn text into vectors and measure semantic similarity |
| 05 | **[Vector Databases](./05_VECTOR_DATABASES/README.md)** | Store and search embeddings at scale (pgvector, Pinecone, Chroma, Qdrant) |
| 06 | **[RAG](./06_RAG/README.md)** | Build retrieval-augmented apps that answer questions over your own data |
| 07 | **[AI Agents](./07_AI_AGENTS/README.md)** | Give models tools/function-calling and build agent loops that act, not just chat |
| 08 | **[Multimodal AI](./08_MULTIMODAL_AI/README.md)** | Work with images, audio, and speech (vision, TTS/STT, image generation) |
| 09 | **[AI Safety & Ethics](./09_AI_SAFETY_ETHICS/README.md)** | Defend against prompt injection, protect PII, and add guardrails |
| 10 | **[Dev Tools & Frameworks](./10_DEV_TOOLS_FRAMEWORKS/README.md)** | Use the Vercel AI SDK, LangChain.js, and evaluate/observe your app |
| 11 | **[Deployment](./11_DEPLOYMENT/README.md)** | Ship LLM apps: streaming, caching, cost control, and monitoring |

---

## 📈 Suggested Learning Order

1. **Chapters 00–03 are the non-negotiable core.** After these you can already build a useful chatbot or copilot.
2. **Chapters 04–06 (Embeddings → Vector DBs → RAG) are one connected story.** Learn them together — RAG is the single most in-demand AI Engineering skill in 2026.
3. **Chapter 07 (Agents)** is where the field is heading; do it once RAG clicks.
4. **Chapters 08–11** are "as needed" — pull them in when a project requires vision, safety hardening, a framework, or production deployment.

---

## 🧰 What you need before starting

- **Node.js 18+** and **TypeScript** (you already have this).
- An **OpenAI** or **Anthropic** API key (a few dollars of credit is plenty for the whole path).
- Optional but recommended: **[Ollama](https://ollama.com)** to run open models locally for free.

Detailed setup is in **[00_INTRODUCTION → Prerequisites & Setup](./00_INTRODUCTION/004-prerequisites-and-setup.md)**.

---

## ✅ Progress Tracker

| Chapter | Status |
| :--- | :---: |
| 00 Introduction | 🟢 Ready |
| 01 LLM Fundamentals | 🟢 Ready |
| 02 Model Providers | ⚪ Index ready, lessons pending |
| 03 Prompt Engineering | ⚪ Index ready, lessons pending |
| 04 Embeddings | ⚪ Index ready, lessons pending |
| 05 Vector Databases | ⚪ Index ready, lessons pending |
| 06 RAG | ⚪ Index ready, lessons pending |
| 07 AI Agents | ⚪ Index ready, lessons pending |
| 08 Multimodal AI | ⚪ Index ready, lessons pending |
| 09 AI Safety & Ethics | ⚪ Index ready, lessons pending |
| 10 Dev Tools & Frameworks | ⚪ Index ready, lessons pending |
| 11 Deployment | ⚪ Index ready, lessons pending |

---

## 📚 The one resource to bookmark

If you read nothing else, keep these open as you go:

- **[OpenAI Platform Docs](https://platform.openai.com/docs)** — the reference you'll return to daily.
- **[Anthropic Docs](https://docs.anthropic.com)** — Claude API, prompt engineering, and agent guides.
- **[roadmap.sh/ai-engineer](https://roadmap.sh/ai-engineer)** — the visual roadmap this notebook is built from.
