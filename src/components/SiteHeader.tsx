import Link from "next/link";
import { SettingsWithFaq } from "@/lib/data";
import { formatPhoneDisplay, formatPhoneHref } from "@/lib/phone";

type Props = {
  settings: SettingsWithFaq;
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/locations", label: "Locations" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ settings }: Props) {
  const phone = settings.primaryPhone || "818-518-8161";
  const phoneDisplay = formatPhoneDisplay(phone);
  const phoneHref = formatPhoneHref(phone);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: "#0B1F33" }}
          >
            HC
          </div>
          <div className="leading-tight">
            <Link href="/" className="text-base font-semibold uppercase tracking-[0.08em] text-slate-900">
              Hoods Cleaning
            </Link>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Commercial Hood Cleaning
            </p>
          </div>
        </div>
        <nav className="hidden items-center gap-5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          <div className="text-right text-[11px] uppercase tracking-[0.14em] text-slate-500">
            Call
            <div className="text-sm font-semibold text-slate-900">{phoneDisplay}</div>
          </div>
          <a
            href={phoneHref}
            className="rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-sky-700"
          >
            Call
          </a>
        </div>
        <div className="flex items-center gap-2 sm:hidden">
          <Link
            href="/locations"
            className="rounded-full border border-slate-200 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-800"
          >
            Locations
          </Link>
        </div>
      </div>
    </header>
  );
}
