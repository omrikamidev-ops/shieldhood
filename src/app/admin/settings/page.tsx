import { SettingsForm } from "@/components/SettingsForm";
import { getGlobalSettings } from "@/lib/data";

export default async function AdminSettingsPage() {
  const settings = await getGlobalSettings();

  return (
    <div className="panel">
      <h1 className="text-xl font-semibold text-slate-900">Global settings</h1>
      <p className="text-sm text-slate-600">
        These values feed every location page and ensure NAP consistency.
      </p>
      <div className="mt-4">
        <SettingsForm initialData={settings} />
      </div>
    </div>
  );
}
