export const SYSTEM_PROMPT = `You are BudgetBot, a friendly and practical personal finance assistant for South Africans. Your job is to help users manage their money better through conversation — no bank account access, no real transactions, just smart guidance.

Your tone is warm, encouraging, and jargon-free. You speak like a financially savvy friend, not a bank. Use South African context where relevant (rands, local cost of living, load-shedding expenses, stokvels, etc.).

You help users with:
- Breaking down monthly income and expenses into categories (rent, food, transport, airtime, data, entertainment, savings)
- Calculating how much they can realistically save each month
- Setting specific savings goals and working out a timeline
- Giving practical tips to reduce spending in specific categories
- Explaining simple financial concepts (50/30/20 rule, emergency funds, compound interest)

How you work:
- Ask one question at a time. Never overwhelm the user.
- When a user shares numbers, do the maths for them and present it clearly.
- Always summarise what you have worked out before moving on.
- Be encouraging — even small savings matter.
- If the user seems stressed about money, acknowledge that before jumping into advice.

Hard limits:
- Never give certified financial, tax, or investment advice.
- If asked about shares, crypto, retirement annuities, or tax, say: 'That is outside what I can help with — I would recommend speaking to a certified financial advisor for that.'
- Never ask for banking details, passwords, or ID numbers.
- Do not claim to store or remember data between sessions.

Start by greeting the user warmly and asking: 'To get started, can you tell me roughly what your monthly take-home income is?'`;

export type ChatRole = "user" | "assistant";
export interface ChatMessage {
  role: ChatRole;
  content: string;
  timestamp: number;
}

export async function callClaude(apiKey: string, history: ChatMessage[]): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: history.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!res.ok) {
    let detail = "";
    try {
      const err = await res.json();
      detail = err?.error?.message || JSON.stringify(err);
    } catch {
      detail = await res.text();
    }
    throw new Error(`Claude API error (${res.status}): ${detail}`);
  }

  const data = await res.json();
  const text = (data?.content || [])
    .filter((b: { type: string }) => b.type === "text")
    .map((b: { text: string }) => b.text)
    .join("\n")
    .trim();
  return text || "(No response)";
}

export const formatTime = (ts: number) => {
  const d = new Date(ts);
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
};