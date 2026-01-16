"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { generateLocationSlug } from "@/lib/slug";

type LocationItem = {
  city: string;
  state: string;
  slug: string;
  regionOrCounty?: string | null;
};

const PAGE_SIZE = 25;

export function LocationsIndex({ locations }: { locations: LocationItem[] }) {
  const [query, setQuery] = useState("");
  const [expandedCounts, setExpandedCounts] = useState<Record<string, number>>({});

  const normalizedQuery = query.trim().toLowerCase();

  const grouped = useMemo(() => {
    const filtered = normalizedQuery
      ? locations.filter(
          (loc) =>
            loc.city.toLowerCase().includes(normalizedQuery) ||
            (loc.regionOrCounty || "").toLowerCase().includes(normalizedQuery),
        )
      : locations;

    return filtered.reduce<Record<string, LocationItem[]>>((acc, loc) => {
      const county = loc.regionOrCounty?.trim() || "Other";
      acc[county] = acc[county] ? [...acc[county], loc] : [loc];
      return acc;
    }, {});
  }, [locations, normalizedQuery]);

  const counties = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

  const handleShowMore = (county: string) => {
    setExpandedCounts((prev) => ({
      ...prev,
      [county]: (prev[county] || PAGE_SIZE) + PAGE_SIZE,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="surface p-4">
        <label className="text-sm font-semibold text-slate-800">
          Search by city or county
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search cities"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-sky-100 focus:ring-2 focus:ring-sky-500"
          />
        </label>
      </div>

      {counties.length === 0 && (
        <div className="surface p-4 text-sm text-slate-600">
          No matching cities found.
        </div>
      )}

      {counties.map((county, index) => {
        const items = grouped[county] || [];
        const limit = expandedCounts[county] || PAGE_SIZE;
        const visible = items.slice(0, limit);
        const remaining = items.length - visible.length;

        return (
          <details key={county} className="surface p-5" open={normalizedQuery.length > 0 || index === 0}>
            <summary className="cursor-pointer text-sm font-semibold uppercase tracking-[0.12em] text-slate-700">
              {county} County · {items.length} cities
            </summary>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {visible.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/${generateLocationSlug(loc.city, loc.state)}`}
                  className="surface flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-sky-200 hover:text-sky-700"
                >
                  <span>Hood Cleaning in {loc.city}, {loc.state}</span>
                  <span className="text-slate-500">→</span>
                </Link>
              ))}
            </div>
            {remaining > 0 && (
              <button
                type="button"
                onClick={() => handleShowMore(county)}
                className="mt-4 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 hover:bg-slate-50"
              >
                Show more
              </button>
            )}
          </details>
        );
      })}
    </div>
  );
}
