import Link from "next/link";
import { SettingsWithFaq } from "@/lib/data";

type Props = {
  settings: SettingsWithFaq;
};

export function SiteFooter({ settings }: Props) {
  const phone = settings.primaryPhone || "(844) 555-0100";
  const addressParts = [
    settings.defaultStreetAddress,
    settings.defaultCity,
    settings.defaultState,
    settings.defaultZip,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-lg font-semibold uppercase tracking-[0.08em] text-slate-900">
            {settings.businessName}
          </div>
          <p className="text-sm text-slate-600">
            Compliant hood cleaning, rooftop fan care, and documentation that passes inspections.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
          <Link className="hover:text-sky-700" href="/services">
            Services
          </Link>
          <Link className="hover:text-sky-700" href="/locations">
            Locations
          </Link>
          <Link className="hover:text-sky-700" href="/contact">
            Contact
          </Link>
          <a className="text-slate-900 hover:text-sky-700" href={`tel:${phone.replace(/[^0-9+]/g, "")}`}>
            {phone}
          </a>
          {settings.primaryEmail && (
            <a className="text-slate-900 hover:text-sky-700" href={`mailto:${settings.primaryEmail}`}>
              {settings.primaryEmail}
            </a>
          )}
          {addressParts && <span className="text-slate-500">{addressParts}</span>}
        </div>
      </div>
    </footer>
  );
}
