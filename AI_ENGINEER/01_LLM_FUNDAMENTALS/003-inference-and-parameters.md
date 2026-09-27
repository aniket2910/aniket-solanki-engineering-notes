# 🎛️ Inference & Sampling Parameters

**Inference** is just the fancy word for "running the model to get a response" (as opposed to *training*, which builds it). When you call the API, you're doing inference. A handful of **parameters** let you control *how* the model generates — and using them well is a core engineering skill.

---

## 🌡️ `temperature` — creativity vs. consistency

The single most important knob. It controls how "random" the token picking is.

- **`temperature: 0`** → almost deterministic. The model picks the most likely token every time. Same prompt ≈ same answer. Use for: extraction, classification, code, math, anything factual.
- **`temperature: 0.7`** (default-ish) → balanced, natural, a bit creative. Use for: chat, general writing.
- **`temperature: 1.2+`** → wild and varied, sometimes incoherent. Use for: brainstorming, creative writing.

**The Analogy:** temperature is a *strictness dial* on the chef. At 0, the chef always makes the recipe exactly as written. At high values, the chef improvises wildly — exciting, but you might get salt in your dessert.

Practical rule: **when in doubt, use a low temperature.** Most production AI features want reliability, not surprise.

---

## 🎯 `top_p` — an alternative randomness control

`top_p` (nucleus sampling) limits choices to the smallest set of tokens whose combined probability adds up to `p`. `top_p: 0.1` means "only consider the top 10% most-likely mass." It's another way to tighten or loosen output.

**Don't tune both `temperature` and `top_p` at once** — pick one and leave the other at default. Most people just use `temperature`.

---

## 📐 `max_tokens` — cap the response length

Limits how many tokens the model may generate. Two reasons to set it:

- **Cost & latency control** — stop a runaway 5,000-word answer.
- **Safety** — prevent a model from looping forever.

Note: this caps the *output*, not quality. If you set it too low, the answer gets **cut off mid-sentence**. Anthropic's API *requires* `max_tokens`; OpenAI defaults it.

---

## 🛑 Other useful parameters

- **`stop`** — strings that end generation early (e.g. stop at `"\n\n"` or `"###"`). Handy for structured formats.
- **`seed`** (OpenAI) — with a fixed seed + `temperature: 0`, you get near-reproducible outputs. Great for testing.
- **`frequency_penalty` / `presence_penalty`** — discourage repetition. Rarely needed; ignore until you have a repetition problem.

---

## 🧪 In TypeScript

```ts
import OpenAI from "openai";
const openai = new OpenAI();

const res = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: "Give me 3 startup name ideas for a coffee app." }],
  temperature: 0.9,   // we WANT creative variety here
  max_tokens: 100,    // keep it short
});

console.log(res.choices[0].message.content);
```

Now flip to an extraction task and change nothing but the temperature:

```ts
const res = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: "Extract the email from: 'contact me at joe@acme.io'" }],
  temperature: 0,     // we WANT the same, correct answer every time
});
```

Same code, opposite settings — because the *task* is different. That judgment is the skill.

---

## ✅ Key takeaways

- **`temperature`** is the main dial: low = consistent/factual, high = creative.
- Set **`temperature: 0`** for extraction, classification, and code.
- **`max_tokens`** caps output length (required by Anthropic); too low = cut-off answers.
- Tune **either** `temperature` **or** `top_p`, not both.

---

## 🔗 Go deeper

- **[OpenAI — API reference: chat parameters](https://platform.openai.com/docs/api-reference/chat/create)**
- **[Anthropic — Messages parameters](https://docs.anthropic.com/en/api/messages)**
