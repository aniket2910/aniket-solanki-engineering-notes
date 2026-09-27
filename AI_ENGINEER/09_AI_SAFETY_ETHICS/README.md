# 🛡️ 09 · AI Safety & Ethics

The stuff that separates a demo from a production system. Real users (and attackers) will feed your app hostile input, and it'll handle sensitive data. This chapter covers the **practical engineering defenses** — not philosophy.

---

## 📂 Lessons (coming next)

| ID | Lesson | Key ideas |
| :--- | :--- | :--- |
| `001` | Prompt Injection & Jailbreaks | The #1 LLM security risk; how attacks work and how to blunt them |
| `002` | Security & Privacy | Handling PII, data retention, not leaking secrets into prompts |
| `003` | Bias, Guardrails & Content Safety | Filtering, moderation APIs, human-in-the-loop |

---

## 🎯 Goal of this chapter

Recognize a prompt-injection attack, understand why you can't fully "prompt your way out" of it, and know the layered defenses (input/output filtering, least privilege for tools, moderation).

---

## ⚠️ Why this matters early

The moment your model can **use tools or read untrusted content** (web pages, user uploads, emails), prompt injection becomes a real attack surface — malicious text can hijack the model's instructions. If you build agents (Chapter 07), read this alongside it.

---

## 🔗 Best resources

- **[OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/)** — the industry security checklist.
- **[Anthropic — Mitigate jailbreaks & prompt injection](https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks)**
- **[OpenAI — Safety best practices](https://platform.openai.com/docs/guides/safety-best-practices)**
