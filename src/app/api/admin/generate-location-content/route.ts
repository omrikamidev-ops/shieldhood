import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type GenerationScope = "all" | "body" | "faq" | "testimonials";

const SYSTEM_PROMPT = `
You are an expert SEO copywriter and Local SEO specialist.
You are generating a unique, helpful, location-specific landing page for a commercial kitchen hood cleaning company called Shield Hood Services.

Follow Google Search Central and Local SEO best practices:
- Write people-first, helpful content.
- Avoid doorway-page tactics and keyword stuffing.
- Avoid boilerplate phrasing repeated across cities.

Truthfulness rules (critical):
- Do NOT invent facts (landmarks, awards, partnerships, regulations, inspection frequency, statistics, crew size, years in business).
- Only mention neighborhoods/areas/landmarks if the admin provided them.
- Do NOT fabricate reviews/testimonials. If none are provided, return an empty array for localTestimonials.

Return JSON only. No markdown and no extra text.

Fields to return:
- pageTitleOverride: Title tag using this format: "Shield Hood Services in {City}, {State} | Hood Cleaning & Fire Safety Experts"
- metaDescriptionOverride: 150-160 characters (approx). Mention Shield Hood Services, {City}, {State}, hood/exhaust cleaning, NFPA 96, documentation, and a call-to-action.
- h1Override: H1 that includes the business name and location (City + State).
- shortIntro: 2-3 sentences specific to the city/state.
- longIntro: 2 short paragraphs (separated by a blank line) focused on local scheduling/logistics and compliance, without unverified claims.
- mainBody: 800-1200 words, split into short paragraphs separated by blank lines, focused on hood cleaning, kitchen exhaust cleaning, fire safety compliance, inspections, documentation, and service planning in {City}, {State}.
- servicesIntro: 1 short paragraph introducing services in that location.
- neighborhoodsOrAreas: comma-separated list; if none were provided by admin, return an empty string.
- localStatsOrRegulationNotes: short paragraph referencing NFPA 96 and local AHJ expectations without claiming specific inspection cadence.
- localTestimonials: [] unless admin provided real quotes in the prompt.
- locationFAQ: 4-8 objects { "question", "answer" } relevant to restaurants/facilities in {City}, {State}.

Writing rules:
- Mention the city/state naturally throughout (not spammy).
- Use practical language restaurant operators understand.
- Do not mention other cities or service areas unless explicitly provided.
`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      scope = "all",
      city,
      regionOrCounty,
      state,
      country,
      neighborhoodsOrAreas,
      tone,
      locationId,
    } = body as {
      scope?: GenerationScope;
      city?: string;
      regionOrCounty?: string;
      state?: string;
      country?: string;
      neighborhoodsOrAreas?: string;
      tone?: string;
      locationId?: number;
    };

    if (!city || !state) {
      return NextResponse.json({ error: "City and state are required" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY not configured; cannot generate content." },
        { status: 500 },
      );
    }

    const userPrompt = `
Business: Shield Hood Services
City: ${city}
State: ${state}
County/Region (optional): ${regionOrCounty || ""}
Country: ${country || "USA"}
Neighborhoods/areas provided by admin (optional): ${neighborhoodsOrAreas || ""}
Tone: ${tone || "confident, practical, service-first"}
Generate scope: ${scope}
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.8,
        top_p: 0.9,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: userPrompt + "Return strictly valid JSON object with the fields described.",
          },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: "OpenAI error", detail: text }, { status: 500 });
    }

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "No content returned" }, { status: 500 });
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      return NextResponse.json(
        { error: "Failed to parse AI response as JSON", detail: String(err) },
        { status: 500 },
      );
    }

    if (locationId) {
      await prisma.aIContentLog.create({
        data: { locationId, scope },
      });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI generation failed", error);
    return NextResponse.json({ error: "Unable to generate content" }, { status: 500 });
  }
}
