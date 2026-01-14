import Link from "next/link";
import { getGlobalSettings, getPublishedLocations, getServices } from "@/lib/data";
import { formatPhoneDisplay, formatPhoneHref } from "@/lib/phone";

export default async function Home() {
  const [settings, locations, services] = await Promise.all([
    getGlobalSettings(),
    getPublishedLocations(),
    getServices(),
  ]);

  const featuredLocations = locations.slice(0, 3);
  const phoneDisplay = formatPhoneDisplay(settings.primaryPhone || "818-518-8161");
  const phoneHref = formatPhoneHref(settings.primaryPhone || "818-518-8161");

  return (
    <div className="space-y-12">
      <section className="panel relative overflow-hidden">
        <div className="absolute inset-0 opacity-50" style={{ background: "linear-gradient(120deg, rgba(14,165,233,0.06) 0%, rgba(14,165,233,0) 60%)" }} />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-4">
            <div className="pill bg-slate-900 text-white">NFPA-96 · Rooftop to Range</div>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900">
              Minimal, sharp, and inspection-ready hood cleaning pages.
            </h1>
            <p className="text-base text-slate-600">
              {settings.businessName} keeps your kitchens compliant with documented cleanings, rooftop fan care, and schema-rich location pages built for Local SEO.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={phoneHref}
                className="pill solid bg-sky-600 px-5 py-3 text-[11px]"
              >
                Call {phoneDisplay}
              </a>
              <Link
                href="/contact"
                className="pill ghost px-5 py-3 text-[11px]"
              >
                Request service
              </Link>
            </div>
          </div>
          <div className="surface w-full max-w-sm p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Published locations
            </div>
            <div className="divider my-3" />
            <div className="space-y-3">
              {featuredLocations.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/locations/${loc.slug}`}
                  className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-sky-200 hover:text-sky-700"
                >
                  <span>
                    {loc.city}, {loc.state}
                  </span>
                  <span className="text-slate-500">→</span>
                </Link>
              ))}
              <Link
                href="/locations"
                className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 hover:text-sky-700"
              >
                View all locations
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="panel grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Why Shield Hood</h2>
          <p className="text-sm text-slate-600">
            Documentation-first cleanings built for restaurants, hotels, venues, and ghost kitchens. We degrease hoods, ducts, fans, and polish stainless so your next inspection is effortless.
          </p>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>• Photo proof + NFPA-96 notes every visit</li>
            <li>• Rooftop fan degreasing with containment</li>
            <li>• After-hours scheduling to avoid service disruption</li>
          </ul>
        </div>
        <div className="surface p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
            NAP consistency
          </h3>
          <div className="divider my-3" />
          <div className="space-y-1 text-sm text-slate-800">
            <div className="font-semibold">{settings.businessName}</div>
            {settings.defaultStreetAddress && <div>{settings.defaultStreetAddress}</div>}
            <div>
              {[settings.defaultCity, settings.defaultState, settings.defaultZip].filter(Boolean).join(", ")}
            </div>
            <div className="font-semibold text-slate-900">{phoneDisplay}</div>
            {settings.primaryEmail && <div>{settings.primaryEmail}</div>}
          </div>
        </div>
      </section>

      <section className="panel space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">Services at a glance</h3>
            <p className="text-sm text-slate-600">Core offerings without visual clutter.</p>
          </div>
          <Link
            href="/services"
            className="pill ghost px-4 py-2 text-[11px]"
          >
            All services
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {services.slice(0, 3).map((service) => (
            <article key={service.slug} className="surface p-4">
              <div className="text-sm font-semibold text-slate-900">{service.name}</div>
              <p className="text-xs text-slate-600">{service.shortDescription}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-slate-900">Admin-ready</h3>
          <p className="text-sm text-slate-600">
            Add a city, hit publish, and the schema-rich page goes live with consistent NAP.
          </p>
        </div>
        <Link href="/admin" className="pill solid px-5 py-3 text-[11px]">
          Open admin
        </Link>
      </section>
    </div>
  );
}
