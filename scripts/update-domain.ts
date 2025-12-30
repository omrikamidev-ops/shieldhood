import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateDomain() {
  try {
    const updated = await prisma.globalSettings.upsert({
      where: { id: 1 },
      update: {
        baseDomain: "https://hoodscleaning.net",
        primaryEmail: "hello@hoodscleaning.net",
      },
      create: {
        id: 1,
        businessName: "Shield Hood Services",
        primaryPhone: "(844) 555-0100",
        primaryEmail: "hello@hoodscleaning.net",
        baseDomain: "https://hoodscleaning.net",
      },
    });

    console.log("✅ Domain updated successfully!");
    console.log("Base Domain:", updated.baseDomain);
    console.log("Primary Email:", updated.primaryEmail);
  } catch (error) {
    console.error("❌ Error updating domain:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateDomain();
