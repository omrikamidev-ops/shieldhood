import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, restaurantName, message, city, locationSlug, locationId, pageUrl } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required." },
        { status: 400 },
      );
    }

    let targetLocationId: number | undefined = locationId;
    let leadCity = city as string | undefined;

    if (!targetLocationId && locationSlug) {
      const location = await prisma.location.findUnique({
        where: { slug: locationSlug },
      });

      if (location) {
        targetLocationId = location.id;
        leadCity = leadCity || `${location.city}, ${location.state}`;
      }
    }

    await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        restaurantName,
        message,
        city: leadCity,
        locationId: targetLocationId,
        pageUrl,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Lead submission failed", error);
    return NextResponse.json({ error: "Unable to submit lead" }, { status: 500 });
  }
}
