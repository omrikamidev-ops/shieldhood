import Link from "next/link";
import { LocationsTable } from "@/components/LocationsTable";
import { prisma } from "@/lib/prisma";

export default async function AdminLocationsPage() {
  let locations: Awaited<ReturnType<typeof prisma.location.findMany>> = [];
  let dbError: string | null = null;

  try {
    locations = await prisma.location.findMany({
      orderBy: { updatedAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to load locations", error);
    dbError = "Database not configured. Set DATABASE_URL in your environment and run Prisma db push.";
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Locations</h1>
          <p className="text-sm text-slate-600">Add, edit, duplicate, or delete service areas.</p>
          {dbError && <p className="mt-2 text-sm font-semibold text-amber-700">{dbError}</p>}
        </div>
        <Link
          href="/admin/locations/new"
          className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700"
        >
          + Add location
        </Link>
      </div>
      <LocationsTable locations={locations} />
    </div>
  );
}
