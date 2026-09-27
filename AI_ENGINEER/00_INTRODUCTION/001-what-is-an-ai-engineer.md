# 🧑‍💻 What is an AI Engineer?

## The Core Question

"AI Engineer" is suddenly one of the most in-demand job titles in software — but if you stop and ask *what does this person actually do at their desk all day*, and *why did this title barely exist before 2023*, most explanations get vague. This lesson answers both precisely. By the end you'll know exactly what the job is, why it appeared when it did, and how it's different from every AI role that came before it.

---

## The Origin Story — how a whole new job appeared in about three years

You can't understand the AI Engineer without understanding the world *before* it, because the role exists to fill a gap that only recently opened.

**Act 1 — For decades, "doing AI" meant "building the model yourself" (pre-2020).**
Historically, if a company wanted an intelligent feature — say, detecting spam or recommending products — someone had to *train a machine-learning model*. That meant collecting a large labelled dataset, choosing a model architecture, running expensive training on specialized hardware, and evaluating the result. This work required deep statistics and mathematics, and the people who did it were **Machine Learning Engineers** and **researchers**, usually with graduate degrees. The intelligence was inseparable from the expertise: no PhD-level skills, no AI. Crucially, each model was *narrow* — a spam model could only detect spam; it couldn't answer a question or write code.

**Act 2 — The foundation model breaks the link between "using AI" and "building AI" (2020).**
In 2020, OpenAI released **GPT-3** and, importantly, offered it as a **paid API**. This was a turning point. For the first time, a single, *general-purpose* model — one that could write, summarize, translate, answer questions, and code — was available to any developer as a simple web request. You no longer had to train anything. You didn't need a dataset or a GPU cluster. You needed an API key. The hard, expensive, PhD-heavy part (creating the model) had been done *once*, by a lab, and rented out to everyone. Models capable enough to be reused this way across many tasks became known as **foundation models**.

**Act 3 — ChatGPT turns a trickle into a flood of demand (late 2022).**
When OpenAI launched **ChatGPT** in November 2022, it reached mass awareness almost overnight. Suddenly every company on earth wanted AI features in their product. But here was the mismatch: the thing they needed built was no longer "train a model" (already done) — it was "**build a reliable product on top of an existing model**." That is a *software engineering* problem far more than a research problem.

**Act 4 — The role gets a name (2023).**
In mid-2023, the writer and engineer **Shawn Wang (widely known as "swyx")** published an essay titled **"The Rise of the AI Engineer."** Its argument: a new discipline was crystallizing *between* traditional software engineering and machine learning. These were people who build applications with foundation models via APIs — prompting them, feeding them data, giving them tools, and shipping them to users — *without* training models from scratch. The essay named the role that thousands of engineers were already drifting into, and the name stuck.

**So the AI Engineer exists because of a specific historical shift:** the difficulty of building with AI moved from *creating the intelligence* (now done by a handful of large labs) to *engineering a trustworthy product around that intelligence* (now the work of the whole industry). You are stepping into a role that is only a few years old, born the moment powerful models became a rentable API.

---

## Why the role exists (the gap it fills)

After ChatGPT, companies faced a hiring problem that revealed a genuine skills gap:

- **Traditional software engineers** knew how to build products, APIs, and UIs — but had never worked with a *non-deterministic* component that "thinks" in text, and didn't know techniques like prompting, retrieval, or how to evaluate a system whose output changes every run.
- **Machine Learning engineers** knew models deeply — but their skill (training, math, data pipelines) was largely *unnecessary* now that the model already existed, and many were less focused on product-level concerns like latency, cost, UX, and safety at the application layer.

Neither group, by default, had the exact blend needed: **strong software engineering + fluency in wielding a foundation model reliably.** The AI Engineer is the person who sits in that gap. That's *why* the role exists — not as a rebranding, but as the answer to a real, specific mismatch between what companies needed and what existing roles provided.

---

## What an AI Engineer actually is

**Definition:** An AI Engineer builds software products and features on top of **existing, pre-trained foundation models** (like GPT, Claude, or Gemini), treating the model as a powerful but unpredictable component and engineering everything around it to make it reliable, useful, and safe.

**Mental model — you are the "application layer" over a foundation model.** Picture a stack. At the bottom is the foundation model, built by a large lab. You do not work down there. You work at the layer *above* it: the prompts, the data you feed in, the tools you connect, the checks you add, and the product the user actually touches. The model provides raw capability; you convert that raw capability into something a real user can depend on.

**The Analogy — the restaurant owner and the farmer.** Imagine the world of food. The **farmer** grows the raw ingredients — years of mastering soil, seeds, and crops. That's the lab *training the model*: slow, capital-intensive, deeply specialized. The **restaurant owner** buys those ingredients and builds a dining experience: the menu, the recipes, the plating, handling a customer's allergy, keeping the kitchen fast under a rush. That's you, the AI Engineer. You didn't grow the wheat, and you don't need to know how to — your value is *everything you build around* an excellent ingredient that already exists. A diner never asks who grew the tomatoes; they judge the meal. Your users never see the model; they judge your product.

Why this analogy holds up: it correctly predicts what you spend time on. A restaurant owner obsesses over the *experience* (reliability, speed, safety, cost), not agriculture. An AI Engineer obsesses over the *product* (prompting, data, tools, evaluation, cost, safety), not model training. The mapping isn't decoration — it tells you where your attention goes.

---

## How the job actually works — a day in the role

Concretely, the AI Engineer's work clusters into a handful of activities. Each is a later chapter of this notebook, so this doubles as a map of what you're about to learn.

**1. Prompt design.** The model does what its text instructions tell it to. Writing those instructions so the model reliably does the right thing — clearly, in the right format, without going off the rails — is a core, daily skill. (Chapter 03.)

**2. Feeding the model the right context (RAG).** A foundation model knows a lot about the public world but nothing about *your* company's documents, *this* user's data, or *today's* events. The AI Engineer retrieves the relevant information and places it into the prompt so the model can use it. This technique — Retrieval-Augmented Generation — is the single most in-demand skill in the field. (Chapters 04–06.)

**3. Giving the model tools (agents / function calling).** Sometimes the model shouldn't just *talk* — it should *act*: look something up, call an API, query a database. The AI Engineer connects real functions to the model and lets it decide when to use them. (Chapter 07.)

**4. Handling the messy realities.** Models are non-deterministic and imperfect. The job includes managing hallucinations, controlling cost (you pay per unit of text), reducing latency (responses take seconds — you stream them), respecting rate limits, and defending against misuse. (Chapters 09, 11.)

**5. Shipping and measuring.** Finally, it's ordinary engineering: deploy the feature, log what it does, and *evaluate* whether its quality is good and staying good, since a model update can silently change behavior. (Chapters 10–11.)

Notice how much of that list is **software and product engineering**, not mathematics. That's the defining truth of the role.

---

## A concrete example — the same problem, before and after

Say a company wants a feature: *"Let users ask questions about our product manual in plain English."*

**The old way (ML engineer, pre-2020):** collect thousands of question/answer examples about the manual, label them, train or fine-tune a question-answering model, evaluate accuracy, and repeat. Months of specialized work, and the result only works for *this* manual.

**The AI Engineer way (today):** take an existing foundation model. When a user asks a question, retrieve the few most relevant paragraphs from the manual and put them in the prompt alongside the question (RAG). The already-intelligent model reads those paragraphs and answers. Days of work, mostly ordinary backend engineering, and the same approach works for *any* documents.

The intelligence was never the bottleneck — it came pre-built. The engineering *around* it was the whole job. That shift, in one example, is what created your role.

---

## When you need an AI Engineer vs. when you still need an ML Engineer

This blend is powerful but not universal. Reach for the AI Engineer approach when you're **building a product on top of capabilities a foundation model already has** — chatbots, search over your data, copilots, agents, content generation. That covers the large majority of "we want AI in our product" needs today.

You still need a true **ML Engineer / researcher** when the capability you need *doesn't exist yet* in any available model, or must be created fresh: training a novel model on proprietary data for a task no foundation model can do, pushing the research frontier, or optimizing model internals. Building the engine is a different job from building the car — the next lesson draws that line in full.

---

## 🧠 Q&A Bank

**1. In one sentence, what is an AI Engineer?**
Someone who builds software products on top of existing, pre-trained foundation models — treating the model as a powerful component and engineering the prompts, data, tools, and safeguards around it — rather than training models from scratch.

**2. (History) Why did this role barely exist before ~2023? What specifically caused it to appear?**
Before 2020, "doing AI" meant *training* a model, which required rare ML/research expertise, so there was no distinct "build products on top of a model" role. The chain that created it: GPT-3's API (2020) let any developer use a general-purpose model without training it; ChatGPT (2022) created mass demand for AI features; and swyx's essay "The Rise of the AI Engineer" (2023) named the discipline that had formed to meet that demand.

**3. What is a "foundation model," and why is it central to this role?**
A foundation model is a single large model, pre-trained once, that is general-purpose enough to be reused across many different tasks (writing, coding, answering, summarizing) via an API. It's central because it's the reusable "ingredient" the AI Engineer builds on — its existence is what made building-with-AI possible without training-AI.

**4. Why is the AI Engineer role described as "filling a gap" rather than being a rebrand of an existing job?**
Because neither existing role covered what was needed: traditional software engineers lacked fluency with non-deterministic models (prompting, RAG, evaluation), while ML engineers' core skill (training) had become largely unnecessary and they were less focused on app-layer product concerns. The gap was the specific blend of strong software engineering plus reliable model-wielding.

**5. A teammate says "to add an AI feature we'll need to train our own model." When is that instinct usually wrong?**
Usually wrong when the needed capability already exists in a foundation model — which is most product cases (chatbots, Q&A over docs, copilots). The right move is typically to *use* an existing model with good prompting and retrieval, which is dramatically faster and cheaper than training. Training is only warranted when the capability genuinely doesn't exist yet.

**6. Explain the restaurant-owner-vs-farmer analogy and what it predicts about your daily work.**
The farmer grows raw ingredients (the lab training the model); the restaurant owner turns ingredients into a great dining experience (you building the product). It predicts that, like a restaurant owner focusing on experience rather than agriculture, an AI Engineer focuses on product concerns — prompting, data, tools, reliability, cost, safety — not on model training.

**7. Roughly what fraction of the AI Engineer's work is mathematics/model training, and why does that matter for you?**
Very little — the bulk is software and product engineering. It matters because your existing full-stack skills transfer almost directly; the new material to learn is the application-layer techniques (prompting, RAG, agents, evals, safety), not research-level math.

---

## 🛠️ Hands-on Exercise

Take a product you use every day (your email client, your IDE, a shopping app). Write down **three** AI features you could add to it. For each one, answer in a sentence or two:

1. Could a *foundation model that already exists* provide this capability, or would it require training something new?
2. What information (context) would the model need that it can't already know — i.e., what would you have to retrieve and feed it?
3. Would the model just need to *talk*, or would it need *tools* to take an action?

Goal: start seeing every product through the AI Engineer's lens — capability (does it exist?), context (what must I feed it?), and action (does it need tools?). Those three questions are the skeleton of nearly every AI feature you'll ever build. There's no single right answer; the point is training the instinct.

---

## ✅ Recap

- An AI Engineer builds products **on top of** existing foundation models; they don't train the models.
- The role appeared because a historical shift (GPT-3's API in 2020 → ChatGPT in 2022 → the role being named in 2023) moved the hard part from *creating* intelligence to *engineering products around* it.
- It fills a real gap: **strong software engineering + reliable model-wielding**, which neither traditional SWEs nor ML engineers had by default.
- The daily work is prompting, retrieval (RAG), tools/agents, and handling reliability/cost/safety — mostly software and product engineering, very little math.
- Use a foundation model when the capability already exists (most cases); bring in an ML engineer only when it must be created fresh.

---

## 📎 Primary sources (optional)

This lesson stands on its own — nothing below is required. For a reader who wants to see the source that named the role:

- Shawn Wang (swyx), *"The Rise of the AI Engineer"* (2023) — the essay that defined the term.
