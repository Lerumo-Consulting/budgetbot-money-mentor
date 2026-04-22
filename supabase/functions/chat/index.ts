import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are BudgetBot, a friendly and practical personal finance assistant for South Africans. Your job is to help users manage their money better through conversation — no bank account access, no real transactions, just smart guidance.

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

Start by greeting the user warmly with something like: "Hey, I'm BudgetBot — I can help you manage your money and save smarter." Then ask: "To get started, can you tell me roughly what your monthly take-home income is?"`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages must be an array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to your Lovable workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});