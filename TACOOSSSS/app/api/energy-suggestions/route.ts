import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/lib/gemini";
import type { LLMUsageSummary } from "@/lib/llm-summary";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      scope, // "all_rooms" | "single_room"
      spaceName, // e.g. "All Rooms" or "Room: Kitchen"
      summary,
    }: { scope: string; spaceName: string; summary: LLMUsageSummary } = body;

    const prompt = `
You are an energy-efficiency assistant.

You receive an aggregated summary of electricity usage for ${
      scope === "all_rooms" ? "multiple rooms" : "a single room"
    }.

Data format:
${JSON.stringify(summary, null, 2)}

Generate 5–8 short, concrete suggestions to reduce energy consumption and cost.
Mix room-level insights and device-level insights where relevant.
Each suggestion should be a single sentence, <150 characters, very actionable.

Return ONLY a valid JSON array of strings.
Example:
[
  "Shift most of the study room heating from 5–8pm to off-peak hours.",
  "Turn off idle monitors in the office outside business hours."
]
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const raw = result.text ?? "[]";

    let insights: string[] = [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        insights = parsed.map(String);
      }
    } catch {
      // Fallback: if model ignores instructions, just wrap raw string
      insights = [raw];
    }

    return NextResponse.json({ insights });
  } catch (error) {
    console.error("Gemini error", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
