// src/pages/api/chat.ts
import type { APIRoute } from "astro";
import OpenAI from "openai";
import { KNOWLEDGE_BASE } from "@/integrations/chatbot/knowledge-base.generated";
import { SITE_URL } from "@/content/siteDomain.js";

export const prerender = false;

const ALLOWED_ORIGIN = SITE_URL.replace(/\/$/, "");

const rateMap = new Map<string, { count: number; ts: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.ts > RATE_WINDOW_MS) {
    rateMap.set(ip, { count: 1, ts: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  if (import.meta.env.DEV) return true;
  return origin === ALLOWED_ORIGIN;
}

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin");
  const allowed = !origin || import.meta.env.DEV || origin === ALLOWED_ORIGIN;
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": allowed && origin ? origin : ALLOWED_ORIGIN,
    "Vary": "Origin",
  };
}

export const POST: APIRoute = async ({ request }) => {
  if (!isAllowedOrigin(request)) {
    return new Response(JSON.stringify({ error: "Forbidden." }), { status: 403 });
  }

  const headers = corsHeaders(request);

  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please slow down." }),
        { status: 429, headers }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || !Array.isArray(body.messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid request body." }),
        { status: 400, headers }
      );
    }

    const messages: { role: "user" | "assistant"; content: string }[] =
      body.messages
        .filter(
          (m: unknown) =>
            m &&
            typeof m === "object" &&
            "role" in (m as object) &&
            "content" in (m as object) &&
            ["user", "assistant"].includes((m as { role: string }).role)
        )
        .slice(-10)
        .map((m: { role: "user" | "assistant"; content: string }) => ({
          role: m.role,
          content: String(m.content).slice(0, 1000),
        }));

    if (messages.length === 0 || messages[messages.length - 1]?.role !== "user") {
      return new Response(
        JSON.stringify({ error: "No valid user message found." }),
        { status: 400, headers }
      );
    }

    const openai = new OpenAI({ apiKey: import.meta.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: KNOWLEDGE_BASE },
        ...messages,
      ],
      max_tokens: 150,
      temperature: 0.3,
    });

    const rawReply = completion.choices[0]?.message?.content?.trim();

    const reply = rawReply
      ?.replace(/—/g, "-")
      ?.replace(/–/g, "-")
      ?.replace(/--/g, "-")
      ?.replace(/\*\*(.*?)\*\*/g, "$1")
      ?.replace(/\*(.*?)\*/g, "$1")
      ?.trim();

    if (!reply) {
      return new Response(
        JSON.stringify({ error: "No response from AI." }),
        { status: 500, headers }
      );
    }

    return new Response(JSON.stringify({ reply }), { status: 200, headers });
  } catch (err) {
    console.error("[ChatBot API Error]", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong." }),
      { status: 500, headers }
    );
  }
};

export const OPTIONS: APIRoute = ({ request }) => {
  if (!isAllowedOrigin(request)) {
    return new Response(null, { status: 403 });
  }
  const origin = request.headers.get("origin") ?? "";
  const allowed = !origin || import.meta.env.DEV || origin === ALLOWED_ORIGIN;
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": allowed && origin ? origin : ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin",
    },
  });
};
