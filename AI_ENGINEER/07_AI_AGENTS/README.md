# 🕹️ 07 · AI Agents

An **agent** is an LLM that can *take actions*, not just talk. You give it **tools** (functions it can call — search the web, query a DB, send an email) and let it decide, step by step, which to use to accomplish a goal. This is where the industry is heading in 2026.

Do this chapter once RAG feels comfortable — agents build directly on tool-calling and retrieval.

---

## 📂 Lessons (coming next)

| ID | Lesson | Key ideas |
| :--- | :--- | :--- |
| `001` | What is an Agent | Reasoning + acting loops, autonomy levels |
| `002` | Tool / Function Calling | Letting the model call your TypeScript functions |
| `003` | The Agent Loop (ReAct) | Think → act → observe → repeat |
| `004` | Frameworks & Building One | LangGraph.js, the Vercel AI SDK agent, MCP |

---

## 🎯 Goal of this chapter

Build a small agent that, given a goal, calls one or more of *your* functions in a loop until it's done — the core pattern behind every copilot and autonomous assistant.

---

## 🧠 Mental model

A chatbot **answers**. An agent **gets things done** — it can look things up and act, then decide what to do next based on what it found. The loop (act → observe → decide again) is the whole idea.

---

## 🔗 Best resources

- **[Anthropic — Building effective agents](https://www.anthropic.com/research/building-effective-agents)** — the definitive practical guide.
- **[Vercel AI SDK — Agents](https://ai-sdk.dev/docs/foundations/agents)** — TypeScript.
- **[Model Context Protocol (MCP)](https://modelcontextprotocol.io)** — the emerging standard for tools.
