import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ensureUniqueSlug } from "@/lib/slug";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const locationId = Number(id);
    const location = await prisma.location.findUnique({ where: { id: locationId } });
    if (!location) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const slugBase = `${location.slug}-copy`;
    const newSlug = await ensureUniqueSlug(slugBase, async (candidate) => {
      const found = await prisma.location.findUnique({ where: { slug: candidate } });
      return Boolean(found);
    });

    const duplicate = await prisma.location.create({
      data: {
        city: `${location.city} (Copy)`,
        regionOrCounty: location.regionOrCounty,
        state: location.state,
        country: location.country,
        slug: newSlug,
        pageTitleOverride: location.pageTitleOverride,
        metaDescriptionOverride: location.metaDescriptionOverride,
        h1Override: location.h1Override,
        streetAddress: location.streetAddress,
        zip: location.zip,
        phoneOverride: location.phoneOverride,
        shortIntro: location.shortIntro,
        longIntro: location.longIntro,
        mainBody: location.mainBody,
        servicesIntro: location.servicesIntro,
        neighborhoodsOrAreas: location.neighborhoodsOrAreas,
        localLandmarks: location.localLandmarks,
        localStatsOrRegulationNotes: location.localStatsOrRegulationNotes,
        localTestimonials: location.localTestimonials,
        locationFAQ: location.locationFAQ,
        googleMapsEmbedUrl: location.googleMapsEmbedUrl,
        published: false,
      },
    });

    const linkedServices = await prisma.locationService.findMany({
      where: { locationId: location.id },
    });

    if (linkedServices.length) {
      await prisma.locationService.createMany({
        data: linkedServices.map((link) => ({
          locationId: duplicate.id,
          serviceId: link.serviceId,
          localNotes: link.localNotes,
        })),
      });
    }

    revalidatePath("/locations");

    return NextResponse.json(duplicate);
  } catch (error) {
    console.error("Duplicate location failed", error);
    return NextResponse.json({ error: "Unable to duplicate location." }, { status: 500 });
  }
}
