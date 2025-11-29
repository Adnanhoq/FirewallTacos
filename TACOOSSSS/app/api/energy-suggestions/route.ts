// app/api/energy-suggestions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/lib/gemini";

// --- NEW: robust parser for Gemini output ---
function extractInsights(raw: string): string[] {
  // 1) Try direct JSON
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {}

  // 2) Try fenced block ```json ... ```
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) {
    const inner = fenceMatch[1].trim();
    try {
      const parsed = JSON.parse(inner);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {}
  }

  // 3) Try to grab first [ ... ] array substring
  const arrayMatch = raw.match(/\[([\s\S]*?)\]/);
  if (arrayMatch) {
    const candidate = `[${arrayMatch[1]}]`;
    try {
      const parsed = JSON.parse(candidate);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {}
  }

  // 4) Fallback: split into lines / bullets
  return raw
    .split(/\r?\n/)
    .map((line) => line.replace(/^[\s>*\-•]+/, "").trim())
    .filter(Boolean);
}

// ------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scope, spaceName, summary } = body;

    const prompt = `
You are an energy-efficiency assistant.

You receive an aggregated summary of electricity usage for ${
      scope === "all_rooms" ? "multiple rooms" : "a single room"
    }.

Data:
${JSON.stringify(summary, null, 2)}

Generate 5–8 short, concrete suggestions to reduce energy consumption and cost.
Each suggestion must be one sentence, <150 characters, and very actionable.

Return ONLY a JSON array of strings.
Example:
[
  "Turn off lights in empty rooms.",
  "Shift laundry to off-peak hours."
]
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const raw = result.text ?? "[]";
    const insights = extractInsights(raw); // <-- use helper here

    return NextResponse.json({ insights });
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
