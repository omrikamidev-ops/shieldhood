import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { stringifyFaq } from "@/lib/faq";

export async function GET() {
  const settings = await prisma.globalSettings.findFirst();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    let faqItems = body.faqItems;
    if (body.globalFAQ) {
      try {
        faqItems = JSON.parse(body.globalFAQ);
      } catch (error) {
        console.warn("Failed to parse global FAQ", error);
      }
    }
    const faq = stringifyFaq(faqItems);

    const updated = await prisma.globalSettings.upsert({
      where: { id: body.id || 1 },
      update: {
        businessName: body.businessName,
        primaryPhone: body.primaryPhone,
        primaryEmail: body.primaryEmail,
        baseDomain: body.baseDomain,
        defaultStreetAddress: body.defaultStreetAddress,
        defaultCity: body.defaultCity,
        defaultState: body.defaultState,
        defaultZip: body.defaultZip,
        defaultCountry: body.defaultCountry,
        globalServiceDescription: body.globalServiceDescription,
        globalFAQ: faq,
      },
      create: {
        id: 1,
        businessName: body.businessName,
        primaryPhone: body.primaryPhone,
        primaryEmail: body.primaryEmail,
        baseDomain: body.baseDomain,
        defaultStreetAddress: body.defaultStreetAddress,
        defaultCity: body.defaultCity,
        defaultState: body.defaultState,
        defaultZip: body.defaultZip,
        defaultCountry: body.defaultCountry,
        globalServiceDescription: body.globalServiceDescription,
        globalFAQ: faq,
      },
    });

    revalidatePath("/");
    revalidatePath("/locations");

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update settings failed", error);
    return NextResponse.json({ error: "Unable to update settings." }, { status: 500 });
  }
}
