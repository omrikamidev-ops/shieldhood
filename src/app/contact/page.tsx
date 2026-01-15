import { LeadForm } from "@/components/LeadForm";
import { getGlobalSettings } from "@/lib/data";
import { formatPhoneDisplay } from "@/lib/phone";

export const metadata = {
  title: "Contact Shield Hood Services",
  description: "Request commercial hood cleaning, rooftop fan degreasing, and inspection documentation.",
};

export default async function ContactPage() {
  const settings = await getGlobalSettings();
  const phone = settings.primaryPhone || "818-518-8161";
  const phoneDisplay = formatPhoneDisplay(phone);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr,1fr]">
      <section className="panel">
        <div className="pill bg-slate-900 text-white">Request</div>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Tell us about your kitchen</h1>
        <p className="text-sm text-slate-600">
          We respond quickly with a plan that fits your hood system, roof access, and inspection schedule. Photos and documentation included with every visit.
        </p>
        <div className="mt-6">
          <LeadForm defaultCity={settings.defaultCity || ""} />
        </div>
      </section>
      <aside className="panel space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Business details</h2>
        <div className="surface px-4 py-3 text-sm text-slate-800">
          <div className="font-semibold">{settings.businessName}</div>
          {settings.defaultStreetAddress && <div>{settings.defaultStreetAddress}</div>}
          <div>
            {[settings.defaultCity, settings.defaultState, settings.defaultZip]
              .filter(Boolean)
              .join(", ")}
          </div>
          <div className="font-semibold text-slate-900">{phoneDisplay}</div>
          {settings.primaryEmail && <div>{settings.primaryEmail}</div>}
        </div>
        <div className="surface px-4 py-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Service promise</p>
          <ul className="mt-2 space-y-1">
            <li>• NFPA-96 aligned cleanings from hood to fan.</li>
            <li>• Photo documentation and fresh service stickers.</li>
            <li>• Night and early-morning scheduling available.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
