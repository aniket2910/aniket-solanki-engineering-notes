# 🎓 Training, Fine-tuning & RAG — The Three Ways to "Teach" a Model

A model ships knowing a lot, but not *your* stuff — your docs, your product, your customer's order history. There are three ways to give it knowledge, and **choosing correctly saves you enormous time and money.** Beginners reach for the expensive option; experts almost always reach for the cheap one.

---

## 🏫 The three levels

| Method | What it is | Cost / effort | When to use |
| :--- | :--- | :--- | :--- |
| **Pre-training** | Building the base model from trillions of tokens | Millions of dollars, months | Never — you're not doing this |
| **Fine-tuning** | Further-training an existing model on your examples | Moderate; needs data + ML ops | Change *style/behavior*, not facts |
| **RAG / Prompting** | Put the right info *in the prompt* at request time | Cheap, instant, no training | 90% of real needs — **start here** |

---

## 🧠 The Analogy: Teaching a New Employee

Imagine onboarding a brilliant new hire (the base model) who knows the industry but nothing about *your* company:

- **Pre-training** = the 20 years of general education they already had before you hired them. You didn't pay for it and can't redo it.
- **Fine-tuning** = sending them to a months-long intensive course to change *how they work* — e.g. always write in your brand's voice, always format tickets a certain way. It reshapes *habits and style*, and it's a real investment.
- **RAG** = handing them the relevant file folder right before each meeting. Instant, cheap, and they can answer questions about documents they've never seen — because you just gave them the document.

If a new hire keeps getting a *fact* wrong, you don't send them to a 3-month course — you **hand them the correct document**. Same with models: for facts, use RAG, not fine-tuning.

---

## 🎯 The decision rule (memorize this)

- Need the model to **know new facts / your data**? → **RAG** (Chapter 06). Facts change; keep them out of the weights.
- Need the model to **behave/format/speak differently**, consistently? → **Fine-tuning**.
- Just need a better answer right now? → **Better prompting** (Chapter 03).

A huge share of "we need to fine-tune / train our own model" instincts are wrong — the real fix is RAG or a better prompt. Reaching for training first is the classic beginner mistake.

---

## 🔧 What fine-tuning actually looks like

You provide a dataset of example input→output pairs (hundreds to thousands), and the provider produces a customized model version. Good for: a consistent tone, a niche output format, or squeezing quality out of a smaller/cheaper model for a narrow task. Bad for: teaching facts (they go stale and it's unreliable).

---

## ✅ Key takeaways

- Three ways to add knowledge: **pre-training (not you), fine-tuning (behavior), RAG/prompting (facts)**.
- **Default to RAG and prompting.** They're cheap, instant, and cover most needs.
- Fine-tune to change **how** the model responds, not **what facts** it knows.

---

## 🔗 Go deeper

- **[OpenAI — Fine-tuning guide](https://platform.openai.com/docs/guides/fine-tuning)** (note *when they recommend RAG instead*).
- **[Anthropic — When to use RAG vs fine-tuning](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)**
