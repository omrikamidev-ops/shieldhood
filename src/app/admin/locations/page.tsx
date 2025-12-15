import Link from "next/link";
import { LocationsTable } from "@/components/LocationsTable";
import { prisma } from "@/lib/prisma";

export default async function AdminLocationsPage() {
  const locations = await prisma.location.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Locations</h1>
          <p className="text-sm text-slate-600">Add, edit, duplicate, or delete service areas.</p>
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
