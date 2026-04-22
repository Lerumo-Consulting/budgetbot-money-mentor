# 💰 BudgetBot — Personal Budget & Savings Advisor

> A conversational AI chatbot that helps South Africans take control of their personal finances — no bank account access, no jargon, just practical guidance.

Built as a **Week 1 project** for the CAPACITI × Clickatell AI Bootcamp 2026.

---

## 🖥️ Live Demo

🔗 [Try BudgetBot live](https://your-lovable-url.lovable.app) ← *replace with your Lovable URL*

---

## 📌 What it does

BudgetBot is an AI-powered web chatbot that guides you through your personal finances in a natural conversation. No forms, no spreadsheets — just chat.

**BudgetBot helps you:**
- Break down your monthly income and expenses by category
- Calculate how much you can realistically save each month
- Set savings goals (emergency fund, travel, new phone) with a clear timeline
- Get practical, South Africa-specific tips to cut spending
- Understand simple financial concepts like the 50/30/20 rule

**BudgetBot will NOT:**
- Access your bank account or any real financial data
- Give certified financial, tax, or investment advice
- Ask for your banking details, ID number, or passwords
- Store or remember your data between sessions

---

## 🗣️ Example conversation

```
BudgetBot:  Hey! Welcome to BudgetBot. I'm here to help you take control
            of your money — one step at a time. To get started, can you
            tell me roughly what your monthly take-home income is?

You:        About R12 000 after tax

BudgetBot:  Great — R12 000 is a solid starting point to work with.
            Let's figure out where it's going. What's your biggest
            monthly expense — is it rent or accommodation?

You:        Yes, R4 500 a month on rent

BudgetBot:  Got it — R4 500 on rent is 37.5% of your income. That's
            within a healthy range (ideally keep it under 40%).
            What do you typically spend on food and groceries?
```

---

## 🛠️ Tech stack

| Layer | Technology |
|---|---|
| Frontend | React (via Lovable.dev) |
| AI Model | Claude claude-sonnet-4-6 (Anthropic) |
| API | Anthropic Messages API |
| Styling | Tailwind CSS |
| Hosting | Lovable.dev |

---

## 🚀 Getting started

### Prerequisites
- An Anthropic API key — get one free at [console.anthropic.com](https://console.anthropic.com)

### Run locally
```bash
# Clone the repo
git clone https://github.com/YOUR-USERNAME/budgetbot.git
cd budgetbot

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open `http://localhost:5173` in your browser, enter your Anthropic API key when prompted, and start chatting.

### Using the live version
1. Visit the [live app](https://budgetbot-money-mentor.lovable.app/)
2. Enter your Anthropic API key when prompted (saved to your browser only)
3. BudgetBot greets you automatically — just start chatting

---

## 🧠 Prompt engineering

The entire behaviour of BudgetBot is controlled through a carefully crafted system prompt. Key design decisions:

- **Persona** — defined as a "financially savvy SA friend, not a bank" to set tone
- **One question at a time** — prevents overwhelming the user
- **Maths out loud** — bot calculates and shows working to build trust
- **Hard limits** — explicitly declines investment, tax, and crypto advice
- **SA context** — rands, load-shedding costs, stokvels built into the prompt

See [`prompts.md`](./prompts.md) for the full prompt library with documented examples.

---

## 📁 Project structure

```
budgetbot/
├── src/
│   ├── components/
│   │   └── ChatWindow.jsx      # Main chat UI component
│   ├── App.jsx                 # Root app and API key gate
│   └── main.jsx                # Entry point
├── prompts.md                  # Prompt library documentation
├── README.md                   # This file
└── package.json
```

---

## 📸 Screenshots

*Add screenshots of your chatbot here once you have them*

---

## 🔒 API key security

Your Anthropic API key is:
- Entered by you in the browser
- Stored only in your browser's `localStorage`
- Never sent anywhere except directly to the Anthropic API
- Clearable at any time from the app header

> ⚠️ Do not commit your API key to this repository. It is handled client-side only.

---

## 📚 What I learned

This project taught me:
- How to design a system prompt that constrains an AI to a specific, safe domain
- How multi-turn conversation history works with the Anthropic Messages API
- How tone and persona instructions shape the quality and feel of AI responses
- How to set hard scope boundaries to keep a chatbot safe and focused
- How to build and deploy a working AI-powered web app end to end

---

## 👤 Authors

Adrian Majavu
Tumahole Nkhatho
Phomolo Tleane
Bonolo Leponesa
Senamile Maphoso

CAPACITI AI Bootcamp 2026 — Clickatell Cohort
[github.com/YOUR-USERNAME](https://github.com/YOUR-USERNAME)

---

## 📄 Licence

This project was built for educational purposes as part of the CAPACITI AI Bootcamp programme.
