# 🚢 11 · Deployment

Getting an AI feature into production is mostly ordinary backend engineering with a few AI-specific twists: **streaming responses, controlling cost, caching, rate limits, and monitoring** a non-deterministic system.

---

## 📂 Lessons (coming next)

| ID | Lesson | Key ideas |
| :--- | :--- | :--- |
| `001` | Serving LLM Apps | Serverless/edge functions, streaming to the browser |
| `002` | Cost, Caching & Rate Limits | Prompt caching, retries/backoff, budgets, token limits |
| `003` | Monitoring in Production | Logging, tracing, evals, catching quality regressions |

---

## 🎯 Goal of this chapter

Ship an AI endpoint that **streams** responses, handles provider errors and rate limits gracefully, and logs enough to debug and control spend.

---

## 🧭 AI-specific things that bite you in prod

- **Latency** — responses take seconds; **stream** them so the UX feels instant.
- **Cost** — a viral feature can run up a huge bill fast; set **hard token/spend limits**.
- **Rate limits** — providers throttle you; implement **retries with backoff**.
- **Non-determinism** — the same input can change output after a model update; **log and eval** continuously.

---

## 🔗 Best resources

- **[Vercel — Streaming AI responses](https://ai-sdk.dev/docs/ai-sdk-ui/streaming-data)**
- **[OpenAI — Production best practices](https://platform.openai.com/docs/guides/production-best-practices)**
- **[Anthropic — Prompt caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)**
