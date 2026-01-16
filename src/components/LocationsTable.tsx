"use client";

import { useRouter } from "next/navigation";
import { generateLocationSlug } from "@/lib/slug";

type LocationRow = {
  id: number;
  city: string;
  state: string;
  slug: string;
  published: boolean;
  updatedAt: string | Date;
};

type Props = {
  locations: LocationRow[];
};

export function LocationsTable({ locations }: Props) {
  const router = useRouter();

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Delete this location?");
    if (!confirmDelete) return;

    await fetch(`/api/locations/${id}`, { method: "DELETE" });
    router.refresh();
  };

  const handleDuplicate = async (id: number) => {
    await fetch(`/api/locations/${id}/duplicate`, { method: "POST" });
    router.refresh();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <Header>City</Header>
            <Header>State</Header>
            <Header>Slug</Header>
            <Header>Published</Header>
            <Header>Updated</Header>
            <Header>Actions</Header>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {locations.map((loc) => (
            <tr key={loc.id} className="hover:bg-slate-50">
              <Cell className="font-semibold text-slate-900">{loc.city}</Cell>
              <Cell>{loc.state}</Cell>
              <Cell className="text-xs text-slate-600">
                {generateLocationSlug(loc.city, loc.state)}
              </Cell>
              <Cell>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    loc.published ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {loc.published ? "Yes" : "No"}
                </span>
              </Cell>
              <Cell className="text-xs text-slate-600">
                {new Date(loc.updatedAt).toLocaleDateString()}
              </Cell>
              <Cell className="space-x-2">
                <a
                  className="text-xs font-semibold text-sky-700 hover:text-sky-800"
                  href={`/${generateLocationSlug(loc.city, loc.state)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View
                </a>
                <a
                  className="text-xs font-semibold text-slate-800 hover:text-sky-800"
                  href={`/admin/locations/${loc.id}`}
                >
                  Edit
                </a>
                <button
                  type="button"
                  onClick={() => handleDuplicate(loc.id)}
                  className="text-xs font-semibold text-slate-600 hover:text-sky-800"
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(loc.id)}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-800"
                >
                  Delete
                </button>
              </Cell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Header({ children }: { children: React.ReactNode }) {
  return (
    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </th>
  );
}

function Cell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 text-sm text-slate-700 ${className ?? ""}`}>{children}</td>;
}
