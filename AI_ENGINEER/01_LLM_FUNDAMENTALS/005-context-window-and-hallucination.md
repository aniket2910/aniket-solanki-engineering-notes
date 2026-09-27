# 🪟 Context Windows & Why Models Hallucinate

Two limitations shape almost every design decision you'll make: the model's **context window** (how much it can "see" at once) and its tendency to **hallucinate** (confidently state false things). Understanding both lets you design around them instead of being surprised by them.

---

## 🪟 The Context Window

The **context window** is the maximum number of tokens the model can consider in a single request — **prompt + response combined**. Think of it as the model's short-term working memory.

- Modern models range from ~8K to over 1,000,000 tokens (e.g. GPT-4o ≈ 128K, Claude ≈ 200K, Gemini ≈ 1M+).
- Everything must fit: system prompt + chat history + retrieved documents + the new question + room for the answer.
- Go over the limit → API error or silently dropped content.

**The Analogy:** the context window is a **desk**, not a filing cabinet. The model can only work with what's physically on the desk right now. A bigger desk (larger window) helps, but it's still finite — and a cluttered desk (irrelevant stuff crammed in) actually *hurts* performance.

---

## 🧹 "Lost in the middle" — bigger isn't automatically better

Even with a huge window, models pay **most attention to the beginning and end** of the context and can miss facts buried in the middle. So:

- Don't just dump 100 documents in and hope. **Retrieve the few most relevant ones** (that's RAG).
- Put the most important instructions **at the start or the very end**.
- More context also means more cost and latency. Lean is better.

---

## 🧠 The amnesia problem (again)

The model remembers **nothing** between API calls. A chatbot "remembers" your earlier messages only because your code **resends the whole conversation** in the next request. When the conversation gets too long for the window, you must **summarize or trim** old messages — this is called *memory management*, and you build it yourself.

---

## 🤥 Why models hallucinate

A **hallucination** is when the model states something false with total confidence — a fake citation, a non-existent API method, a made-up statistic. It's not lying; it's doing exactly what it was built to do: **produce plausible-sounding text.** When it doesn't know something, "plausible" and "true" diverge, and it fills the gap with something that *fits the pattern* rather than admitting ignorance.

Common triggers:

- Asking about **facts outside its training data** (recent events, your private data).
- Asking for **specific details it never learned** (exact numbers, URLs, citations).
- **Knowledge cutoff**: the model's training stopped on a certain date; ask about anything after and it may confidently guess.

---

## 🛡️ How AI Engineers reduce hallucination

This is a huge part of the job. The main levers:

1. **Give it the facts (RAG).** If the answer is in the prompt, it doesn't have to guess. Biggest lever by far.
2. **Let it say "I don't know."** Explicitly instruct: *"If the answer isn't in the provided context, say you don't know."*
3. **Lower the temperature** for factual tasks.
4. **Ask for sources / citations** and verify them programmatically.
5. **Keep humans in the loop** for high-stakes outputs.

You will never get hallucinations to exactly zero — you **design the product to tolerate and catch them.**

---

## ✅ Key takeaways

- The **context window** is finite working memory: prompt + response must fit.
- Bigger windows still suffer **"lost in the middle"** — retrieve *relevant* context, don't dump.
- Models **hallucinate** because they generate *plausible*, not *verified*, text.
- The #1 defense is **RAG** — put the real facts in the prompt.

---

## 🔗 Go deeper

- **[Anthropic — Reduce hallucinations](https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)**
- **[Lost in the Middle (paper, readable abstract)](https://arxiv.org/abs/2307.03172)** — evidence for the middle-context blind spot.
