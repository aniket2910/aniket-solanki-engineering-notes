# 🔓 Closed vs. Open Models

## The Core Question

You've decided to build an AI feature. Before you write a line of code, you face a fork that shapes everything after it — your cost, your privacy guarantees, your latency, even whether you can ship on a plane with no internet: **do you rent a model from a company, or do you run one yourself?** Get this decision right and the rest of the project flows. Get it wrong and you're re-platforming in three months.

But to *judge* this fork well, you need to know how it came to exist — because it wasn't always there, and the reasons it appeared are exactly the reasons you'd pick one side over the other today.

---

## The Origin Story — how the "closed vs. open" divide was born

This split is recent and you can trace it to specific moments. Understanding them tells you *what each side is really optimizing for*.

**The starting point: AI research was openly published.** Through the 2010s, the norm in machine learning was radical openness — papers *and* code *and* weights. The breakthroughs that led to today's models were published in the open: Google's **"Attention Is All You Need"** (2017) introduced the Transformer architecture — the design under every modern LLM — as a public paper anyone could build on. Google's **BERT** (2018) shipped with downloadable weights. The whole field moved forward by sharing. So the *default* was open; closed is the thing that needs explaining.

**The pivotal crack: GPT-2 and "too dangerous to release" (Feb 2019).** OpenAI built GPT-2 and then did something the field hadn't seen: it **declined to release the full weights**, arguing the model could be misused for mass disinformation. This was the first big, public argument that a language model's weights might be *withheld on purpose*. It was fiercely debated — many researchers felt it broke the norm of open science — and it planted the idea that model weights are a controllable, potentially dangerous, potentially valuable asset. (OpenAI later released the full GPT-2.)

**The commercial lock-in: GPT-3 as an API only (2020).** With GPT-3, OpenAI made the leap explicit: the model was enormous, expensive to train, and offered **only through a paid API** — the weights were never published. This invented the dominant business shape of the era: *the model as a hosted service you rent by the token*. When **ChatGPT** landed in November 2022 and exploded, this closed-API model became the default mental picture of "using AI." The thinking behind it was part safety, part economics: training had cost a fortune, and an API keeps the crown jewels (and the revenue) in-house.

**The open counter-movement: Meta's LLaMA (Feb 2023).** The pushback came from Meta. It released **LLaMA** — a genuinely capable model — to researchers, and within about a week the weights **leaked publicly** and spread across the internet. Suddenly anyone could run a strong model on their own hardware, and an explosion of community tinkering followed (fine-tunes, quantization tricks, local runtimes). Meta leaned in rather than fighting it: **Llama 2** (July 2023) was released with **open weights and a commercial license**, and **Mistral** (Sept 2023) followed with a fully permissive Apache-2.0 model. The open-weight ecosystem you can use today was born in that stretch of 2023.

**So the divide is a live tension between two philosophies:** *openness and control-in-your-hands* (the field's original default, revived by Meta/Mistral) versus *safety-plus-commercial-protection delivered as a service* (OpenAI's GPT-2→GPT-3→ChatGPT arc). Every practical trade-off later in this lesson is a downstream consequence of that tension. When you choose closed vs. open, you are choosing a side in this exact argument.

---

## Why this choice exists at all

Two years ago there was effectively one answer: call OpenAI. There was no serious alternative you could run yourself. That created real problems for engineers:

- **Every request left your building.** For a healthcare or fintech app handling patient records or bank data, sending raw user text to a third party is often legally impossible.
- **You were a tenant, not an owner.** Prices, rate limits, and even model *behavior* could change under you overnight, and your product had no recourse.
- **Cost scaled linearly forever.** At a million requests a day, "a fraction of a cent each" becomes a serious monthly bill you can never buy your way out of.

The **open model** movement (Meta's Llama, Mistral, Qwen, and others releasing their weights publicly) exists to answer exactly those pains. So the fork isn't arbitrary — it's the industry's response to the real limitations of pure API dependence. Understanding *why* each side exists tells you when to pick it.

---

## What they actually are

**A closed (proprietary / hosted) model** is one whose *weights* — the billions of learned numbers that are the model — are kept secret by the company. You never touch them. You send text to their servers over an API and get text back. Examples: OpenAI's GPT, Anthropic's Claude, Google's Gemini.

**An open (open-weight) model** is one whose weights are published for you to download and run on your own hardware (or a cloud GPU you rent). You possess the actual model file. Examples: Meta's Llama, Mistral, Qwen, DeepSeek.

**Mental model:** it's the **electricity grid vs. a generator.**

- A **closed model is grid power.** You flip a switch, pay per unit, and someone else runs the power plant, handles maintenance, and upgrades it. Effortless — until the grid raises prices, has an outage, or you're somewhere with no lines run to you.
- An **open model is your own generator.** You bought it, you fuel it, you maintain it. More work and upfront cost, but the power never leaves your property, nobody can cut you off, and past a certain scale it's cheaper than the meter.

One subtle but important point: "open weights" is **not** the same as "open source." You usually get the finished weights and a license, but *not* the training data or the code and money it took to create them. You can run and fine-tune the model; you generally can't reproduce it from scratch. Some licenses (like Llama's) also carry usage restrictions. So read "open" as "you can run it yourself," not "fully free and unrestricted."

---

## How it works under the hood — what "running it yourself" really means

This is where the abstract choice becomes concrete. Let's trace what physically happens in each case when a user asks your app a question.

**Closed model path:**

```
Your server  ──HTTPS──►  Provider's data center (their GPUs, their weights)
     ▲                              │
     └──────── response ────────────┘
```

1. Your backend makes an HTTPS request carrying the prompt.
2. It lands on the provider's massive GPU cluster. Their copy of the weights runs the inference.
3. Text streams back. You never see a GPU, never manage memory, never patch a driver.

The entire "model" is a network call. Your operational burden is essentially zero — it's just an API integration like Stripe or Twilio.

**Open model path:**

```
Your server / GPU box (YOUR GPUs, weights loaded into VRAM)
     │
     └─ inference engine (Ollama / vLLM) runs the model locally
```

1. You download a weights file — often **many gigabytes** (a 7-billion-parameter model is ~4–8 GB; a 70B model is ~40+ GB).
2. Those weights must be **loaded into GPU memory (VRAM)** to run at a usable speed. This is the hard constraint most beginners hit: a model needs roughly **2 GB of VRAM per billion parameters** at 16-bit precision. A 70B model won't fit on a normal consumer GPU — you need serious hardware or a rented cloud GPU.
3. An **inference engine** (software like Ollama, vLLM, or llama.cpp) does the actual math of turning tokens into predictions, using your GPU.
4. The response never leaves your machine.

**Quantization — the trick that makes local models practical.** Those weights are normally 16-bit numbers. *Quantization* squeezes them down to 8-bit or 4-bit, roughly halving or quartering the memory needed, in exchange for a small quality drop. This is why you can run a genuinely capable 7B model on a laptop: a 4-bit quantized version fits in ~4 GB. When you see model files tagged `Q4_K_M` or `Q8`, that's the quantization level. Understanding this one concept is what lets you reason about "will this model run on the hardware I have?"

So the deep difference isn't philosophical — it's **who owns the GPUs and who carries the operational weight of keeping the model fed and running.**

---

## How you implement each (TypeScript)

The beautiful part: because of a de-facto standard (the OpenAI API shape), **the code barely changes.** Watch.

**Closed model — hosted OpenAI:**

```ts
import OpenAI from "openai";

const openai = new OpenAI(); // talks to api.openai.com, uses your API key

const res = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: "Explain quantization in one sentence." }],
});

console.log(res.choices[0].message.content);
```

**Open model — the same code, pointed at a local Ollama server:**

```ts
import OpenAI from "openai";

// Ollama exposes an OpenAI-COMPATIBLE endpoint on your own machine.
const local = new OpenAI({
  baseURL: "http://localhost:11434/v1", // your generator, not the grid
  apiKey: "ollama",                      // any non-empty string; it's ignored locally
});

const res = await local.chat.completions.create({
  model: "llama3.2", // a model you pulled with `ollama pull llama3.2`
  messages: [{ role: "user", content: "Explain quantization in one sentence." }],
});

console.log(res.choices[0].message.content);
```

Notice what changed: **only the `baseURL`, the `apiKey`, and the model name.** The request shape, the response shape, your business logic — identical. This is the single most useful practical fact in this chapter: because most providers and local runtimes speak the OpenAI dialect, **you can design your app to be provider-agnostic** and switch by changing configuration, not code. Build against that shape and you keep the fork open as long as possible.

To make the local path work, you'd first install [Ollama](https://ollama.com) and run `ollama pull llama3.2` once to download the weights.

---

## Trade-offs, when to use, and pitfalls

| Dimension | Closed (hosted API) | Open (self-run) |
| :--- | :--- | :--- |
| **Quality ceiling** | Highest available today | Very good and closing fast, but the frontier is still closed |
| **Setup effort** | Minutes (an API key) | Hours to days (GPUs, inference engine, ops) |
| **Data privacy** | Data leaves your building | Data never leaves; full control |
| **Cost shape** | Pay per token, forever | High fixed cost (hardware), then near-free per request |
| **Offline / air-gapped** | Impossible | Works with no internet |
| **Maintenance** | None — they run it | Yours — patches, scaling, uptime |
| **Customization** | Limited to their fine-tuning API | Total — full fine-tuning, modification |

**When to reach for closed:** almost always when *starting*. You want the best quality with zero ops so you can validate the product. Prototypes, most SaaS features, anything where you're still learning what you're building.

**When to reach for open:** (1) **hard privacy/compliance** — the data legally cannot leave your infrastructure; (2) **extreme scale** where per-token costs dwarf hardware costs; (3) **offline / air-gapped** deployments; (4) you need **deep customization** or full control over the model's behavior and availability.

**Pitfalls to avoid:**

- **"I'll self-host to save money" too early.** Below serious scale, GPU rental + engineering time costs *more* than the API. The savings only materialize at high, steady volume. Do the math before committing.
- **Assuming open = as good as GPT/Claude at everything.** Top open models are excellent, but for the hardest reasoning tasks the closed frontier is still ahead. Match the model to the task, not to ideology.
- **Underestimating VRAM.** People try to run a 70B model on a laptop and are confused when it crawls or crashes. Check the memory math (≈2 GB/billion params, less if quantized) *before* choosing a model.
- **Coupling your code to one provider's quirks.** Build against the OpenAI-compatible shape so you can switch. Vendor lock-in is a choice, not a fate.

---

## 🧠 Q&A Bank

**1. In one sentence, what's the difference between a closed and an open model?**
A closed model's weights are kept private and you access it only through the company's API; an open model's weights are published so you can download and run it on your own hardware.

**2. Is "open weights" the same as "open source"? Why does the distinction matter?**
No. You typically get the finished weights and a license (enough to run and fine-tune the model), but *not* the training data or the full recipe to reproduce it — and the license may restrict usage. It matters because "open" here means "you can self-host," not "unrestricted and fully transparent."

**3. Why might a healthcare company be forced to choose an open model even if a closed one is smarter?**
Because a hosted API sends user data (e.g. patient records) to a third party's servers, which may violate privacy law or contracts. A self-run open model keeps all data inside their own infrastructure.

**4. You have a laptop with 8 GB of GPU memory. Can you run a 70B-parameter model? Explain the math.**
Not at full precision — a 70B model needs roughly 2 GB per billion params ≈ 140 GB of VRAM. Even heavily 4-bit quantized (~40 GB) it won't fit in 8 GB. You'd run a small (7B) quantized model instead, or rent a big cloud GPU.

**5. What is quantization and what do you trade for it?**
Quantization stores the model's weights at lower numeric precision (e.g. 4-bit instead of 16-bit), cutting the memory and compute needed to run it. You trade a small amount of output quality for a large drop in resource requirements — the reason capable models can run on laptops.

**6. Your startup is building a prototype to test an idea. Closed or open, and why?**
Closed. You want the highest quality with zero operational overhead so you can validate the product fast. Self-hosting's payoff (privacy, cost-at-scale) doesn't apply yet, and its costs (ops, hardware) would only slow you down.

**7. "We should self-host to save money" — when is this reasoning actually wrong?**
Below high, steady volume. GPU rental plus engineering/ops time usually costs *more* than per-token API pricing until you're at large scale. The cost crossover only happens with sustained high request volume.

**8. Why does changing just the `baseURL` let the same TypeScript work with both a hosted and a local model?**
Because most providers and local runtimes (like Ollama) implement the *same* OpenAI-compatible API shape. Your code sends the same request format either way; only the address it's sent to (and the model name) changes.

**9. (History) Openness was the field's default — so what made "closed" happen, and what revived "open"?**
Early ML shared papers, code, and weights freely (the Transformer paper in 2017, BERT's weights in 2018). Closed emerged from two forces: OpenAI's 2019 decision to withhold GPT-2's weights as "too dangerous" (establishing weights as a controllable asset), then GPT-3 in 2020 being offered API-only for safety-plus-commercial reasons — cemented by ChatGPT's 2022 success. Open was revived in 2023 when Meta's LLaMA leaked and Meta responded by releasing Llama 2 with open weights, followed by Mistral. The divide is that unresolved tension: control-as-a-service vs. weights-in-your-hands.

---

## 🛠️ Hands-on Exercise

Install [Ollama](https://ollama.com), then `ollama pull llama3.2`. Write **one** TypeScript file that asks the same question to *both* `gpt-4o-mini` (hosted) and `llama3.2` (local), using two `OpenAI` client instances that differ only in `baseURL`/`apiKey`. Print both answers side by side and note the difference in **speed** and **answer quality**. Goal: feel viscerally that they're the same code against two very different backends — and form your own opinion on the quality gap.

Hint: you already have the two client setups above; wrap each call in `console.time`/`console.timeEnd` to compare latency.

---

## ✅ Recap

- **Closed = grid power** (rent it, effortless, data leaves you). **Open = your own generator** (own it, more work, data stays).
- "Open weights" means *you can run it*, not that it's fully open-source or unrestricted.
- Self-hosting is bounded by **VRAM** (≈2 GB/billion params); **quantization** trades a little quality to fit models on smaller hardware.
- **Default to closed for prototypes and most products**; choose open for hard privacy, extreme scale, offline needs, or deep customization.
- Code against the **OpenAI-compatible shape** so switching providers is a config change, not a rewrite.

---

## 📎 Tools & references (optional)

This lesson is complete on its own — you don't need anything below to understand closed vs. open models. These are just the live tools mentioned above, for when you actually go to *build*:

- **[Ollama](https://ollama.com)** — the software to download and run open models locally (used in the exercise).
- **[Hugging Face — Open LLM Leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard)** — a live ranking of open models, if you want to pick one.
- **[LMArena](https://lmarena.ai)** — a live site for blind head-to-head quality comparisons of open *and* closed models.
