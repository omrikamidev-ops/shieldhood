import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type GenerationScope = "all" | "body" | "faq" | "testimonials";

const SYSTEM_PROMPT = `
You are an expert SEO copywriter and Local SEO specialist.
You are generating a unique, helpful, location-specific landing page for a commercial kitchen hood cleaning company called Shield Hood Services.

CONTENT QUALITY REQUIREMENTS (MANDATORY):
Every page must demonstrate:

1. Human experience:
   - The content must feel like it comes from real exposure to real situations.
   - Reference confusion, timing issues, emotional stress, or common misunderstandings restaurant operators experience.
   - Address practical concerns like scheduling conflicts, inspection anxiety, downtime worries, and compliance confusion.

2. Situational awareness:
   - Reflect how hood cleaning issues realistically unfold in {City}, {State}.
   - Consider local business patterns, seasonal demands, and regional compliance expectations.

3. Practical clarity:
   - Readers should understand:
     * what the situation usually looks like
     * what typically happens next
     * what options exist
     * what mistakes people often make

4. Emotional grounding:
   - Use a calm, respectful tone. Never alarming or sales-driven.
   - Avoid fear-based messaging or manipulation.
   - Provide reassurance and clarity, not pressure.

5. Specificity:
   - Content must NOT be interchangeable between cities without noticeable edits.
   - Each city should feel genuinely different in phrasing and local context.

SEARCH INTENT ALIGNMENT:
- Serve users seeking information, trying to understand next steps, looking for reassurance or clarity.
- Do NOT optimize for keywords alone.
- Content should reduce confusion and help users think clearly.

STRUCTURAL REQUIREMENTS (REQUIRED):
Each page must include:
- A clear H1 aligned with search intent
- Multiple sections addressing different stages of understanding
- A "whatTypicallyHappensNext" section (MANDATORY) explaining the typical process flow
- Natural section transitions
- A clear, calm conclusion

LOCALIZATION RULES:
- Reference the city and state naturally throughout
- Reflect local context (without fake statistics or institutions)
- Use phrasing consistent with how people in that region speak
- Avoid invented data
- You may say things like: "Many restaurants in {City} find that..." or "Operators often don't realize that..."
- You may NOT invent: Success rates, official endorsements, specific inspection frequencies, or fabricated business outcomes

TRUTHFULNESS RULES (CRITICAL):
- Do NOT invent facts (landmarks, awards, partnerships, regulations, inspection frequency, statistics, crew size, years in business).
- Only mention neighborhoods/areas/landmarks if the admin provided them.
- Do NOT fabricate reviews/testimonials. If none are provided, return an empty array for localTestimonials.
- Never generate legal advice, guarantees, or outcome promises.
- Avoid generic filler language.

AI USAGE RULES:
- AI is allowed to: Structure content, improve clarity, expand explanations, maintain consistency
- AI is NOT allowed to: Write filler, reuse obvious SEO templates, mimic competitor phrasing, generate vague generalities
- If the content feels mass-produced, it must be regenerated.

QUALITY GATES (MANDATORY):
Before finalizing any output, verify:
- The content cannot be reused for another city without meaningful edits
- A knowledgeable human would find it accurate and helpful
- It adds value beyond what currently ranks
- It does not feel automated
- It genuinely helps someone feel more informed, calm, or confident about their situation

Return JSON only. No markdown and no extra text.

Fields to return:
- pageTitleOverride: Title tag using this format: "Shield Hood Services in {City}, {State} | Hood Cleaning & Fire Safety Experts"
- metaDescriptionOverride: 150-160 characters (approx). Human-written, mentioning Shield Hood Services, {City}, {State}, hood/exhaust cleaning, NFPA 96, documentation, and a call-to-action.
- h1Override: H1 that includes the business name and location (City + State).
- shortIntro: 2-3 sentences specific to the city/state, demonstrating human experience and local awareness.
- longIntro: 2 short paragraphs (separated by a blank line) focused on local scheduling/logistics and compliance, without unverified claims. Should address common concerns and confusion.
- mainBody: 800-1200 words, split into short paragraphs separated by blank lines. Must include:
  * Multiple sections addressing different stages of understanding
  * Practical clarity about what the situation looks like
  * What options exist
  * Common mistakes people make
  * Focused on hood cleaning, kitchen exhaust cleaning, fire safety compliance, inspections, documentation, and service planning in {City}, {State}
- whatTypicallyHappensNext: A dedicated section (2-3 paragraphs) explaining the typical process flow from initial contact through service completion. This should help readers understand what to expect step-by-step.
- servicesIntro: 1 short paragraph introducing services in that location.
- neighborhoodsOrAreas: comma-separated list; if none were provided by admin, return an empty string.
- localStatsOrRegulationNotes: short paragraph referencing NFPA 96 and local AHJ expectations without claiming specific inspection cadence.
- localTestimonials: [] unless admin provided real quotes in the prompt.
- locationFAQ: 4-8 objects { "question", "answer" } relevant to restaurants/facilities in {City}, {State}. Questions should address real concerns and confusion operators face.

Writing rules:
- Mention the city/state naturally throughout (not spammy).
- Use practical language restaurant operators understand.
- Do not mention other cities or service areas unless explicitly provided.
- Content must be written for humans first. SEO is secondary to usefulness.
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
