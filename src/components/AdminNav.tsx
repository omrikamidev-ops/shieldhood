"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/locations", label: "Locations" },
  { href: "/admin/local-pages", label: "Local Pages" },
  { href: "/admin/settings", label: "Global Settings" },
];

export function AdminNav() {
  const pathname = usePathname();
  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <nav className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
      {links.map((link) => {
        const active = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active ? "bg-sky-100 text-sky-800" : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      <button
        onClick={handleLogout}
        className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        type="button"
      >
        Sign out
      </button>
    </nav>
  );
}
