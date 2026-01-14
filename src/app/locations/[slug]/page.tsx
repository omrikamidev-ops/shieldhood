import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FAQAccordion } from "@/components/FAQAccordion";
import { JsonLd } from "@/components/JsonLd";
import { LeadForm } from "@/components/LeadForm";
import {
  getGlobalSettings,
  getLocationBySlug,
  getNearbyLocations,
  getPublishedLocations,
  getServices,
} from "@/lib/data";
import { mergeFaqs } from "@/lib/faq";
import {
  buildBreadcrumbJsonLd,
  buildCanonicalUrl,
  buildFaqJsonLd,
  buildLocalBusinessJsonLd,
  buildLocationDescription,
  buildLocationTitle,
  buildRobots,
  getLocationPhone,
} from "@/lib/seo";
import { formatPhoneDisplay, formatPhoneHref } from "@/lib/phone";

export const revalidate = 900;
export const dynamicParams = true;

export async function generateStaticParams() {
  const locations = await getPublishedLocations();
  return locations.map((loc) => ({ slug: loc.slug }));
}

type PageParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;

  const [settings, location] = await Promise.all([
    getGlobalSettings(),
    getLocationBySlug(slug),
  ]);

  if (!location) {
    return { title: "Location not found" };
  }

  const title = buildLocationTitle(location, settings);
  const description = buildLocationDescription(location, settings);
  const canonical = buildCanonicalUrl(settings, location.slug);
  const robots = buildRobots(location.published);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: settings.businessName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LocationPage({ params }: PageParams) {
  const { slug } = await params;

  const [settings, location] = await Promise.all([
    getGlobalSettings(),
    getLocationBySlug(slug),
  ]);

  if (!location) {
    notFound();
  }

  const phone = getLocationPhone(location, settings);
  const phoneDisplay = formatPhoneDisplay(phone);
  const phoneHref = formatPhoneHref(phone);
  const faqs = mergeFaqs(settings.faqItems, location.faqItems);
  const canonical = buildCanonicalUrl(settings, location.slug);
  const nearby = await getNearbyLocations(location.slug);
  const landmarks =
    location.localLandmarks?.split(",").map((item) => item.trim()).filter(Boolean) ?? [];
  const neighborhoods =
    (location.neighborhoodsOrAreas || location.localLandmarks || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const services =
    location.services.length > 0
      ? location.services
      : (await getServices()).map((service) => ({ service, localNotes: null }));

  const testimonials =
    location.testimonials && location.testimonials.length > 0 ? location.testimonials : [];

  const mainBodyParagraphs =
    location.mainBody?.split(/\n\n+/).filter(Boolean) ??
    location.longIntro.split(/\n\n+/).filter(Boolean);
  const longIntroParagraphs = location.longIntro
    ? location.longIntro.split(/\n\n+/).filter(Boolean)
    : [];

  const localBusinessJsonLd = buildLocalBusinessJsonLd({
    location,
    settings,
    canonicalUrl: canonical,
  });
  const faqJsonLd = buildFaqJsonLd(faqs);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd({
    settings,
    location,
    canonicalUrl: canonical,
  });

  const whatHappensNextParagraphs = location.whatTypicallyHappensNext
    ? location.whatTypicallyHappensNext.split(/\n\n+/).filter(Boolean)
    : [];

  const directionsQuery = encodeURIComponent(
    [location.streetAddress, location.city, location.state, location.zip].filter(Boolean).join(", "),
  );
  const directionsUrl = directionsQuery
    ? `https://www.google.com/maps/search/?api=1&query=${directionsQuery}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        [location.city, location.state].filter(Boolean).join(", "),
      )}`;

  return (
    <div className="space-y-10">
      <JsonLd data={localBusinessJsonLd} id="local-business-schema" />
      <JsonLd data={faqJsonLd} id="faq-schema" />
      <JsonLd data={breadcrumbJsonLd} id="breadcrumb-schema" />

      {!location.published && (
        <div className="surface border-amber-200 bg-amber-50 text-sm font-semibold text-amber-800">
          Unpublished preview — page will be indexed after you publish.
        </div>
      )}

      <section className="panel grid gap-6 lg:grid-cols-[1.5fr,1fr]">
        <div className="space-y-3">
          <div className="pill bg-slate-900 text-white">
            {location.city}, {location.state}
          </div>
          <h1 className="text-3xl font-semibold text-slate-900">
            {location.h1Override || `${settings.businessName} in ${location.city}, ${location.state}`}
          </h1>
          <p className="text-sm text-slate-600">
            {location.shortIntro ||
              `${settings.businessName} cleans hoods, ducts, and rooftop fans for restaurants across ${location.city}.`}
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={phoneHref} className="pill solid px-5 py-3 text-[11px]">
              Call {phoneDisplay}
            </a>
            <a
              href="#request-service"
              className="pill ghost px-5 py-3 text-[11px]"
            >
              Request service
            </a>
          </div>
        </div>
        <div className="surface p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            NAP consistency
          </p>
          <div className="divider my-3" />
          <div className="space-y-1 text-sm text-slate-800">
            <div className="font-semibold">{settings.businessName}</div>
            {location.streetAddress && <div>{location.streetAddress}</div>}
            <div>
              {[location.city, location.state, location.zip].filter(Boolean).join(", ")}
            </div>
            <div className="font-semibold text-slate-900">{phoneDisplay}</div>
            {settings.primaryEmail && <div>{settings.primaryEmail}</div>}
            <div className="pt-2">
              <a
                className="text-sm font-semibold text-sky-700 hover:text-sky-800"
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
              >
                Get directions
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="panel space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">
          Why {location.city} restaurants trust {settings.businessName}
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 text-sm text-slate-700">
            {longIntroParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
            {location.localStatsOrRegulationNotes && (
              <p>{location.localStatsOrRegulationNotes}</p>
            )}
            {neighborhoods.length > 0 && (
              <p>
                We work in {location.city} neighborhoods like {neighborhoods.slice(0, 5).join(", ")}
                {location.regionOrCounty ? ` and across ${location.regionOrCounty}.` : "."}
              </p>
            )}
          </div>
          <div className="surface p-4 text-sm text-slate-700">
            <p className="text-sm font-semibold text-slate-900">Compliance & uptime</p>
            <ul className="mt-2 space-y-1">
              <li>• NFPA-96 aligned cleanings with photo documentation.</li>
              <li>• Rooftop fan degreasing and grease containment.</li>
              <li>• Flexible scheduling to match prep and close times.</li>
              <li>• Service stickers and reports inspectors expect in {location.state}.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="panel space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Services in {location.city}
            </h2>
            <p className="text-sm text-slate-600">
              {location.servicesIntro ||
                "Full degreasing of hoods, ducts, fans, and polished stainless to satisfy inspectors and keep airflow strong."}
            </p>
          </div>
          <Link href="/services" className="pill ghost px-4 py-2 text-[11px]">
            View services
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map(({ service, localNotes }) => (
            <article key={service.slug} className="surface p-4">
              <div className="text-sm font-semibold text-slate-900">
                {service.name} — {location.city}
              </div>
              <p className="text-xs text-slate-600">{localNotes || service.shortDescription}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel space-y-3">
        <h3 className="text-2xl font-semibold text-slate-900">
          How we keep you inspection-ready in {location.city}
        </h3>
        <ol className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-3">
          <li className="surface p-3">
            <div className="text-sm font-semibold text-slate-900">1) Site check</div>
            Document hoods, ducts, fans, and access for {location.city} inspectors.
          </li>
          <li className="surface p-3">
            <div className="text-sm font-semibold text-slate-900">2) Scheduling</div>
            After-hours or split shifts; coordinate docks/elevators in {location.regionOrCounty || location.state}.
          </li>
          <li className="surface p-3">
            <div className="text-sm font-semibold text-slate-900">3) Cleaning</div>
            Hood, duct, and rooftop fan degreasing with containment; filters rotated.
          </li>
          <li className="surface p-3">
            <div className="text-sm font-semibold text-slate-900">4) Documentation</div>
            Photo report, NFPA 96-aligned notes, and sticker updates for local AHJ review.
          </li>
          <li className="surface p-3">
            <div className="text-sm font-semibold text-slate-900">5) Follow-up</div>
            Cadence set to match volume and {location.city} fire/health expectations.
          </li>
        </ol>
        {location.localStatsOrRegulationNotes && (
          <p className="text-sm text-slate-600">{location.localStatsOrRegulationNotes}</p>
        )}
      </section>

      <section className="panel space-y-3">
        <h3 className="text-2xl font-semibold text-slate-900">
          Hood cleaning built for {location.city}
        </h3>
        <div className="space-y-3 text-sm leading-6 text-slate-700">
          {mainBodyParagraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </section>

      {whatHappensNextParagraphs.length > 0 && (
        <section className="panel space-y-3">
          <h3 className="text-2xl font-semibold text-slate-900">
            What typically happens next in {location.city}
          </h3>
          <div className="space-y-3 text-sm leading-6 text-slate-700">
            {whatHappensNextParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </section>
      )}

      <section className="panel grid gap-6 lg:grid-cols-[1.4fr,1fr]">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-slate-900">
            Areas we serve around {location.city}
          </h3>
          <p className="text-sm text-slate-600">
            We cover nearby neighborhoods and business districts with the same documented cleanings.
          </p>
          <div className="flex flex-wrap gap-2">
            {(neighborhoods.length ? neighborhoods : landmarks).map((area) => (
              <span
                key={area}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                {area}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link className="font-semibold text-sky-700 hover:text-sky-800" href="/">
              Home
            </Link>
            <Link className="font-semibold text-sky-700 hover:text-sky-800" href="/locations">
              All locations
            </Link>
            <Link className="font-semibold text-sky-700 hover:text-sky-800" href="/services">
              Services overview
            </Link>
            <Link className="font-semibold text-sky-700 hover:text-sky-800" href="/contact">
              Contact
            </Link>
            {nearby.map((loc) => (
              <Link
                key={loc.slug}
                className="font-semibold text-sky-700 hover:text-sky-800"
                href={`/locations/${loc.slug}`}
              >
                Nearby: {loc.city}, {loc.state}
              </Link>
            ))}
          </div>
        </div>
        <div className="surface p-4">
          <h3 className="text-lg font-semibold text-slate-900">Compliance & safety</h3>
          <p className="text-sm text-slate-600">
            Crews follow NFPA-96 and local fire codes for {location.state}. Every visit includes photos, sticker updates, and notes on fan balance, grease containment, and access panels.
          </p>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="panel space-y-3">
          <h3 className="text-2xl font-semibold text-slate-900">Local testimonials</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {testimonials.map((t, idx) => (
              <div key={idx} className="surface p-4">
                <p className="text-sm text-slate-700">“{t.quote}”</p>
                <div className="mt-2 text-xs font-semibold text-slate-900">
                  {t.name}
                  {t.role ? ` — ${t.role}` : ""} {t.area ? ` · ${t.area}` : ""}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="panel grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">FAQs</h3>
          <FAQAccordion faqs={faqs} className="mt-3" />
        </div>
        <div id="request-service" className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">Request service</h3>
          <p className="text-sm text-slate-600">
            Tell us about your hood system, roof access, and timelines. We respond quickly.
          </p>
          <LeadForm locationId={location.id} locationSlug={location.slug} defaultCity={location.city} />
        </div>
      </section>

      <section className="panel grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">Map</h3>
          <p className="text-sm text-slate-600">
            Service area anchored in {location.city}, covering nearby suburbs and commercial zones.
          </p>
          <a
            className="text-sm font-semibold text-sky-700 hover:text-sky-800"
            href={directionsUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open in Google Maps
          </a>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <iframe
            src={location.googleMapsEmbedUrl}
            className="h-[320px] w-full"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </section>
    </div>
  );
}
