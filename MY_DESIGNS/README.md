# 🧪 My Designs — Original Problem Statements & Solutions

This is not a shelf of other people's papers. This folder holds **my own engineering problem statements and the solutions I designed for them** — ideas I noticed in daily life, reverse-engineered, and turned into a real system design.

Each note is written as a **design paper**: the problem stated plainly, my proposed solution, and then a *rigorous, honest* analysis — is this already solved? what breaks? what are the edge cases? what would I actually build? It sits deliberately apart from `RESEARCH_PAPERS/` (which rewrites famous published papers) because this is invention, not summary.

The point of writing them this way is to force intellectual honesty: the moment you map your idea against the prior art (OPAQUE, Privacy Pass, Sign in with Apple, proof-of-personhood…), you find out whether you invented something new, re-invented something old, or — most often — recombined known primitives into a fresh shape. All three outcomes are worth knowing.

---

## 🧭 The spine every design note follows

**The Core Question** (the itch that started it) → **The Origin** (where I noticed it in real life) → **The Problem Statement** (crisp, with a threat model) → **My Design** (the proposal, exactly as I first imagined it) → **What it really is** (naming the pattern) → **The Fundamental Tension** (why it can't be free) → **Is this already solved?** (prior-art map — mechanism + how they deployed it) → **Edge cases** → **Engineering problems & how to tackle them** → **A stronger architecture** (the synthesis I'd actually ship) → **Reference implementation sketch** (TypeScript) → **PRD** (goals, non-goals, requirements, metrics) → **🧠 Q&A Bank** → **✅ Recap**.

---

## 📇 Designs

| # | Design | The itch | Status |
| :--- | :--- | :--- | :---: |
| 001 | **[PII-less Authentication](./001-piiless-authentication.md)** | Let people log in without the company ever holding their phone/email — the "restaurant token" model of identity | 🟢 done |

---

## ⚖️ A note on honesty

A design note here is only useful if it tells the truth about its own weaknesses. Every one ends by naming what it traded away and what it still can't do. A solution that claims to beat a fundamental tension (privacy vs. Sybil-resistance vs. recoverability, say) is lying; the interesting question is always *which corner did I give up, and was that the right corner for this use case?*
