import { getPublishedLocations } from "@/lib/data";
import { LocationsIndex } from "@/components/LocationsIndex";

export const metadata = {
  title: "Locations",
  description: "Commercial hood cleaning service areas in Southern California.",
};

export default async function LocationsIndexPage() {
  const locations = (await getPublishedLocations()).filter((loc) => loc.state === "CA");

  return (
    <div className="space-y-8">
      <section className="panel space-y-3">
        <div className="pill bg-slate-900 text-white">Service Areas</div>
        <h1 className="text-3xl font-semibold text-slate-900">Areas We Serve</h1>
        <p className="text-sm text-slate-600">
          We provide commercial hood cleaning services throughout Southern California.
          Select your city below to view service details and request service.
        </p>
      </section>

      <LocationsIndex
        locations={locations.map((loc) => ({
          city: loc.city,
          state: loc.state,
          slug: loc.slug,
          regionOrCounty: loc.regionOrCounty,
        }))}
      />
    </div>
  );
}
