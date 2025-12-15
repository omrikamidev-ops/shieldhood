import Link from "next/link";
import { getGlobalSettings, getServices } from "@/lib/data";

export const metadata = {
  title: "Hood Cleaning Services",
  description:
    "Certified commercial hood cleaning, exhaust fan degreasing, and documentation built for inspections.",
};

export default async function ServicesPage() {
  const [settings, services] = await Promise.all([getGlobalSettings(), getServices()]);

  return (
    <div className="space-y-10">
      <section className="panel space-y-3">
        <div className="pill bg-slate-900 text-white">Services</div>
        <h1 className="text-3xl font-semibold text-slate-900">Hood cleaning, simplified.</h1>
        <p className="text-sm text-slate-600">
          {settings.globalServiceDescription ||
            "We clean hoods, ducts, fans, filters, and polish stainless so cooks breathe easier and inspectors sign off faster."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/contact" className="pill solid px-4 py-3 text-[11px]">
            Request service
          </Link>
          <Link href="/locations" className="pill ghost px-4 py-3 text-[11px]">
            Find your city
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {services.map((service) => (
          <article key={service.slug} className="surface p-5">
            {service.isPrimary && (
              <span className="pill bg-slate-100 text-slate-800">Core</span>
            )}
            <h2 className="mt-2 text-lg font-semibold text-slate-900">{service.name}</h2>
            <p className="text-sm text-slate-600">{service.shortDescription}</p>
            {service.longDescription && (
              <p className="mt-2 text-sm text-slate-600">{service.longDescription}</p>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
