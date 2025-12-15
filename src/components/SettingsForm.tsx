"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FAQItem } from "@/lib/faq";
import { SettingsWithFaq } from "@/lib/data";
import { FaqEditor } from "./FaqEditor";

type SettingsFormProps = {
  initialData: SettingsWithFaq;
};

export function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  const [formState, setFormState] = useState({
    businessName: initialData.businessName || "",
    primaryPhone: initialData.primaryPhone || "",
    primaryEmail: initialData.primaryEmail || "",
    baseDomain: initialData.baseDomain || "",
    defaultStreetAddress: initialData.defaultStreetAddress || "",
    defaultCity: initialData.defaultCity || "",
    defaultState: initialData.defaultState || "",
    defaultZip: initialData.defaultZip || "",
    defaultCountry: initialData.defaultCountry || "",
    globalServiceDescription: initialData.globalServiceDescription || "",
  });
  const [faqItems, setFaqItems] = useState<FAQItem[]>(initialData.faqItems || []);
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "success">("idle");
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("saving");
    setError("");

    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formState, faqItems }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setStatus("error");
      setError(data.error || "Unable to save settings.");
      return;
    }

    setStatus("success");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Business name"
          required
          value={formState.businessName}
          onChange={(value) => handleChange("businessName", value)}
        />
        <Input
          label="Primary phone"
          required
          value={formState.primaryPhone}
          onChange={(value) => handleChange("primaryPhone", value)}
        />
        <Input
          label="Primary email"
          value={formState.primaryEmail}
          onChange={(value) => handleChange("primaryEmail", value)}
        />
        <Input
          label="Base domain (for canonical)"
          required
          value={formState.baseDomain}
          onChange={(value) => handleChange("baseDomain", value)}
          placeholder="https://shieldhoodservice.com"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Default street address"
          value={formState.defaultStreetAddress}
          onChange={(value) => handleChange("defaultStreetAddress", value)}
        />
        <Input
          label="Default city"
          value={formState.defaultCity}
          onChange={(value) => handleChange("defaultCity", value)}
        />
        <Input
          label="Default state"
          value={formState.defaultState}
          onChange={(value) => handleChange("defaultState", value)}
        />
        <Input
          label="Default ZIP"
          value={formState.defaultZip}
          onChange={(value) => handleChange("defaultZip", value)}
        />
        <Input
          label="Default country"
          value={formState.defaultCountry}
          onChange={(value) => handleChange("defaultCountry", value)}
        />
      </div>

      <label className="text-sm font-semibold text-slate-800">
        Global service description
        <textarea
          value={formState.globalServiceDescription}
          onChange={(e) => handleChange("globalServiceDescription", e.target.value)}
          rows={3}
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
        />
      </label>

      <div className="space-y-2">
        <div className="text-sm font-semibold text-slate-900">Global FAQ</div>
        <FaqEditor value={faqItems} onChange={setFaqItems} />
      </div>

      {error && <p className="text-sm text-amber-700">{error}</p>}
      {status === "success" && <p className="text-sm text-green-700">Saved.</p>}

      <button
        type="submit"
        className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-700 disabled:opacity-75"
        disabled={status === "saving"}
      >
        {status === "saving" ? "Saving..." : "Save settings"}
      </button>
    </form>
  );
}

function Input({
  label,
  value,
  required,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  required?: boolean;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="text-sm font-semibold text-slate-800">
      {label} {required && <span className="text-orange-600">*</span>}
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
      />
    </label>
  );
}
