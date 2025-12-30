import { PrismaClient } from "@prisma/client";
import { FAQItem } from "../src/lib/faq";
import { generateLocationSlug } from "../src/lib/slug";

const prisma = new PrismaClient();

const globalFAQ: FAQItem[] = [
  {
    question: "How often should our hood system be cleaned?",
    answer:
      "Most commercial kitchens need a full NFPA-96 cleaning every 3 months. Busy fryers or solid fuel equipment may need monthly service.",
  },
  {
    question: "Do you photograph or document each service?",
    answer:
      "Yes. Every visit includes before-and-after documentation, hood-to-roof inspection notes, and a fresh service sticker for compliance.",
  },
  {
    question: "Are your technicians certified?",
    answer:
      "Our crews are trained on NFPA-96 standards, rooftop safety, and grease waste handling so you pass health and fire inspections smoothly.",
  },
];

const servicesData = [
  {
    name: "Complete Hood System Cleaning",
    slug: "complete-hood-cleaning",
    shortDescription: "Exhaust hoods, duct runs, and rooftops cleaned to bare metal.",
    longDescription:
      "Top-to-bottom hood and duct degreasing, including fan housings, access panels, and polish of exposed stainless surfaces.",
    isPrimary: true,
  },
  {
    name: "Rooftop Exhaust Fan Cleaning",
    slug: "rooftop-exhaust-fan-cleaning",
    shortDescription: "Protect the roof membrane while removing grease overflow.",
    longDescription:
      "Fan blades, shrouds, and drip trays fully degreased with containment to keep grease off roofing systems and parking below.",
    isPrimary: false,
  },
  {
    name: "Filter Exchange Program",
    slug: "filter-exchange-program",
    shortDescription: "Fresh baffle filters delivered and swapped on schedule.",
    longDescription:
      "Keeps airflow strong between full cleanings and reduces fire load inside the hood plenum.",
    isPrimary: false,
  },
  {
    name: "Fire Code Compliance Inspections",
    slug: "fire-code-compliance-inspections",
    shortDescription: "Pre-inspection walk-throughs before the fire marshal visits.",
    longDescription:
      "Documentation, spin tests, and sticker updates so you stay compliant with local ordinances and AHJ requirements.",
    isPrimary: false,
  },
];

const locationsData = [
  {
    city: "Los Angeles",
    regionOrCounty: "Los Angeles County",
    state: "CA",
    country: "USA",
    streetAddress: "123 Sunset Blvd Suite 400",
    zip: "90012",
    phoneOverride: "(323) 555-0140",
    shortIntro:
      "Shield Hood Services keeps LA restaurants, hotel kitchens, and studio commissaries inspection-ready with NFPA-96 compliant cleanings from hood to roof.",
    longIntro:
      "From downtown towers to hillside venues, Los Angeles kitchens face high-volume service and tight health-department schedules. Our crews navigate loading-doc challenges, late-night access windows, and the Los Angeles Fire Department’s documentation requirements. Each visit includes photo reports, fresh service stickers, and grease containment so your chefs can keep lines moving without worrying about citations or downtime.",
    mainBody:
      "Los Angeles kitchens combine late-night traffic, valet bottlenecks, and rooftop equipment perched above tight downtown streets. Grease, soot, and coastal moisture quickly build on hood plenums and duct runs, while rooftop fans take a beating from heat and airborne dust. Shield Hood Services maps each run, sets access points, and builds a service cadence that matches LA County’s expectations. We coordinate with property management for elevator or dock access so your team can stay focused on service. \n\nHealth and fire inspectors in the City of Los Angeles and surrounding municipalities look for clean, accessible ducts, documented fan service, and current service stickers. We deliver before/after photo reports, note any access issues, and replace damaged baffle filters to keep airflow strong. For high-rise hotels, studio commissaries, and busy brunch corridors in Hollywood or West LA, we schedule after closing—often between 11pm and 6am—to reduce lobby and valet disruption. \n\nOur technicians carry containment to protect roof membranes around Hollywood and Koreatown properties. We clean fan blades, shrouds, housings, and drip trays to stop overflow that can stain parapet walls or drip on loading areas. Each service includes documentation aligned to NFPA 96 and local AHJ preferences so you’re inspection-ready when the Los Angeles Fire Department or health department visits. If you add new lines or change menu volume, we adjust frequency and filter rotations so grease never piles up in exhaust paths.",
    servicesIntro:
      "We service late-night kitchens, commissary trailers, sushi bars, and high-rise hotels across the basin. Every service is scheduled around your prep windows to keep ventilation strong and guests comfortable.",
    neighborhoodsOrAreas: "Downtown LA, Arts District, Hollywood, Koreatown, Santa Monica, Culver City, Burbank",
    localLandmarks: "Staples Center, Sunset Strip, Arts District, Koreatown, Santa Monica Pier",
    localStatsOrRegulationNotes:
      "LA County fire inspectors expect visible access panels, documented fan cleanings, and clear service stickers. NFPA 96 calls for quarterly or monthly schedules based on volume; many downtown kitchens run monthly.",
    locationFAQ: [
      {
        question: "Can you service after last seating?",
        answer:
          "Yes. Most Los Angeles cleanings are scheduled between 11pm and 6am to avoid valet congestion and maintain ventilation for late kitchens.",
      },
    ] as FAQItem[],
    localTestimonials: [
      {
        name: "Ana R.",
        role: "GM, rooftop lounge",
        quote:
          "They cleaned the fans, sealed the roof, and had photos ready before the health inspector arrived the next morning.",
        area: "Hollywood",
      },
      {
        name: "Marcus P.",
        role: "Owner, taco concept",
        quote:
          "They work around our late-night schedule and leave the filters and ducts spotless every time.",
        area: "Downtown LA",
      },
    ],
    googleMapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3302.0044683409686!2d-118.24532322365689!3d34.05369052316622!2m3!1f0!2f0!3f0!",
  },
  {
    city: "Orange County",
    regionOrCounty: "Orange County",
    state: "CA",
    country: "USA",
    streetAddress: "2600 Campus Dr Suite 180",
    zip: "92612",
    phoneOverride: "(949) 555-0175",
    shortIntro:
      "Hotel resorts, airport concessions, and coastal restaurants trust our contained hood degreasing with zero mess on patios or roofs.",
    longIntro:
      "Orange County properties balance resort guests, HOA standards, and fire marshal expectations. We protect roof membranes from grease, coordinate with property teams for loading access, and document every cleaning so Anaheim and Irvine inspectors see clear, timestamped proof of service. From busy brunch spots to late-night kitchens, we keep airflow strong and odors down even during peak marine layer humidity.",
    mainBody:
      "Orange County kitchens serve resort guests, coastal patios, and airport travelers, which means hood systems must stay clean without disturbing guests. Shield Hood Services plans containment for rooftop fans so grease never stains tile roofs in Newport or Mission-style properties in Anaheim. We coordinate with property management for elevator or dock access at John Wayne Airport-area kitchens and high-traffic hotels. \n\nNFPA 96 compliance in Orange County combines quarterly or monthly cleanings with clear service records. We supply photo documentation, sticker updates, and notes on belt condition, fan balance, and access panels. For HOA-controlled resorts or mall food halls, we arrive in low-profile vehicles, set floor protection, and work after close to avoid guest impact. \n\nFrom Costa Mesa cafes to Anaheim Resort District restaurants, we keep filters rotated, ducts degreased to bare metal, and rooftop housings free of overflow. Marine layer moisture can mix with grease and dust, so we ensure fan weep holes are open and drip trays are cleared. Each visit ends with a digital report you can hand to inspectors or insurance adjusters to prove a maintained exhaust system.",
    servicesIntro:
      "Our technicians arrive in low-profile vehicles, contain runoff, and leave patios spotless. Filter rotations and rooftop fan detailing keep systems efficient between full cleanings.",
    neighborhoodsOrAreas:
      "Irvine Spectrum, John Wayne Airport, Costa Mesa, Anaheim Resort District, Newport Beach, Huntington Beach",
    localLandmarks:
      "Irvine Spectrum, John Wayne Airport, Costa Mesa, Anaheim Resort District, Newport Beach, Huntington Beach",
    localStatsOrRegulationNotes:
      "Orange County inspectors want service stickers, cleaned fans, and documented access panel cleaning. High-volume kitchens near resorts often need monthly or bimonthly cadence.",
    locationFAQ: [
      {
        question: "Do you coordinate with property management?",
        answer:
          "We confirm dock schedules, elevator access, and HOA requirements in advance so your teams and guests stay undisturbed.",
      },
    ] as FAQItem[],
    localTestimonials: [
      {
        name: "J. Patel",
        role: "Owner, coastal seafood house",
        quote:
          "They kept our patio spotless and sent photos of the fan housings so we could share with the HOA.",
        area: "Newport Beach",
      },
      {
        name: "Kelly M.",
        role: "Facilities, resort hotel",
        quote: "They work overnight and leave reports ready for the morning engineering meeting.",
        area: "Anaheim Resort District",
      },
    ],
    googleMapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3320.715419622854!2d-117.8605!3d33.6695!2m3!1f0!2f0!3f0!",
  },
  {
    city: "Phoenix",
    regionOrCounty: "Maricopa County",
    state: "AZ",
    country: "USA",
    streetAddress: "88 E Van Buren St Suite 500",
    zip: "85004",
    shortIntro:
      "Desert dust and monsoon humidity make Phoenix hoods work overtime. We keep exhaust systems clean, balanced, and ready for county inspections.",
    longIntro:
      "Grease mixed with dust can choke rooftop fans and stain nearby walls. Our Phoenix team degreases fans, clears weep holes, and installs grease containment to protect stucco and parapet walls. We're familiar with Maricopa County health checks and provide documentation that satisfies inspectors and insurance requirements.",
    mainBody:
      "Phoenix kitchens battle heat, desert dust, and monsoon humidity. Grease combines with dust to cake onto fan blades and parapet walls, while high summer temperatures stress belts and bearings. Shield Hood Services degreases hood plenums, ducts, and rooftop fans, and we install containment to keep grease off stucco and roof membranes. \n\nMaricopa County inspectors want to see clean access panels, documented rooftop work, and current stickers that match NFPA 96 cadences. We set schedules monthly or quarterly depending on volume, and we provide after-service photo reports you can share with property managers or insurance providers. \n\nFor Scottsdale resorts, downtown Phoenix towers, and Tempe campus kitchens, we plan after-close arrivals, use quiet equipment, and leave floors and patios clean. Monsoon storms can push debris into fan housings; we clear weep holes and verify fan vibration so exhaust stays balanced during peak heat. Each visit includes notes on filters, belts, and any access issues so you can stay ahead of inspections.",
    servicesIntro:
      "From downtown high-rises to Scottsdale resorts and Tempe campus kitchens, we deliver compliant cleanings that survive long summers and monsoon surges.",
    neighborhoodsOrAreas:
      "Downtown Phoenix, Roosevelt Row, Scottsdale, Tempe, Chandler, Glendale",
    localLandmarks:
      "Downtown Phoenix, Roosevelt Row, Scottsdale, Tempe, Chandler, Glendale",
    localStatsOrRegulationNotes:
      "Maricopa County health checks favor documented fan cleaning and grease containment. Many high-volume kitchens need monthly service during summer heat.",
    locationFAQ: [
      {
        question: "Can you help with rooftop fan balancing?",
        answer:
          "Yes. We inspect belts and vibration during each service and flag issues before they become emergency calls in peak heat.",
      },
    ] as FAQItem[],
    localTestimonials: [
      {
        name: "D. Morales",
        role: "Chef, hotel kitchen",
        quote: "They cleared dust and grease from the fans right before monsoon storms and shared a full report.",
        area: "Downtown Phoenix",
      },
      {
        name: "S. Lee",
        role: "Owner, campus eatery",
        quote: "Great scheduling around finals week and fast photo documentation for our property manager.",
        area: "Tempe",
      },
    ],
    googleMapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3328.9227821031397!2d-112.0714!3d33.4505!2m3!1f0!2f0!3f0!",
  },
];

async function main() {
  await prisma.globalSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      businessName: "Shield Hood Services",
      primaryPhone: "(844) 555-0100",
      primaryEmail: "hello@hoodscleaning.net",
      baseDomain: "https://hoodscleaning.net",
      defaultStreetAddress: "123 Service Lane",
      defaultCity: "Los Angeles",
      defaultState: "CA",
      defaultZip: "90012",
      defaultCountry: "USA",
      globalServiceDescription:
        "Shield Hood Services provides commercial kitchen hood cleaning, exhaust fan degreasing, and documentation that aligns with NFPA-96 and local fire codes.",
      globalFAQ: JSON.stringify(globalFAQ),
    },
  });

  const services = await Promise.all(
    servicesData.map((service) =>
      prisma.service.upsert({
        where: { slug: service.slug },
        update: service,
        create: service,
      }),
    ),
  );

  for (const location of locationsData) {
    const slug = generateLocationSlug(location.city, location.state);
    const locationFAQ = location.locationFAQ ? JSON.stringify(location.locationFAQ) : undefined;
    const localTestimonials = location.localTestimonials
      ? JSON.stringify(location.localTestimonials)
      : undefined;

    const createdLocation = await prisma.location.upsert({
      where: { slug },
      update: {
        ...location,
        slug,
        published: true,
        locationFAQ,
        localTestimonials,
      },
      create: {
        ...location,
        slug,
        country: location.country || "USA",
        locationFAQ,
        localTestimonials,
        published: true,
      },
    });

    for (const service of services) {
      await prisma.locationService.upsert({
        where: {
          locationId_serviceId: {
            locationId: createdLocation.id,
            serviceId: service.id,
          },
        },
        update: {},
        create: {
          locationId: createdLocation.id,
          serviceId: service.id,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
