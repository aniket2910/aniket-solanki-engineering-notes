# PII-less Authentication — logging in without the company ever holding your phone or email

**A design paper.** This is my own problem statement and solution, reverse-engineered from a restaurant billing counter, then held up honestly against the prior art. The goal: a signup/login system where the company **never stores the user's personally identifiable information (PII)** — no phone number, no email — yet can still authenticate the user, run its product, and block bad actors.

This note is self-contained. It states the idea exactly as I first imagined it, names what it really is, maps it against everything the industry has already built for this exact problem, exposes the edge cases and engineering problems (including the two I already worried about), and then lays out the architecture I would actually ship.

---

## The Core Question

Every app you use holds a piece of you. To interact with almost any web or mobile product, you hand over an email or a phone number, and from that moment the company **owns a copy of your PII**. Multiply that by the hundreds of services a person touches, and your identity is smeared across hundreds of databases you don't control — each one a breach waiting to leak you.

So the question:

**Can a company authenticate you, and run a real product for you, without ever holding a single piece of your PII — while still keeping the power to block abuse and the ability for you to come back tomorrow and log in?**

That last clause is the whole difficulty. Throwing away PII is easy. Throwing it away *and* keeping login, *and* keeping abuse control, *and* keeping account recovery — that is where every naive version of this idea quietly dies. This paper is about where it dies and how to keep it alive.

---

## The Origin (where I noticed it)

I got the idea at a restaurant. You order, you pay, and they hand you a **token** — number 47. They don't take your name, your phone, or your address. When your food is ready they call "47," you walk up with your bill, you collect your order, you leave. The restaurant served you completely and remembered *nothing about who you are*. The token was your identity for exactly as long as you needed one, and it was worthless to anyone else the moment you were done.

That is a startlingly clean identity system, and it made me ask: **why can't login work like this?** Why does a company need to *know me* to serve me? Why can't I show up, get a token that only I can reproduce, transact under it, and leave nothing behind?

The restaurant token is the mental anchor for this entire design. As we'll see, it's also the source of the design's hardest problems — because a restaurant token is a **bearer capability**, and bearer capabilities have famous, well-studied weaknesses.

---

## The Problem Statement (crisp, with a threat model)

**Build an authentication system such that:**

1. The server persists **no reversible PII** — not the user's phone number, not their email, not their real name in a form that identifies them.
2. A user can **sign up once** and **log in repeatedly** across devices and time.
3. The company retains **operational control**: it can identify a *misbehaving account* and block or restrict it, and it can satisfy an admin/audit workflow — without that requiring it to know *who* the human is.
4. The user *feels*, correctly, that "this company does not have my data to leak or sell."

**Who are we defending against (threat model)?**

- **The honest-but-curious company** and, more importantly, **anyone who breaches its database.** The central promise is: a full dump of the company's user table reveals *nothing* about who the users are in the real world.
- **The abusive user** who wants to spin up thousands of accounts (Sybil attack) to farm promos, spam, brigade, or evade a ban.
- **The account thief** who wants to take over someone's account.
- **Not** in scope for the base design (but discussed): a nation-state adversary who can compromise the client device itself.

Hold these four requirements and this threat model in your head; every design decision below is scored against them.

---

## My Design (exactly as I first imagined it)

The core move: **derive the credentials on the client, from inputs only the user has, and send the server only the derived output.** The PII is used as *raw material* for a computation and is then thrown away — it never leaves the device.

In my original notation:

```
CLIENT SIDE (never leaves the device):
  ( mobile_no + salt + unique_message ) + password  ──▶  uuid

SERVER STORES (the whole user record):
  uuid
  password        (a verifier for it, not the raw password)
  first_name      (optional, chosen — not necessarily their real name)
```

The flow as I imagined it:

- **Signup.** On their device, the user enters their phone number (or email), plus a `salt` and a `unique_message`. The client hashes these together into a **`uuid`** — a stable identifier — and pairs it with a **password**. The client sends `{ uuid, password_verifier }` to the server. The phone number is discarded on the device. The company now holds an account it cannot trace to a person.
- **Login.** Next time, the user re-enters the same inputs, the client re-derives the same `uuid`, and authenticates with `{ uuid, password }`. Same token, same person, no PII.
- **Admin control.** The company can still see behavior tied to a `uuid` and can block or restrict that `uuid` if it breaks the rules — the back-tracking / admin workflow — without ever knowing the human behind it.

That's the restaurant token, made cryptographic: the `uuid` is token 47, reproducible only by the person who knows the recipe, and meaningless to a thief who dumps the database.

**The two problems I already saw coming** (and this paper answers in full):

1. **No PII means no OTP / SMS 2FA.** If the company doesn't hold the phone number, it can't text a code. How do we get a second factor and verify a real contact channel?
2. **Sybil / multiple accounts.** With the same phone number a user can derive unlimited different `uuid`s (just change the salt or message). Since we don't store the phone number, we have nothing to enforce "one person, one account." How do we restrict that?

These two are not incidental bugs. They are the *direct, unavoidable cost* of the privacy we bought — and understanding *why* is the heart of this paper.

---

## What it really is (naming the pattern)

Before fixing anything, name the beast. My design is a stack of three well-known ideas:

**1. A bearer capability.** The `uuid` (plus password) is a *bearer token*: whoever can present it gets the account. Just like the restaurant token, possession *is* authorization. This is the source of both its privacy (the token says nothing about you) and its danger (lose it and it's gone; steal it and you're in).

**2. Deterministic / stateless credential derivation.** Deriving a stable secret from `f(user inputs)` with nothing stored server-side is exactly how **HD crypto wallets** turn one seed phrase into infinite keys (BIP-32), and how **stateless password managers** (LessPass, Spectre/Master Password) turn `f(master password, site, login)` into a site password that is *never stored anywhere* — recomputed on demand.

**3. PII-minimizing authentication.** The intent — "let me use your service without giving you my identity" — is the same intent behind **Sign in with Apple's Hide My Email**, **Privacy Pass**, and the whole **self-sovereign identity** movement.

So the design is not crazy; it's a recombination of three legitimate, deployed patterns. The trouble is what happens when you demand *all three at once plus abuse control plus recovery.* That collision has a name.

---

## The Fundamental Tension (why this can't be free)

There is an identity-systems trilemma, and my design walks straight into it. You are trying to get three things that pull against each other:

| Corner | What it means | My design wants it |
| :--- | :--- | :--- |
| **Privacy** | The system holds nothing that identifies the human | ✅ hard yes |
| **Sybil-resistance / uniqueness** | One real human maps to (at most) one account | ✅ wants it (Problem 2) |
| **Recoverability & accountability** | Users can recover lost access; the system can reset, block a *person*, and comply with law | ✅ wants it (Problem 1 + admin) |

**You cannot maximize all three cheaply.** Every real system sacrifices or outsources one corner:

- A **restaurant token** keeps Privacy, throws away Recoverability (lose the token, lose the order) and does weak Sybil-resistance (they can eyeball the queue).
- A **normal app with your phone number** keeps Sybil-resistance and Recoverability, throws away Privacy.
- **Anonymous e-cash / Privacy Pass** keeps Privacy and Sybil-resistance, and pays with heavy cryptography and *outsourced* verification.

My design optimizes hard for **Privacy** — and my two feared problems are *precisely* the bill for the other two corners. Problem 1 is the Recoverability/accountability corner presenting its invoice. Problem 2 is the Sybil-resistance corner presenting its invoice. This is not bad luck; it's the geometry of the problem. The rest of this paper is about **who pays the other two corners, and how, without buying back the PII you just threw away.**

The key unlock, which every mature system in the prior art uses: **separate the entity that *verifies* a scarce real-world resource from the entity that *stores the account*.** You can let *someone* prove you have a phone number without your app *keeping* that phone number. Hold that thought.

---

## Is this already solved? (the prior-art map)

Short answer: **every sub-problem here is solved, and productionized, by an existing primitive — but no single shipped system bundles them the exact way this design imagines.** Your contribution, if any, is the *bundle and the framing*, not the primitives. Here is the map, then a brief on each — the mechanism, and how it was actually integrated in the real world.

| The need in my design | Solved by | Core mechanism | Shipped in |
| :--- | :--- | :--- | :--- |
| Server never sees the password | **OPAQUE / SRP** (aPAKE) | Prove knowledge of a password without transmitting it; server stores only a verifier | WhatsApp backups, 1Password, Bitwarden, Signal |
| Stateless credentials derived from user inputs | **LessPass, Spectre** | `KDF(master, context)` recomputed on demand, nothing stored | Open-source password managers |
| Company genuinely doesn't get your email | **Sign in with Apple — Hide My Email** | A trusted relay holds the PII and hands each app a random address | Every "Sign in with Apple" button |
| Prove you're entitled *without revealing who* | **Privacy Pass / Chaumian blind signatures** | Blind-signed tokens, redeemed unlinkably | Cloudflare CAPTCHA bypass, Apple Private Access Tokens, IETF standard |
| One-human-one-account without holding identity | **Proof of Personhood** (World ID, BrightID, Idena) | Biometric/social/Turing uniqueness → a ZK **nullifier** | Worldcoin, Gitcoin, DAO voting |
| A uniqueness tag that can't be linked back | **Semaphore / nullifiers** | ZK set-membership + a per-context nullifier that prevents double-use | World ID, anonymous voting/airdrops |
| Passwordless login, no PII, phishing-proof | **WebAuthn / Passkeys** | Device-held key pair; server stores only the public key | Apple/Google/Microsoft, most major sites |
| Recover a lost account without a PII channel | **Recovery codes + Shamir social recovery** | Printed one-time codes; or split a secret among guardians | GitHub codes, Argent wallet guardians |
| User owns their own identity | **W3C DIDs + Verifiable Credentials** | Self-custodied identifiers, present proofs not data | EU digital identity wallet, various pilots |

### The briefs — mechanism and how they integrated it

**OPAQUE / SRP (the "server never learns your password" primitive).** These are *augmented PAKEs* (Password-Authenticated Key Exchange). Instead of you sending a password (even hashed) to the server, the two of you run a little protocol where you *prove you know it* and the server stores only an opaque **envelope/verifier** it can't brute-force offline (OPAQUE is the modern, IETF/CFRG-standard one; SRP is the older cousin behind TLS-SRP). **How it's integrated:** WhatsApp uses OPAQUE so your encrypted-backup PIN never reaches their servers; 1Password and Bitwarden use SRP so your master password never crosses the wire. **Why it matters to my design:** this is the *correct* way to do the "store `password` at the server" line — never store the password or even a plain hash; store an aPAKE verifier. It solves half of my design for free.

**LessPass / Spectre (the "derive, don't store" primitive).** These password managers compute your site password as `KDF(your_name, master_password, site_name)` — **stateless**, so there is literally no vault to steal; the password is regenerated each time from inputs in your head. **How it integrated:** entirely client-side, open source, no server. **Why it matters:** this is *exactly* the mechanism of my `uuid` derivation — and it also carries the exact warning I need (below): deterministic derivation from human-memorable inputs is only as strong as the entropy and the KDF hardness.

**Sign in with Apple — Hide My Email (the "trusted relay holds the PII" pattern).** When you hide your email, Apple generates a random `xyz@privaterelay.appleid.com`, gives *that* to the app, and forwards mail. The app never learns your real address; **Apple** holds the mapping. **How it integrated:** baked into the OAuth-style Sign in with Apple flow, mandatory to offer if you offer other social logins on iOS. **Why it matters:** it's the mainstream, billion-user proof that "the company you're using doesn't hold your PII" is a *shippable* promise — but notice the trick: the PII didn't vanish, it moved to a **trusted third party.** My design's ambition is to remove the PII *entirely*, which is strictly harder and is why my two problems appear.

**Privacy Pass / Chaumian blind signatures (the "prove entitlement, stay anonymous" primitive).** David Chaum's 1982 blind signatures let a bank sign a token it *cannot see* (you blind it, they sign, you unblind), so when you spend it later it's unlinkable to issuance. **Privacy Pass** revived this: solve one CAPTCHA, receive a batch of blinded tokens, then redeem them to skip future CAPTCHAs — the redeemer knows you're "a verified human" but not *which* one. **How it integrated:** a browser extension + Cloudflare, now an **IETF standard**, and the basis of **Apple's Private Access Tokens** (your iPhone attests you're human via Apple, and the website gets an anonymous token instead of a CAPTCHA). **Why it matters:** this is the single most important primitive for my design. It is the mechanism that lets me *verify a phone number once, at signup, through a separate verifier, and hand the app only an anonymous "this is a unique verified human" token* — decoupling verification from storage, which is the unlock the trilemma demanded.

**Proof of Personhood + nullifiers (the "one human, one account, still anonymous" primitive).** World ID scans your iris, turns it into an IrisCode, stores only a hash, and issues you a credential; when you act, you generate a **ZK proof** that you're a registered unique human plus a **nullifier** — a deterministic value tied to (your secret + this specific context) that is **unlinkable** to your identity but **identical if you try to act twice in the same context.** So the app can reject a second account without knowing who you are. **BrightID** does the same uniqueness goal via a social graph; **Idena** via a synchronized Turing-test. **How it integrated:** DAO voting, Gitcoin grant Sybil-defense, token airdrops. **Why it matters:** the **nullifier** is the exact tool for my Problem 2 — a way to enforce "one account per person" while storing nothing that identifies the person.

**WebAuthn / Passkeys (the "no password, no PII, phishing-proof" primitive).** Your device generates a key pair per site; the server stores only the **public key**; login is a signature challenge. Nothing secret and nothing personal sits on the server. **How it integrated:** FIDO2 standard, now default on Apple/Google/Microsoft with passkeys synced (and recoverable) through the platform keychains. **Why it matters:** passkeys already deliver "log in with no PII" for real, today — and their hardest problem (device loss → recovery) is *the same* recovery problem my design faces, so I can borrow their solution (synced keychains + recovery).

**Recovery codes + Shamir social recovery (the "get back in without a PII channel" primitive).** GitHub hands you ten one-time backup codes at 2FA setup; Argent-style smart wallets let you nominate **guardians** who can collectively restore your access (a Shamir-secret-sharing / M-of-N scheme). **How it integrated:** ubiquitous for 2FA; standard in self-custody crypto wallets. **Why it matters:** since my design has no email/SMS to send a reset link to, this is *the* recovery story — printed codes at signup, optionally backed by guardians.

**The honest conclusion:** my "PII-less login" is **not a new cryptographic primitive.** It is a *product framing* — the restaurant-token UX — sitting on top of a well-stocked shelf of solved primitives: aPAKE for the password, deterministic KDF for the derived identifier, blind signatures for one-time verification, nullifiers for Sybil-resistance, passkeys/TOTP for the second factor, and recovery codes for recovery. The design work is *assembling* them so the seams don't leak. That assembly is the next section.

---

## Edge cases

A cold list of what breaks, because edge cases are where this design lives or dies.

**Derivation & identity**
- **Salt/message loss.** The `uuid` is `f(phone, salt, message, …)`. If the user forgets the `salt` or `unique_message`, they can never re-derive the `uuid` — the account is *permanently* unreachable. There is no "forgot password" email to fall back to.
- **Same inputs, different account intended.** A user who *wants* a second, separate account must change an input — but then they must remember *which* salt maps to *which* account. Human memory is the weakest link.
- **Input normalization drift.** `+91 98765 43210` vs `919876543210` vs `09876543210` hash to *different* uuids. Without strict canonicalization the same person can't log back in from a differently-formatted number.
- **Collision / linkability from reuse.** If two users pick the same salt+message+password (low-entropy humans do this), they derive the *same* uuid — a catastrophic account collision. And one user reusing inputs across apps makes their accounts linkable.

**The two headline problems**
- **No OTP channel.** Can't send SMS/email codes for 2FA, login verification, or transaction confirmation.
- **Sybil explosion.** One phone → unlimited uuids by varying the salt. Promo abuse, ban evasion, spam, vote brigading.

**Security of the derivation**
- **Low-entropy brute force.** A phone number is ~33 bits; if `salt`/`message` are also human-chosen and weak, an attacker who learns the derivation scheme and steals the server's `uuid` list can brute-force offline to *confirm whether a specific phone number has an account* — re-identifying the very users you promised to protect.
- **Public identifier derived from secret inputs.** The `uuid` is both the *login handle* (it gets logged, put in URLs, shared in support tickets) **and** a function of the phone. Leaking the uuid narrows the brute-force. Deriving a public identifier from a secret is an anti-pattern.

**Operational & product**
- **Blocking a person vs. a uuid.** Admin bans `uuid` A; the user re-derives `uuid` B in ten seconds. You blocked a token, not a human.
- **Multi-device.** Log in on a new phone → must re-enter phone+salt+message+password and re-derive. If the salt lived only on the old device, the new device can't.
- **No comms channel at all.** You can't email a receipt, a security alert ("new login from Delhi"), a legal notice, or a "we're shutting down, export your data" message. The user is unreachable by design.
- **Payments / KYC.** The moment money or regulated activity is involved (payments, lending, anything KYC/AML), the law *requires* you to know the customer. PII-less-ness is illegal for those flows.
- **Support & disputes.** "Someone took over my account" — with no PII, you have no out-of-band way to verify the real owner.
- **Shared/borrowed numbers, recycled numbers.** Phone numbers get recycled between people; a uniqueness scheme keyed on phone can hand a new user a banned predecessor's status (or vice versa).
- **Compliance to *delete* data (GDPR/DPDP).** Ironically easy here — you hold no PII to delete — but "right to access my data" and lawful-intercept requests still need a coherent answer.

---

## Engineering problems & how to tackle them

Now the meat: each real problem, and the concrete mechanism that resolves it — reusing the prior-art primitives so we don't reinvent them.

### Problem 1 — No PII, so how do we get 2FA and a verified contact channel?

**First, separate two things that "OTP" bundles together:** (a) a *second authentication factor*, and (b) *verifying you control a scarce real-world resource (a phone)*. SMS-OTP happens to do both; that's why losing it feels fatal. But each half has a PII-free replacement.

**(a) A real second factor, with zero PII stored:**
- **TOTP (RFC 6238)** — the Google-Authenticator style 6-digit code. It needs only a *shared secret* set up once at enrollment; **no phone number is ever stored or contacted.** This alone refutes "2FA won't be there." You absolutely can have 2FA — just not *SMS* 2FA.
- **Passkeys / WebAuthn** — a device-bound key pair as the second (or sole) factor. Phishing-proof, PII-free, and the server stores only a public key.

So: **your design keeps 2FA. It loses only the *SMS* delivery of 2FA**, which is the weakest kind anyway (SIM-swap-prone). That's a strict security *upgrade* framed as a loss.

**(b) Verify a phone once, without keeping it — the blind-token enrollment.** If you genuinely need "this account is backed by a real phone number" (for Sybil-resistance, below), do it with a **separate verifier** and a **blind signature** (Privacy Pass pattern):

```
ENROLLMENT (one time):
  1. User proves control of a phone number to a SEPARATE verifier service
     (a normal OTP, run by an isolated microservice or a third party).
  2. The verifier issues a BLIND-SIGNED token = "a unique, phone-verified human"
     — it signs a value it cannot see, so it cannot later link token → phone.
  3. The verifier stores only a NULLIFIER (a one-way tag of the phone) to refuse
     issuing a second token for the same number. It never tells the app the number.
  4. The app receives and redeems the token. The app learns: "verified human, token
     not seen before." It never learns, and never stores, the phone number.
```

Now the *app* — the part that gets breached, that you don't trust — holds **no PII**, yet you got the phone-verification guarantee. The PII lived for milliseconds inside an isolated verifier and was reduced to a non-reversible nullifier. This is the trilemma unlock: **verification is decoupled from storage.**

### Problem 2 — Restricting multiple accounts (Sybil-resistance)

You want "one human, one account" without holding the human's identity. Ranked options:

1. **Nullifier from a scarce resource (recommended, cheap).** Reuse the enrollment above: the verifier computes `nullifier = HMAC(server_key, canonical_phone)` (the key lives in an HSM, never exported) and refuses a second token per nullifier. The app stores the *nullifier*, not the phone. Result: one phone → one account, and even a full breach of both the app and the nullifier table can't reverse a 33-bit-but-HMAC'd value *without* the HSM key. Downside to be honest about: if that HSM key ever leaks, phone numbers become brute-forceable — so the key must be hardware-guarded and rotation-planned.
2. **Proof of Personhood (strongest, heaviest).** World ID / BrightID give you "unique human" with a ZK nullifier and *no phone at all*. Use when Sybil-resistance must be strong and you can tolerate onboarding friction (DAO/airdrop-grade).
3. **Make accounts cost something (the restaurant-token insight, applied).** Real tokens aren't free — you paid for your meal. Impose a small refundable deposit, a proof-of-work, or a paywall on account creation. This doesn't stop a determined attacker but destroys the *economics* of mass Sybil.
4. **Social-graph uniqueness (BrightID).** Decentralized, moderate strength, no PII.

**What you do *not* do:** device fingerprinting. It fights bots but is itself invasive tracking — it re-introduces exactly the covert PII-harvesting your design exists to abolish. Rejecting it is a design principle, not an oversight.

### Problem 3 — Account recovery with no email/SMS to reset to

- **Recovery codes at signup (GitHub model).** Generate 10 one-time codes; the user stores them offline. Each can restore access once. Zero PII, works forever.
- **Social recovery (Shamir, Argent model).** Split the recovery secret among *M* guardians; any *K* of them can help you reconstruct it. No central party, no PII.
- **Synced passkeys.** If you lean on passkeys, the platform keychain (iCloud/Google) already syncs and recovers them across the user's devices — you inherit their recovery for free.
- **Optional trusted-relay fallback.** If a segment of users wants "email me a reset link," offer Sign-in-with-Apple-style *relayed* recovery — but be honest that this re-introduces a PII custodian for those users. Make it opt-in, not default.

### Problem 4 — Blocking a *person*, not just a token

Because bans must bite the human, not the disposable uuid: **tie the ban to the nullifier, not the uuid.** When you ban account A, you ban `A.nullifier`. When the same person re-enrolls (same phone → same nullifier), the verifier refuses to issue a fresh token, so they can't cheaply mint account B. This is precisely how ZK systems enforce "banned means banned" without deanonymizing.

### Problem 5 — Don't let the derivation itself leak identity

Fix the crypto so the "confirm-a-phone-has-an-account" attack dies:
- **Separate the public identifier from the secret.** Do **not** derive the login handle from the phone. Let the server assign a **random** `account_id` at signup. Derive only *secret* material (keys/verifiers) from user inputs. A leaked `account_id` then reveals nothing and narrows no brute-force.
- **Use a memory-hard KDF with a high, secret cost.** Argon2id (or scrypt) with strong parameters, so offline brute force of even a 33-bit phone is economically painful.
- **Prefer OPAQUE over "store a password verifier" rolled by hand** — it's the standardized, precomputation-resistant way to do password auth with no server-side secret to steal.
- **High-entropy, unique salt** — ideally server-issued-and-remembered per account rather than user-invented, so it's not the low-entropy weak point (a random salt the *client* stores in its keychain, backed up via the recovery codes).

### Problem 6 — Regulated flows (payments, KYC/AML)

Be honest: **you cannot be PII-less where the law demands KYC.** The pattern is *scope isolation*: keep the app PII-less for the general product, and when a user enters a regulated flow, route *that transaction* through a compliant KYC provider (Persona, Onfido, etc.) that holds the PII under the appropriate license — the way marketplaces bolt on Stripe Identity only at payout time. The rest of the app stays clean.

---

## A stronger architecture (what I'd actually ship)

The synthesis: keep the restaurant-token *feel*, but **split the four concerns** the original design fused into one `uuid`, and back each with a proven primitive.

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. IDENTIFIER        server-assigned RANDOM account_id (opaque).      │
│                      NOT derived from the phone. Safe to log/share.   │
│                                                                       │
│ 2. AUTHENTICATION    OPAQUE (aPAKE): user proves the password;        │
│                      server stores only an envelope. Or a Passkey.    │
│                                                                       │
│ 3. SECOND FACTOR     TOTP or WebAuthn. No phone number stored.        │
│                                                                       │
│ 4. SYBIL / VERIFY    Separate verifier service: phone-OTP once →      │
│                      blind-signed "unique human" token + nullifier.   │
│                      App stores the nullifier, never the phone.       │
│                                                                       │
│ 5. BANS              Applied to the nullifier, so a re-enroll of the  │
│                      same human is refused.                           │
│                                                                       │
│ 6. RECOVERY          One-time recovery codes at signup (+ optional    │
│                      Shamir social recovery / synced passkeys).       │
│                                                                       │
│ 7. REGULATED FLOWS   Isolated KYC provider, invoked only when the     │
│                      law requires it; rest of app stays PII-less.     │
└─────────────────────────────────────────────────────────────────────┘
```

What this achieves against the four original requirements: the app database, fully breached, yields only `{ random account_id, OPAQUE envelope, TOTP secret, nullifier, recovery-code hashes }` — **not one reversible piece of PII.** Yet you have a real second factor, real Sybil-resistance, real bans that bite the human, and real recovery. The trilemma's other two corners were paid by an *isolated verifier* and *the user's own offline codes*, not by the app hoarding identity.

The restaurant analogy survives intact: the `account_id` is token 47, the OPAQUE password is the recipe only you know, the nullifier is the kitchen's private tally that stops you claiming two meals for one payment — and none of it is written under your name.

---

## Reference implementation sketch (TypeScript)

Illustrative, not production. It shows the *shape* of the four concerns.

```typescript
import { hash as argon2, verify as argon2Verify } from "@node-rs/argon2";
import { createHmac, randomUUID, randomBytes } from "node:crypto";

// ── 1. IDENTIFIER: random, server-assigned, NOT derived from PII ──────────
function newAccountId(): string {
  return randomUUID();               // opaque, safe to log/share
}

// ── 2. AUTHENTICATION: store a hard-to-crack verifier, never the password ──
// (In production use an OPAQUE library so the password never crosses the wire
//  at all. Argon2id here shows the "no plaintext, memory-hard" principle.)
async function makePasswordVerifier(password: string): Promise<string> {
  return argon2(password, { memoryCost: 19_456, timeCost: 2, parallelism: 1 });
}
async function checkPassword(password: string, verifier: string): Promise<boolean> {
  return argon2Verify(verifier, password);
}

// ── 4. SYBIL / VERIFY: runs ONLY inside the isolated verifier service. ──────
// The app never sees phoneE164. HMAC key lives in an HSM, never exported.
function phoneNullifier(phoneE164: string, hsmKey: Buffer): string {
  const canonical = phoneE164.replace(/[^\d+]/g, "");   // strict normalization
  return createHmac("sha256", hsmKey).update(canonical).digest("hex");
}

// The verifier issues a token only if this human hasn't enrolled before,
// and hands the APP only { accountId, nullifier } — never the phone.
const seenNullifiers = new Set<string>();              // stand-in for a table
function enrollUniqueHuman(phoneE164: string, hsmKey: Buffer):
  | { ok: true; accountId: string; nullifier: string }
  | { ok: false; reason: "already_enrolled" | "banned" }
{
  const nullifier = phoneNullifier(phoneE164, hsmKey);
  if (bannedNullifiers.has(nullifier)) return { ok: false, reason: "banned" };
  if (seenNullifiers.has(nullifier))   return { ok: false, reason: "already_enrolled" };
  seenNullifiers.add(nullifier);
  return { ok: true, accountId: newAccountId(), nullifier };
}

// ── 5. BANS bite the human, not the disposable id ──────────────────────────
const bannedNullifiers = new Set<string>();
function banAccount(nullifier: string) { bannedNullifiers.add(nullifier); }

// ── 6. RECOVERY: one-time codes; store only their hashes ───────────────────
async function issueRecoveryCodes(n = 10): Promise<{ show: string[]; store: string[] }> {
  const show = Array.from({ length: n }, () => randomBytes(6).toString("hex"));
  const store = await Promise.all(show.map((c) => argon2(c)));   // never store plaintext
  return { show, store };            // show[] printed once to the user, then forgotten
}
```

The whole app-side user record is now: `{ accountId, passwordVerifier, totpSecret, nullifier, recoveryCodeHashes[] }`. Dump it and you learn *nothing* about who anyone is.

---

## PRD (Product Requirements Document)

**Product:** PII-less Authentication — "log in like a restaurant token."

**Problem.** Users are forced to surrender PII to every service, spreading their identity across hundreds of breachable databases. Companies carry that PII as a liability (breach risk, compliance cost, user distrust).

**Vision.** A signup/login system where the company holds **no reversible PII**, users authenticate with a token only they can reproduce, and the company keeps abuse control and the user keeps recovery.

**Goals**
- G1 — A full breach of the app database reveals no user's phone, email, or real name.
- G2 — Users sign up once and log in repeatedly, across devices, without a PII channel.
- G3 — Real 2FA (TOTP/passkey), not dependent on storing a phone number.
- G4 — Sybil-resistance: one verified human ≈ one account; bans bite the human.
- G5 — Recovery without email/SMS (offline codes; optional social recovery).

**Non-goals**
- NG1 — PII-less operation inside *regulated* flows (payments, lending, KYC) — legally impossible; isolate those.
- NG2 — Defending a compromised *client device* (out of base threat model).
- NG3 — Anonymity from a lawful-intercept order routed through the isolated verifier.

**User stories**
- As a privacy-conscious user, I sign up giving the app no email/phone, and I trust that a breach can't leak me.
- As a returning user, I re-derive my credentials on any device and log back in.
- As an abuse-fighting admin, I ban a rule-breaker such that they can't cheaply make a new account.
- As a user who lost my phone, I recover my account with a code I saved at signup.

**Functional requirements**
- FR1 — App stores only `{ accountId, passwordVerifier|OPAQUE envelope, totpSecret, nullifier, recoveryCodeHashes[] }`.
- FR2 — Phone verification (if used) runs in an **isolated verifier**; the app receives a blind-signed token + nullifier, never the number.
- FR3 — Login uses aPAKE (OPAQUE) or a passkey; the password/private key never reaches the server.
- FR4 — The public `accountId` is random and independent of any user secret.
- FR5 — Bans and uniqueness are enforced on the nullifier.
- FR6 — Recovery codes issued once at signup; only hashes stored.

**Success metrics**
- 0 PII fields in the app schema (audited).
- Sybil rate: < X duplicate humans per 1,000 accounts (measured via nullifier collisions caught).
- Account-recovery success rate for users who kept their codes.
- Login success rate / drop-off vs. a conventional email+OTP baseline (UX cost of the model).

**Key risks**
- R1 — HSM/nullifier key compromise → phone numbers become brute-forceable. *Mitigation:* hardware key custody, rotation plan, pepper.
- R2 — Recovery-code loss → permanent lockout (higher than normal). *Mitigation:* social recovery option, clear onboarding.
- R3 — UX friction of remembering derivation inputs → churn. *Mitigation:* client-stored salt in keychain, passkeys, minimize memorized secrets.

---

## 🧠 Q&A Bank

**1. In one sentence, what is this design?**
A login system that derives a bearer credential on the client from the user's own inputs and stores only the non-reversible result server-side, so the company authenticates you without ever holding your PII — the restaurant-token model made cryptographic.

**2. Why is it fundamentally hard — what's the trilemma?**
Privacy (hold no PII), Sybil-resistance (one human = one account), and Recoverability/accountability (reset, ban a person, comply with law) pull against each other; you can't cheaply have all three. The design maximizes Privacy, so the bill comes due as exactly the two problems it foresaw — no OTP channel (accountability corner) and Sybil explosion (uniqueness corner).

**3. "No PII means no 2FA" — true?**
No. It means no *SMS* 2FA. TOTP (RFC 6238) and passkeys/WebAuthn give a real second factor with zero phone number stored — and are more secure than SMS (no SIM-swap). You lose only the weakest delivery channel.

**4. How do you verify a real phone number without keeping it?**
Run verification in a *separate* service that OTP-checks the phone once, issues a **blind-signed** "unique human" token (Privacy Pass pattern), reduces the phone to a one-way **nullifier**, and hands the app only the token + nullifier. Verification is decoupled from storage; the breachable app holds no phone number.

**5. How do you stop one person making unlimited accounts?**
A **nullifier** keyed on a scarce resource: `HMAC(hsm_key, phone)` computed only in the verifier, which refuses a second token per nullifier. Stronger option: proof-of-personhood (World ID). Cheaper deterrent: make accounts cost something (deposit/PoW/paywall) — the "tokens aren't free" insight from the restaurant itself.

**6. If you ban an account, why doesn't the user just remake one?**
Because the ban is applied to the **nullifier**, not the throwaway `account_id`. Re-enrolling with the same phone reproduces the same nullifier, and the verifier refuses a fresh token. The ban bites the human.

**7. What's the crypto flaw in the original `uuid = f(phone, salt, message)`?**
Two: (a) it makes the *public identifier* a function of a *secret*, so leaking the uuid narrows an offline brute-force; and (b) a phone is only ~33 bits, so with a weak salt an attacker can confirm whether a given number has an account — re-identifying users. Fix: random server-assigned identifier + memory-hard KDF (Argon2id) + high-entropy secret salt, or just use OPAQUE.

**8. Is any of this new?**
The *primitives* are all solved and shipped (OPAQUE, LessPass, Hide My Email, Privacy Pass, World ID nullifiers, passkeys, Shamir recovery). The design's contribution is the *bundle and the product framing* — assembling them behind a restaurant-token UX so the seams don't leak PII. That assembly, done right, is the real work.

**9. How is account recovery possible with no email/SMS?**
One-time **recovery codes** printed at signup (GitHub model), optionally **Shamir social recovery** among guardians (Argent model), or synced passkeys that the platform keychain already recovers. All PII-free.

**10. Where does the model legitimately break down?**
Regulated flows (payments, KYC/AML) legally require knowing the customer — there you isolate a compliant KYC provider for *that* transaction and keep the rest of the app PII-less. And a compromised client device is out of the base threat model.

**11. Why not just device-fingerprint to stop Sybils?**
Because fingerprinting *is* covert PII harvesting — it re-introduces the exact tracking the design exists to abolish. Rejecting it is a principle, not an omission.

**12. What does a full database breach reveal in the shipped architecture?**
Only `{ random account_id, OPAQUE envelope, TOTP secret, nullifier, recovery-code hashes }` — nothing reversible to a real person. That single fact is the whole point of the design.

---

## ✅ Recap

- **The idea:** derive a bearer credential on the client from the user's inputs; store only the non-reversible result — the restaurant token, made cryptographic — so the company never holds PII.
- **The catch is a trilemma:** Privacy vs. Sybil-resistance vs. Recoverability/accountability can't all be free. The two problems foreseen (no OTP, multiple accounts) are exactly the bill for the two corners the design didn't optimize.
- **The unlock:** *separate verification from storage.* A phone can be verified once by an isolated service that hands the app only a blind-signed token + a **nullifier**, so the breachable app stores no PII yet gains phone-verification, Sybil-resistance, and human-biting bans.
- **2FA survives** as TOTP/passkeys; **recovery survives** as one-time codes / social recovery; **regulated flows** are isolated to a compliant KYC provider.
- **Nothing here is a new primitive** — OPAQUE, blind signatures, nullifiers, passkeys, and Shamir recovery already solve every piece. The engineering is the *assembly*: split the fused `uuid` into a random identifier + aPAKE auth + TOTP + nullifier + recovery codes, and a full breach then reveals nothing about anyone.
