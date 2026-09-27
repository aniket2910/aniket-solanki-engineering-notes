# 🔄 How an LLM App Works (The Big Picture)

Almost every AI feature you'll ever build — chatbot, RAG search, coding copilot, autonomous agent — is a variation of **one core loop**. Learn it once and everything else is just adding pieces to it.

---

## 🧩 The core loop

```
User input
   │
   ▼
Build a prompt  ──►  Send to LLM API  ──►  Model generates a response
   ▲                                              │
   │                                              ▼
(optionally) add context, tools, memory     Show / use the response
```

That's it. The entire field is elaborations on this loop.

---

## 🏗️ The four building blocks

**1. The Prompt (input).** Text you send to the model. It usually has a *system* part ("You are a helpful support agent") and a *user* part (the actual question). Chapter 03 is all about crafting this well.

**2. The Model (the brain).** A hosted API (OpenAI, Anthropic) or a local model (Ollama) that reads your prompt and predicts the response, one token at a time. Chapters 01–02.

**3. The Response (output).** Text back from the model. It might be a plain answer, structured JSON, or a request to call one of your tools. Non-deterministic: the same prompt can give slightly different answers.

**4. The Context (the secret sauce).** The model only knows what's in the prompt. To make it useful for *your* problem, you stuff relevant information into the prompt before sending it — recent chat history (memory), retrieved documents (RAG), or tool results (agents). Chapters 06–07.

---

## 🍳 The Analogy: A Brilliant Chef with Amnesia

Picture a world-class chef who is a genius in the kitchen but **forgets everything the moment a dish is done**. Every single order, you must hand them a note containing:

- Who they are today ("You're a vegan pastry chef") — the **system prompt**.
- What the customer wants ("gluten-free chocolate cake") — the **user prompt**.
- Any relevant facts they can't know ("this customer is allergic to nuts") — the **context / RAG**.
- What tools they may use ("here's the oven and the pantry") — the **tools**.

The chef is brilliant, but only as good as the note you hand them. **Your job as an AI Engineer is writing that note perfectly, every time.** This "amnesia" is why context, memory, and retrieval matter so much — the model remembers *nothing* between calls.

---

## 📬 A concrete request, start to finish

Say you're building a docs assistant. A user asks *"How do I reset my password?"*:

1. **Receive** the question in your backend.
2. **Retrieve** the 3 most relevant help-doc chunks from a vector database (RAG — Chapter 06).
3. **Build the prompt**: system instructions + the retrieved chunks + the user's question.
4. **Call the model** and stream the answer back.
5. **Return** the response to the UI, maybe with a "sources" link.

Notice how little of this is "AI" — most of it is ordinary backend engineering. That's the point.

---

## ✅ Key takeaways

- Every AI app is the same loop: **input → build prompt → model → response**.
- The model has **amnesia** — it only knows what's in the current prompt.
- "Making it smart about your problem" = **putting the right context into the prompt.**

---

## 🔗 Go deeper

- **[OpenAI — Text generation & prompting](https://platform.openai.com/docs/guides/text)**
- **[Anthropic — How Claude works / messages](https://docs.anthropic.com/en/docs/build-with-claude/overview)**
