# 🧰 Prerequisites & Setup

Let's get your machine ready and make your **first real LLM call from TypeScript**. This takes about 10 minutes.

---

## ✅ What you need

- **Node.js 18+** — check with `node -v`.
- **TypeScript** — you already use it. We'll run files with `tsx` (no build step).
- **An API key** from OpenAI or Anthropic (either works for this notebook).

---

## 🔑 Step 1 — Get an API key

Pick one to start (you can add the other later):

- **OpenAI:** create a key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys). Add ~$5 of credit.
- **Anthropic (Claude):** create a key at [console.anthropic.com](https://console.anthropic.com).

**Never commit your key.** Put it in a `.env` file and make sure `.env` is in `.gitignore`.

```bash
# .env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

---

## 📦 Step 2 — Set up a scratch project

```bash
mkdir ai-lab && cd ai-lab
npm init -y
npm install openai @anthropic-ai/sdk dotenv
npm install -D tsx typescript
```

---

## 🚀 Step 3 — Your first call (OpenAI)

```ts
// hello-openai.ts
import "dotenv/config";
import OpenAI from "openai";

const openai = new OpenAI(); // reads OPENAI_API_KEY from env automatically

async function main() {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // cheap + capable; great for learning
    messages: [
      { role: "system", content: "You are a concise assistant." },
      { role: "user", content: "Explain what an API is in one sentence." },
    ],
  });

  console.log(response.choices[0].message.content);
}

main();
```

Run it:

```bash
npx tsx hello-openai.ts
```

If you see a one-sentence answer printed, **you just built the core of every AI app** — everything else is elaboration on this.

---

## 🤖 The same call with Claude (Anthropic)

```ts
// hello-claude.ts
import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic(); // reads ANTHROPIC_API_KEY from env

async function main() {
  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-5", // fast, capable everyday model
    max_tokens: 200,
    system: "You are a concise assistant.",
    messages: [{ role: "user", content: "Explain what an API is in one sentence." }],
  });

  console.log(msg.content[0].type === "text" ? msg.content[0].text : "");
}

main();
```

Notice the shape is nearly identical: **system instruction + user message → response.** Providers differ in details (Anthropic requires `max_tokens`, puts `system` at the top level), but the mental model is the same everywhere.

---

## 🆓 Optional — run models locally for free with Ollama

If you'd rather not spend money while learning:

```bash
# install from https://ollama.com then:
ollama run llama3.2
```

Ollama exposes an OpenAI-compatible endpoint at `http://localhost:11434/v1`, so the *same* OpenAI SDK code works — you just point `baseURL` at it and use no real key. We cover this in Chapter 02.

---

## ✅ Key takeaways

- Keys live in **`.env`**, never in git.
- `gpt-4o-mini` (OpenAI) and `claude-sonnet-4-5` (Anthropic) are ideal **cheap, capable models for learning**.
- Every provider follows the same **system + messages → response** shape.

---

## 🔗 Go deeper

- **[OpenAI Quickstart](https://platform.openai.com/docs/quickstart)**
- **[Anthropic Getting Started](https://docs.anthropic.com/en/docs/get-started)**
- **[Ollama](https://ollama.com)** — free local models.
