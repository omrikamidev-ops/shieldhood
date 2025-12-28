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

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locationId = Number(id);
  const location = await prisma.location.findUnique({
    where: { id: locationId },
  });

  if (!location) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(location);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const locationId = Number(id);
    const body = await request.json();

    const existing = await prisma.location.findUnique({ where: { id: locationId } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const desiredSlug = body.slug || generateLocationSlug(body.city || existing.city, body.state || existing.state);
    const uniqueSlug = await ensureUniqueSlug(desiredSlug, async (candidate) => {
      const found = await prisma.location.findUnique({ where: { slug: candidate } });
      return Boolean(found && found.id !== locationId);
    });

    const locationFaq = parseFaq(body.locationFAQ);
    const testimonials = parseTestimonials(body.localTestimonials);

    const updated = await prisma.location.update({
      where: { id: locationId },
      data: {
        city: body.city ?? existing.city,
        regionOrCounty: body.regionOrCounty ?? body.countyOrRegion ?? existing.regionOrCounty,
        state: body.state ?? existing.state,
        country: body.country ?? existing.country,
        slug: uniqueSlug,
        pageTitleOverride: body.pageTitleOverride,
        metaDescriptionOverride: body.metaDescriptionOverride,
        h1Override: body.h1Override,
        streetAddress: body.streetAddress,
        zip: body.zip,
        phoneOverride: body.phoneOverride,
        shortIntro: body.shortIntro ?? existing.shortIntro,
        longIntro: body.longIntro ?? existing.longIntro,
        mainBody: body.mainBody ?? existing.mainBody,
        whatTypicallyHappensNext: body.whatTypicallyHappensNext,
        servicesIntro: body.servicesIntro,
        neighborhoodsOrAreas: body.neighborhoodsOrAreas,
        localLandmarks: body.localLandmarks,
        localStatsOrRegulationNotes: body.localStatsOrRegulationNotes,
        localTestimonials: testimonials ?? existing.localTestimonials,
        locationFAQ: locationFaq ?? existing.locationFAQ,
        googleMapsEmbedUrl: body.googleMapsEmbedUrl ?? existing.googleMapsEmbedUrl,
        published: parseBoolean(body.published),
      },
    });

    revalidatePath("/locations");
    revalidatePath(`/locations/${updated.slug}`);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update location failed", error);
    return NextResponse.json({ error: "Unable to update location." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const locationId = Number(id);
    const existing = await prisma.location.findUnique({ where: { id: locationId } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.location.delete({ where: { id: locationId } });
    revalidatePath("/locations");
    revalidatePath(`/locations/${existing.slug}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete location failed", error);
    return NextResponse.json({ error: "Unable to delete location." }, { status: 500 });
  }
}
