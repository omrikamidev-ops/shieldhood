"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { generateLocationSlug } from "@/lib/slug";
import { FAQItem } from "@/lib/faq";
import { LocalTestimonial } from "@/lib/data";
import { FaqEditor } from "./FaqEditor";
import { TestimonialsEditor } from "./TestimonialsEditor";

type LocationInitial = {
  id?: number;
  city?: string;
  regionOrCounty?: string;
  state?: string;
  country?: string;
  slug?: string;
  pageTitleOverride?: string | null;
  metaDescriptionOverride?: string | null;
  h1Override?: string | null;
  streetAddress?: string | null;
  zip?: string | null;
  phoneOverride?: string | null;
  shortIntro?: string;
  longIntro?: string;
  mainBody?: string;
  whatTypicallyHappensNext?: string | null;
  servicesIntro?: string | null;
  neighborhoodsOrAreas?: string | null;
  localStatsOrRegulationNotes?: string | null;
  localLandmarks?: string | null;
  googleMapsEmbedUrl?: string | null;
  published?: boolean;
  faqItems?: FAQItem[];
  testimonials?: LocalTestimonial[];
};

type LocationFormProps = {
  mode: "create" | "edit";
  initialData?: LocationInitial;
};

export function LocationForm({ mode, initialData }: LocationFormProps) {
  const router = useRouter();
  const [city, setCity] = useState(initialData?.city || "");
  const [regionOrCounty, setRegionOrCounty] = useState(initialData?.regionOrCounty || "");
  const [state, setState] = useState(initialData?.state || "");
  const [country, setCountry] = useState(initialData?.country || "USA");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [formState, setFormState] = useState({
    streetAddress: initialData?.streetAddress || "",
    zip: initialData?.zip || "",
    phoneOverride: initialData?.phoneOverride || "",
    pageTitleOverride: initialData?.pageTitleOverride || "",
    metaDescriptionOverride: initialData?.metaDescriptionOverride || "",
    h1Override: initialData?.h1Override || "",
    shortIntro: initialData?.shortIntro || "",
    longIntro: initialData?.longIntro || "",
    mainBody: initialData?.mainBody || "",
    whatTypicallyHappensNext: initialData?.whatTypicallyHappensNext || "",
    servicesIntro: initialData?.servicesIntro || "",
    neighborhoodsOrAreas: initialData?.neighborhoodsOrAreas || "",
    localStatsOrRegulationNotes: initialData?.localStatsOrRegulationNotes || "",
    localLandmarks: initialData?.localLandmarks || "",
    googleMapsEmbedUrl: initialData?.googleMapsEmbedUrl || "",
    published: Boolean(initialData?.published),
  });

  const [faqItems, setFaqItems] = useState<FAQItem[]>(initialData?.faqItems || []);
  const [testimonials, setTestimonials] = useState<LocalTestimonial[]>(
    initialData?.testimonials || [],
  );
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "success">("idle");
  const [aiStatus, setAiStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [error, setError] = useState("");
  const [aiNote, setAiNote] = useState("");

  const handleChange = (field: string, value: string | boolean) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const payload = useMemo(
    () => ({
      city,
      regionOrCounty,
      state,
      country,
      slug,
      ...formState,
      locationFAQ: faqItems,
      localTestimonials: testimonials,
    }),
    [city, regionOrCounty, state, country, slug, formState, faqItems, testimonials],
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("saving");
    setError("");

    const endpoint =
      mode === "edit" && initialData?.id ? `/api/locations/${initialData.id}` : "/api/locations";
    const method = mode === "edit" ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setStatus("error");
      setError(data.error || "Unable to save location.");
      return;
    }

    setStatus("success");
    router.push("/admin/locations");
    router.refresh();
  };

  const runGeneration = async (scope: "all" | "faq" | "testimonials" | "body" = "all") => {
    setAiStatus("loading");
    setAiNote("");
    setError("");
    try {
      const response = await fetch("/api/admin/generate-location-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope,
          city,
          regionOrCounty,
          state,
          country,
          neighborhoodsOrAreas: formState.neighborhoodsOrAreas,
          tone: "direct, inspection-ready, service-first",
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setAiStatus("error");
        setError(data.error || "AI generation failed.");
        return;
      }

      const data = await response.json();
      if (scope === "all" || scope === "body") {
        handleChange("pageTitleOverride", data.pageTitleOverride || formState.pageTitleOverride);
        handleChange(
          "metaDescriptionOverride",
          data.metaDescriptionOverride || formState.metaDescriptionOverride,
        );
        handleChange("h1Override", data.h1Override || formState.h1Override);
        handleChange("shortIntro", data.shortIntro || formState.shortIntro);
        handleChange("longIntro", data.longIntro || formState.longIntro);
        handleChange("mainBody", data.mainBody || formState.mainBody);
        handleChange(
          "whatTypicallyHappensNext",
          data.whatTypicallyHappensNext || formState.whatTypicallyHappensNext,
        );
        handleChange("servicesIntro", data.servicesIntro || formState.servicesIntro);
        handleChange(
          "localStatsOrRegulationNotes",
          data.localStatsOrRegulationNotes || formState.localStatsOrRegulationNotes,
        );
        handleChange(
          "neighborhoodsOrAreas",
          data.neighborhoodsOrAreas || formState.neighborhoodsOrAreas,
        );
      }
      if (scope === "all" || scope === "testimonials") {
        setTestimonials(data.localTestimonials || testimonials);
      }
      if (scope === "all" || scope === "faq") {
        setFaqItems(data.locationFAQ || faqItems);
      }
      setAiStatus("success");
      setAiNote("AI generated a draft — please review and edit before publishing.");
    } catch (err) {
      console.error(err);
      setAiStatus("error");
      setError("AI generation failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => runGeneration("all")}
          className="pill solid px-4 py-2 text-[11px]"
          disabled={aiStatus === "loading"}
        >
          {aiStatus === "loading" ? "Generating..." : "Generate with AI"}
        </button>
        <button
          type="button"
          onClick={() => runGeneration("body")}
          className="pill ghost px-4 py-2 text-[11px]"
          disabled={aiStatus === "loading"}
        >
          Regenerate body
        </button>
        <button
          type="button"
          onClick={() => runGeneration("faq")}
          className="pill ghost px-4 py-2 text-[11px]"
          disabled={aiStatus === "loading"}
        >
          Regenerate FAQ
        </button>
        <button
          type="button"
          onClick={() => runGeneration("testimonials")}
          className="pill ghost px-4 py-2 text-[11px]"
          disabled={aiStatus === "loading"}
        >
          Regenerate testimonials
        </button>
        {aiNote && <span className="text-xs font-semibold text-slate-600">{aiNote}</span>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="City"
          required
          value={city}
          onChange={(value) => {
            setCity(value);
            if (!slugTouched) {
              setSlug(generateLocationSlug(value, state));
            }
          }}
          placeholder="Los Angeles"
        />
        <Input
          label="State"
          required
          value={state}
          onChange={(value) => {
            setState(value);
            if (!slugTouched) {
              setSlug(generateLocationSlug(city, value));
            }
          }}
          placeholder="CA"
        />
        <Input
          label="Region / County"
          required
          value={regionOrCounty}
          onChange={(value) => setRegionOrCounty(value)}
          placeholder="Los Angeles County"
        />
        <Input
          label="Country"
          value={country}
          onChange={(value) => setCountry(value)}
          placeholder="USA"
        />
        <Input
          label="Street address"
          value={formState.streetAddress}
          onChange={(value) => handleChange("streetAddress", value)}
          placeholder="123 Main St"
        />
        <Input
          label="ZIP"
          value={formState.zip}
          onChange={(value) => handleChange("zip", value)}
          placeholder="90012"
        />
        <Input
          label="Phone override"
          value={formState.phoneOverride}
          onChange={(value) => handleChange("phoneOverride", value)}
          placeholder="(555) 555-0123"
        />
        <Input
          label="Slug"
          required
          value={slug}
          onFocus={() => setSlugTouched(true)}
          onChange={(value) => {
            setSlug(value);
            setSlugTouched(true);
          }}
          placeholder="los-angeles-ca-hood-cleaning"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Title override"
          value={formState.pageTitleOverride}
          onChange={(value) => handleChange("pageTitleOverride", value)}
        />
        <Input
          label="Meta description override"
          value={formState.metaDescriptionOverride}
          onChange={(value) => handleChange("metaDescriptionOverride", value)}
        />
        <Input
          label="H1 override"
          value={formState.h1Override}
          onChange={(value) => handleChange("h1Override", value)}
        />
      </div>

      <TextArea
        label="Short intro"
        required
        value={formState.shortIntro}
        onChange={(value) => handleChange("shortIntro", value)}
      />
      <TextArea
        label="Long intro"
        required
        value={formState.longIntro}
        onChange={(value) => handleChange("longIntro", value)}
      />
      <TextArea
        label="Main body (800-1200 words)"
        required
        rows={12}
        value={formState.mainBody}
        onChange={(value) => handleChange("mainBody", value)}
        placeholder="Full city-specific content about codes, inspections, schedules, and how we help."
      />
      <TextArea
        label="What typically happens next (2-3 paragraphs explaining the process flow)"
        rows={8}
        value={formState.whatTypicallyHappensNext}
        onChange={(value) => handleChange("whatTypicallyHappensNext", value)}
        placeholder="Explain the typical process from initial contact through service completion. Help readers understand what to expect step-by-step."
      />
      <TextArea
        label="Services intro"
        value={formState.servicesIntro}
        onChange={(value) => handleChange("servicesIntro", value)}
      />
      <TextArea
        label="Neighborhoods / Areas"
        value={formState.neighborhoodsOrAreas}
        onChange={(value) => handleChange("neighborhoodsOrAreas", value)}
        placeholder="Hollywood, Koreatown, Santa Monica"
      />
      <TextArea
        label="Local stats or regulation notes"
        value={formState.localStatsOrRegulationNotes}
        onChange={(value) => handleChange("localStatsOrRegulationNotes", value)}
        placeholder="Refer to NFPA 96 and local fire department inspection cadence."
      />
      <TextArea
        label="Local landmarks / short list"
        value={formState.localLandmarks}
        onChange={(value) => handleChange("localLandmarks", value)}
        placeholder="Downtown, Arts District, Seaport"
      />
      <Input
        label="Google Maps embed URL"
        required
        value={formState.googleMapsEmbedUrl}
        onChange={(value) => handleChange("googleMapsEmbedUrl", value)}
        placeholder="https://www.google.com/maps/embed?pb=..."
      />

      <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <input
          type="checkbox"
          checked={formState.published}
          onChange={(e) => handleChange("published", e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-sky-600"
        />
        Published
      </label>

      <div className="space-y-2">
        <div className="text-sm font-semibold text-slate-900">Testimonials</div>
        <TestimonialsEditor value={testimonials} onChange={setTestimonials} />
      </div>

      <div className="space-y-2">
        <div className="text-sm font-semibold text-slate-900">Location FAQ</div>
        <FaqEditor value={faqItems} onChange={setFaqItems} />
      </div>

      {error && <p className="text-sm text-amber-700">{error}</p>}

      <button
        type="submit"
        className="pill solid px-5 py-3 text-[11px]"
        disabled={status === "saving"}
      >
        {status === "saving" ? "Saving..." : mode === "edit" ? "Update location" : "Create location"}
      </button>
    </form>
  );
}

type InputProps = {
  label: string;
  value: string;
  required?: boolean;
  placeholder?: string;
  onChange: (v: string) => void;
  onFocus?: () => void;
};

function Input({ label, value, placeholder, required, onChange, onFocus }: InputProps) {
  return (
    <label className="text-sm font-semibold text-slate-800">
      {label} {required && <span className="text-orange-600">*</span>}
      <input
        required={required}
        value={value}
        onFocus={onFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  required,
  placeholder,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  required?: boolean;
  placeholder?: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="text-sm font-semibold text-slate-800">
      {label} {required && <span className="text-orange-600">*</span>}
      <textarea
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
      />
    </label>
  );
}
