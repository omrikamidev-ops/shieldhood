import { LocationForm } from "@/components/LocationForm";

export default function NewLocationPage() {
  return (
    <div className="panel">
      <h1 className="text-xl font-semibold text-slate-900">Add location</h1>
      <p className="text-sm text-slate-600">
        Fill out local intros, map embed, and publish when ready.
      </p>
      <div className="mt-4">
        <LocationForm mode="create" />
      </div>
    </div>
  );
}
