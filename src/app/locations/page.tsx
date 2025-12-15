import Link from "next/link";
import { getPublishedLocations } from "@/lib/data";

export const metadata = {
  title: "Locations",
  description: "Browse published service areas and localized hood cleaning pages.",
};

export default async function LocationsIndexPage() {
  const locations = await getPublishedLocations();
  const grouped = locations.reduce<Record<string, typeof locations>>((acc, loc) => {
    const key = loc.state || "Other";
    acc[key] = acc[key] ? [...acc[key], loc] : [loc];
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <section className="panel space-y-3">
        <div className="pill bg-slate-900 text-white">Service footprint</div>
        <h1 className="text-3xl font-semibold text-slate-900">Published locations</h1>
        <p className="text-sm text-slate-600">
          Each page ships with unique copy, schema, and a request form tied back to the same contact number.
        </p>
      </section>

      <div className="space-y-6">
        {Object.entries(grouped).map(([state, stateLocations]) => (
          <div key={state} className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">{state}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {stateLocations.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/locations/${loc.slug}`}
                  className="surface flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-sky-200 hover:text-sky-700"
                >
                  <span>Hood cleaning in {loc.city}, {loc.state}</span>
                  <span className="text-slate-500">→</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
