# 🔤 Tokens & Tokenization

A **token** is the unit an LLM actually reads and writes. It's *not* a word and *not* a character — it's usually a chunk of a few characters. Understanding tokens is practical, not academic: **you are billed per token, and every model has a token limit.**

---

## 📏 The rough rule of thumb

- **1 token ≈ 4 characters of English ≈ ¾ of a word.**
- **100 tokens ≈ 75 words.**
- A typical page of text ≈ 500 tokens.

Common words are one token (`" the"`, `" cat"`). Rare or long words get split (`"tokenization"` → `token` + `ization`). Spaces and punctuation count too.

---

## 🧩 The Analogy: LEGO Bricks

The model can't work with your sentence directly, the same way you can't snap a picture of a house into a LEGO set. First everything is broken into **standard bricks (tokens)** the model knows. It builds meaning by arranging bricks, then hands you back a new arrangement of bricks, which get reassembled into readable text. `tokenization` isn't one brick — it's two bricks clicked together.

---

## 💸 Why you must care

**1. Cost.** Providers charge per 1,000 (or 1,000,000) tokens, separately for **input** (your prompt) and **output** (the response). A chatbot that resends the whole conversation each turn gets more expensive every message, because the input grows.

**2. Context limits.** Every model has a **context window** measured in tokens (e.g. 128K). Prompt + response must fit inside it. Stuff too much in and you get an error or truncation.

**3. Latency.** More output tokens = slower response. Asking for a 2,000-word essay literally takes longer than a 200-word one.

---

## 🧪 See tokens yourself in TypeScript

Use the `js-tiktoken` library (OpenAI's tokenizer) to count tokens before you send — useful for staying under limits and estimating cost.

```ts
// count-tokens.ts
import { encodingForModel } from "js-tiktoken";

const enc = encodingForModel("gpt-4o");

const text = "AI Engineering is mostly software engineering.";
const tokens = enc.encode(text);

console.log("Text:", text);
console.log("Token count:", tokens.length);      // e.g. 8
console.log("Token IDs:", tokens);               // [2020, 21005, ...]
```

Install: `npm install js-tiktoken`. For a visual playground, paste text into [platform.openai.com/tokenizer](https://platform.openai.com/tokenizer) and watch it split into colored chunks.

---

## 🌍 Gotcha: non-English and code cost more

English is the most "token-efficient" language because tokenizers were trained mostly on English. The same sentence in Hindi, Japanese, or emoji-heavy text can take **2–3× more tokens**. Code and JSON also tokenize less efficiently than prose. Budget accordingly.

---

## ✅ Key takeaways

- A token ≈ **4 chars / ¾ of a word**; it's the billing and limit unit.
- You pay separately for **input and output** tokens.
- Long conversations grow the input every turn — watch the cost.
- Count tokens with **`js-tiktoken`** or the OpenAI tokenizer playground.

---

## 🔗 Go deeper

- **[OpenAI Tokenizer playground](https://platform.openai.com/tokenizer)** — paste text, see the tokens.
- **[OpenAI — What are tokens](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them)**
