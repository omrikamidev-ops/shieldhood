import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type LeadPayload = {
  name?: string;
  email?: string;
  phone?: string;
  restaurantName?: string;
  message?: string;
  city?: string;
  locationSlug?: string;
  locationId?: number;
  pageUrl?: string;
};

const buildEmailBody = (payload: Required<Pick<LeadPayload, "name" | "phone">> & LeadPayload) => {
  const lines = [
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    payload.email ? `Email: ${payload.email}` : null,
    payload.restaurantName ? `Restaurant: ${payload.restaurantName}` : null,
    payload.city ? `City: ${payload.city}` : null,
    payload.pageUrl ? `Page: ${payload.pageUrl}` : null,
    payload.message ? `Message: ${payload.message}` : null,
  ].filter(Boolean);

  return lines.join("\n");
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadPayload;
    const { name, email, phone, restaurantName, message, city, locationSlug, locationId, pageUrl } =
      body;

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

    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const settings = await prisma.globalSettings.findFirst();
      const toEmail = process.env.RESEND_TO_EMAIL || settings?.primaryEmail;
      const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

      if (toEmail) {
        const emailText = buildEmailBody({ name, phone, email, restaurantName, message, city: leadCity, pageUrl });
        const subjectCity = leadCity ? ` - ${leadCity}` : "";

        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [toEmail],
            subject: `New hood cleaning lead${subjectCity}`,
            text: emailText,
            reply_to: email || undefined,
          }),
        });

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          console.error("Resend email failed", errorText);
          return NextResponse.json({ error: "Unable to send email notification" }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Lead submission failed", error);
    return NextResponse.json({ error: "Unable to submit lead" }, { status: 500 });
  }
}
