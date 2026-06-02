import Anthropic from "@anthropic-ai/sdk";
import type { NextRequest } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `You are an emergency triage assistant. Classify the severity of this incident, give a one-sentence recommended action for first responders, and list the volunteer skill sets needed.

Incident title: ${title}
Description: ${description || "No description provided."}

Respond with valid JSON only, no markdown:
{"severity":"CRITICAL|HIGH|MEDIUM|LOW","action":"one sentence","recommended_skills":"comma-separated skill sets e.g. Medical, Search & Rescue, Firefighting"}`,
        },
      ],
    });

    const raw = (message.content[0] as { type: string; text: string }).text
      ?.trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "") ?? "";

    const parsed = JSON.parse(raw) as { severity: string; action: string; recommended_skills?: string };
    const validSeverities = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
    const severity = validSeverities.includes(parsed.severity) ? parsed.severity : "UNKNOWN";
    return Response.json({ severity, action: parsed.action ?? "", recommended_skills: parsed.recommended_skills ?? "" });
  } catch (err) {
    console.error("Classify error:", err);
    return Response.json({ severity: "UNKNOWN", action: "" }, { status: 200 });
  }
}
