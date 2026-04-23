# 📖 BudgetBot — Project Documentation

_Group Project Deliverable — CAPACITI × Clickatell AI Bootcamp 2026_

---

## 1. Project Overview

**BudgetBot** is a functional AI chatbot prototype that helps South Africans
manage their personal finances through natural conversation. It is built as a
web app on **Lovable Cloud** with the **Lovable AI Gateway** powering the
language model.

- **Type:** Conversational AI assistant (web-based)
- **Domain:** Personal budgeting & savings (South African context)
- **Audience:** Everyday South Africans wanting practical money guidance
- **Status:** Working prototype — live and publicly accessible

🔗 **Live demo:** https://budgetbot-money-mentor.lovable.app

---

## 2. Defined Use Case

BudgetBot is a **personal finance support assistant**. It is intentionally
narrow in scope to keep responses safe, useful, and on-brand.

### Primary use cases

| # | Use case | Example user message |
|---|----------|----------------------|
| 1 | Income & expense discovery | "I earn R12 000 a month after tax" |
| 2 | Monthly budget breakdown | "Help me budget my salary" |
| 3 | Savings goal planning | "I want to save R10 000 for a laptop in 6 months" |
| 4 | Spending-reduction tips | "How can I cut my grocery bill?" |
| 5 | Financial concept explainer | "What is the 50/30/20 rule?" |

### Out of scope (hard limits)

- Investment, tax, crypto, or retirement-annuity advice
- Anything requiring real bank data, ID numbers, or passwords
- General chit-chat, coding help, news, jokes, sports, relationships, etc.

Off-topic and unintelligible inputs are caught with **deterministic canned
responses** (see `PROMPT_LIBRARY.md` §3).

---

## 3. Functional Prototype — Features

- 💬 **Pop-up chat widget** on the landing page (open / close / maximize)
- 🤖 **Auto-greeting** — bot opens the conversation with a scripted line
- ⌨️ **Streaming responses** via Server-Sent Events for a live-typing feel
- 🔄 **New chat** button to reset the conversation at any time
- 📱 **Responsive UI** — works on mobile and desktop
- 🛡️ **Guard rails** — off-topic & gibberish handled with verbatim replies
- 🇿🇦 **Localised** — rands, load-shedding, stokvels baked into the persona
- ❌ **No data storage** — sessions are stateless by design

---

## 4. Architecture

```
 ┌────────────────────────┐        ┌───────────────────────────┐
 │  React + Vite (UI)     │        │  Lovable Cloud            │
 │  ─────────────────────  │  HTTPS │  ───────────────────────  │
 │  BudgetBot.tsx (chat)  │ ─────▶ │  Edge Function: /chat     │
 │  streamChat() (SSE)    │  SSE   │  (supabase/functions/chat)│
 │                        │ ◀───── │                           │
 └────────────────────────┘        └────────────┬──────────────┘
                                                │
                                                ▼
                                   ┌───────────────────────────┐
                                   │  Lovable AI Gateway       │
                                   │  google/gemini-3-flash    │
                                   │  -preview                 │
                                   └───────────────────────────┘
```

- **Frontend:** React 18 + Vite + Tailwind CSS + shadcn/ui
- **Backend:** Supabase Edge Function (`chat`) on Lovable Cloud
- **AI:** `google/gemini-3-flash-preview` via Lovable AI Gateway (no user API key required)
- **Transport:** SSE streaming for token-by-token rendering

---

## 5. Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 + Vite 5 + TypeScript 5 |
| Styling | Tailwind CSS v3 + shadcn/ui |
| Backend | Lovable Cloud (Supabase Edge Functions, Deno) |
| AI Gateway | Lovable AI Gateway |
| Model | `google/gemini-3-flash-preview` |
| Hosting | Lovable.dev |

---

## 6. Project Structure

```
budgetbot/
├── src/
│   ├── components/
│   │   ├── budgetbot/
│   │   │   ├── BudgetBot.tsx        # Main chat UI (header, messages, input)
│   │   │   └── ChatBubble.tsx       # Message bubble + typing indicator
│   │   └── ui/                       # shadcn/ui primitives
│   ├── lib/
│   │   └── budgetbot.ts             # streamChat() SSE client
│   ├── pages/
│   │   ├── Index.tsx                # Landing page + chat popup
│   │   └── NotFound.tsx
│   └── integrations/supabase/
│       └── client.ts                # Auto-generated Supabase client
├── supabase/
│   └── functions/chat/index.ts      # Edge function: SYSTEM_PROMPT + AI call
├── docs/
│   ├── PROMPT_LIBRARY.md            # Full prompt library (see §7)
│   └── PROJECT_DOCUMENTATION.md     # This file
└── README.md
```

---

## 7. Prompt Engineering — Structured Examples

The full prompt library lives in [`PROMPT_LIBRARY.md`](./PROMPT_LIBRARY.md).
Below are condensed, structured examples of the prompts that shape BudgetBot's
behaviour.

### 7.1 System Prompt (excerpt)

```
You are BudgetBot, a friendly and practical personal finance assistant for
South Africans...

Your Role is to:
- Help users to track their expense
- Help create simple monthly budgets
- Give practical tips to reduce spending
- Explaining simple concepts (50/30/20 rule, emergency funds, compound interest)

How you work (Rules):
- Ask one question at a time and always ask follow-up questions before giving advice.
- Do the maths for the user and present it clearly.
- Summarise before moving on.
- Keep responses simple and clear.
- Be supportive and practical not judgemental.

Hard limits:
- No certified financial, tax, or investment advice.
- For shares, crypto, retirement annuities, or tax → recommend a certified advisor.
- Never ask for banking details, passwords, or ID numbers.
- Do not claim to store or remember data between sessions.
```

### 7.2 Greeting Seed Prompt

```
Hi
```

A hidden one-word user message sent on chat open so the model emits the scripted
opening line. The seed is filtered out of the visible chat history.

### 7.3 Canned Responses (deterministic)

| Trigger | Response |
|--------|---------|
| Off-topic | `⚠️ Sorry, I can only help with budgeting and savings. Please ask me something about your income, expenses, or savings goals.` |
| Gibberish / typo | `⚠️ I didn't quite catch that — could you rephrase your message? I'm here to help with your budget and savings.` |
| Restricted topic | `That is outside what I can help with — I would recommend speaking to a certified financial advisor for that.` |

### 7.4 Conversation Flow Example

```
Bot:  Hey! I'm BudgetBot, I can help you manage your money and save smarter.
      To get started, can you tell me roughly what your monthly take-home income is?

User: About R12 000 after tax

Bot:  Great — R12 000 is a solid base. What's your biggest monthly expense
      — is it rent or accommodation?

User: R4 500 on rent

Bot:  Got it — R4 500 is 37.5% of your income, which is within a healthy range
      (ideally keep it under 40%). What do you typically spend on groceries?
```

### 7.5 Prompt Engineering Principles

1. **Explicit persona + scope** — prevents drift into general chit-chat.
2. **Verbatim canned responses** — deterministic guard rails.
3. **One-question-at-a-time** — keeps mobile chat UX clean.
4. **Localisation hooks** — rands, stokvels, load-shedding for relevance.
5. **Hard limits** — explicit "never" list for compliance.
6. **Scripted opening** — guarantees brand-consistent first impression.

---

## 8. How to Run Locally

```bash
git clone <repo-url>
cd budgetbot
npm install
npm run dev
```

Open `http://localhost:5173`. No API key needed — the Lovable AI Gateway is
wired up via Lovable Cloud automatically.

---

## 9. Testing the Prototype

| Scenario | Expected behaviour |
|---------|--------------------|
| Open chat | Bot greets with scripted opening line |
| "I earn R10 000" | Bot asks one follow-up about expenses |
| "What's the weather?" | Off-topic canned response |
| "asdfghjkl" | Gibberish canned response |
| "Should I buy Bitcoin?" | Recommends certified financial advisor |
| Click "New chat" | Conversation resets, opening line replays |
| Maximize button | Chat expands to full screen |

---

## 10. Limitations & Future Work

**Current limitations**
- No persistence — conversations are lost on refresh
- No user accounts or saved budgets
- Single language (English only)
- No export of budget summaries (PDF/CSV)

**Possible next iterations**
- User auth + saved budget history
- Multilingual support (isiZulu, Afrikaans, Sesotho)
- WhatsApp delivery channel via Clickatell
- Downloadable monthly budget reports
- Voice input/output

---

## 11. Team

CAPACITI × Clickatell AI Bootcamp 2026 — Lerumo Consulting cohort.

- Adrian Majavu
- Tumahole Nkhatho
- Phomolo Tleane
- Bonolo Leponesa
- Senamile Maphoso

---

## 12. Related Documents

- [`README.md`](../README.md) — quick-start and overview
- [`PROMPT_LIBRARY.md`](./PROMPT_LIBRARY.md) — full prompt library & change log

---

_Last updated: 2026-04-23._