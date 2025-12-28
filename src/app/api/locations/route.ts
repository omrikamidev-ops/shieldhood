import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ensureUniqueSlug, generateLocationSlug } from "@/lib/slug";
import { stringifyFaq } from "@/lib/faq";

const parseBoolean = (value: unknown) => value === true || value === "true";

const parseFaq = (value: unknown) => {
  if (!value) return undefined;
  if (Array.isArray(value)) return stringifyFaq(value);
  if (typeof value === "string") {
    try {
      return stringifyFaq(JSON.parse(value));
    } catch {
      return stringifyFaq([]);
    }
  }
  return stringifyFaq([]);
};

const parseTestimonials = (value: unknown) => {
  if (!value) return undefined;
  if (Array.isArray(value)) return JSON.stringify(value);
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value));
    } catch {
      return JSON.stringify([]);
    }
  }
  return undefined;
};

export async function GET() {
  const locations = await prisma.location.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(locations);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.city || !body.state) {
      return NextResponse.json({ error: "City and state are required." }, { status: 400 });
    }

    const desiredSlug = body.slug || generateLocationSlug(body.city, body.state);
    const uniqueSlug = await ensureUniqueSlug(desiredSlug, async (candidate) => {
      const existing = await prisma.location.findUnique({ where: { slug: candidate } });
      return Boolean(existing);
    });

    const locationFaq = parseFaq(body.locationFAQ);
    const testimonials = parseTestimonials(body.localTestimonials);

    const created = await prisma.location.create({
      data: {
        city: body.city,
        regionOrCounty: body.regionOrCounty || body.countyOrRegion || "",
        state: body.state,
        country: body.country || "USA",
        slug: uniqueSlug,
        pageTitleOverride: body.pageTitleOverride,
        metaDescriptionOverride: body.metaDescriptionOverride,
        h1Override: body.h1Override,
        streetAddress: body.streetAddress,
        zip: body.zip,
        phoneOverride: body.phoneOverride,
        shortIntro: body.shortIntro || "",
        longIntro: body.longIntro || "",
        mainBody: body.mainBody || body.longIntro || body.shortIntro || "City-specific hood cleaning details.",
        whatTypicallyHappensNext: body.whatTypicallyHappensNext,
        servicesIntro: body.servicesIntro,
        neighborhoodsOrAreas: body.neighborhoodsOrAreas,
        localLandmarks: body.localLandmarks,
        localStatsOrRegulationNotes: body.localStatsOrRegulationNotes,
        localTestimonials: testimonials,
        locationFAQ: locationFaq,
        googleMapsEmbedUrl: body.googleMapsEmbedUrl || "",
        published: parseBoolean(body.published),
      },
    });

    const services = await prisma.service.findMany();
    if (services.length) {
      await prisma.locationService.createMany({
        data: services.map((service) => ({
          locationId: created.id,
          serviceId: service.id,
        })),
      });
    }

    revalidatePath("/locations");
    revalidatePath(`/locations/${created.slug}`);

    return NextResponse.json(created);
  } catch (error) {
    console.error("Create location failed", error);
    return NextResponse.json({ error: "Unable to create location." }, { status: 500 });
  }
}
