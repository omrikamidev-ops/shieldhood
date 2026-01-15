import Link from "next/link";
import { getGlobalSettings, getPublishedLocations } from "@/lib/data";
import { formatPhoneDisplay, formatPhoneHref } from "@/lib/phone";

export default async function Home() {
  const [settings, locations] = await Promise.all([getGlobalSettings(), getPublishedLocations()]);

  const featuredLocations = locations.filter((loc) => loc.state === "CA").slice(0, 3);
  const phoneDisplay = formatPhoneDisplay(settings.primaryPhone || "818-518-8161");
  const phoneHref = formatPhoneHref(settings.primaryPhone || "818-518-8161");

  return (
    <div className="space-y-12">
      <section className="panel relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-50"
          style={{ background: "linear-gradient(120deg, rgba(14,165,233,0.06) 0%, rgba(14,165,233,0) 60%)" }}
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-4">
            <div className="pill bg-slate-900 text-white">
              NFPA-96 Compliant • Fully Insured • Commercial Kitchens Only
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900">
              Commercial Hood Cleaning Done Right.
              <br />
              Inspection-Ready. Fire-Safe. Documented.
            </h1>
            <p className="text-base text-slate-600">
              Hoods Cleaning provides professional commercial kitchen hood and exhaust cleaning for restaurants,
              hotels, commissaries, and food service facilities. We clean hoods, ducts, fans, and rooftop systems to
              NFPA-96 standards so your kitchen stays safe, compliant, and ready for inspection.
            </p>
            <ul className="space-y-1 text-sm font-semibold text-slate-800">
              <li>After-hours commercial service</li>
              <li>Before-and-after photo documentation every visit</li>
              <li>No shortcuts. No missed grease.</li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <a href={phoneHref} className="pill solid bg-sky-600 px-5 py-3 text-[11px]">
                CALL {phoneDisplay}
              </a>
              <Link href="/contact" className="pill ghost px-5 py-3 text-[11px]">
                REQUEST SERVICE
              </Link>
            </div>
          </div>
          <div className="surface w-full max-w-sm p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Proudly serving all of Southern California
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
                View locations
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="panel grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Complete Commercial Hood & Exhaust Cleaning</h2>
          <p className="text-sm text-slate-600">
            Hoods Cleaning specializes exclusively in commercial kitchen exhaust systems. Our crews clean every part of
            the system, from the cooking line to the rooftop, with a focus on fire safety, cleanliness, and compliance.
          </p>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>Commercial kitchen hood cleaning</li>
            <li>Exhaust duct degreasing (horizontal and vertical)</li>
            <li>Rooftop exhaust fan cleaning with grease containment</li>
            <li>Filter, plenum, and housing degreasing</li>
            <li>Stainless steel hood polishing and wipe-down</li>
            <li>Code-compliant service labeling and reports</li>
          </ul>
          <p className="text-sm text-slate-600">
            Each service includes clear documentation so you can show proof of cleaning to inspectors, landlords, or
            insurance providers.
          </p>
        </div>
        <div className="surface p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Business details</h3>
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
        <h3 className="text-2xl font-semibold text-slate-900">Built for Inspections, Safety, and Accountability</h3>
        <p className="text-sm text-slate-600">
          We don’t rush jobs and we don’t cut corners. Our cleaning process is designed to meet inspection requirements
          and reduce fire risk in commercial kitchens.
        </p>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>Before-and-after photos with NFPA-96 notes</li>
          <li>Rooftop fan cleaning with proper grease containment</li>
          <li>After-hours scheduling to avoid kitchen downtime</li>
          <li>Clear service reports for records and inspections</li>
          <li>Reliable recurring service options</li>
        </ul>
        <p className="text-sm text-slate-600">When we leave, your system is clean, documented, and inspection-ready.</p>
      </section>

      <section className="panel space-y-4">
        <h3 className="text-2xl font-semibold text-slate-900">Commercial Kitchens We Service</h3>
        <p className="text-sm text-slate-600">Hoods Cleaning works with a wide range of commercial kitchens, including:</p>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>Restaurants and quick-service locations</li>
          <li>Hotels and hospitality kitchens</li>
          <li>Ghost kitchens and commissaries</li>
          <li>Cafeterias and food halls</li>
          <li>Event venues and commercial cooking facilities</li>
        </ul>
        <p className="text-sm text-slate-600">If your kitchen produces grease, we clean it properly.</p>
      </section>

      <section className="panel space-y-4">
        <h3 className="text-2xl font-semibold text-slate-900">How Our Service Works</h3>
        <ol className="space-y-2 text-sm text-slate-700">
          <li>Schedule service at a time that fits your operation</li>
          <li>We clean the full exhaust system from hood to rooftop</li>
          <li>You receive photo documentation and service records</li>
          <li>Your kitchen stays compliant and fire-safe</li>
        </ol>
      </section>

      <section className="panel space-y-4">
        <h3 className="text-2xl font-semibold text-slate-900">Fire Safety Is Not Optional</h3>
        <p className="text-sm text-slate-600">
          Grease buildup is a leading cause of commercial kitchen fires. Regular professional hood cleaning is required
          under NFPA-96 and is commonly enforced by fire inspectors, insurance carriers, and property managers. We help
          you stay compliant and avoid costly violations or shutdowns.
        </p>
      </section>

      <section className="panel flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-slate-900">Schedule Professional Hood Cleaning</h3>
          <p className="text-sm text-slate-600">
            Whether you need a one-time cleaning or a recurring service plan, Hoods Cleaning will make sure your kitchen
            is cleaned properly and documented.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={phoneHref} className="pill solid bg-sky-600 px-5 py-3 text-[11px]">
            CALL {phoneDisplay}
          </a>
          <Link href="/contact" className="pill ghost px-5 py-3 text-[11px]">
            REQUEST SERVICE
          </Link>
        </div>
      </section>
    </div>
  );
}
