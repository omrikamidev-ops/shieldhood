"use client";

import { useState } from "react";

type LeadFormProps = {
  locationSlug?: string;
  defaultCity?: string;
  locationId?: number;
};

export function LeadForm({ locationSlug, defaultCity, locationId }: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        locationSlug,
        locationId,
        pageUrl: window.location.href,
      }),
    });

    if (response.ok) {
      setStatus("success");
      setMessage("Request received. We will reach out shortly.");
      event.currentTarget.reset();
    } else {
      const data = await response.json().catch(() => ({}));
      setStatus("error");
      setMessage(data.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-800">
          Name*
          <input
            required
            name="name"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-sky-100 focus:ring-2 focus:ring-sky-500"
            placeholder="Who should we contact?"
          />
        </label>
        <label className="text-sm font-semibold text-slate-800">
          Email
          <input
            type="email"
            name="email"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-sky-100 focus:ring-2 focus:ring-sky-500"
            placeholder="you@example.com"
          />
        </label>
        <label className="text-sm font-semibold text-slate-800">
          Phone*
          <input
            required
            name="phone"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-sky-100 focus:ring-2 focus:ring-sky-500"
            placeholder="(555) 555-0123"
          />
        </label>
        <label className="text-sm font-semibold text-slate-800">
          Restaurant / facility name
          <input
            name="restaurantName"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-sky-100 focus:ring-2 focus:ring-sky-500"
            placeholder="Business name"
          />
        </label>
      </div>
      <label className="text-sm font-semibold text-slate-800">
        City / service area
        <input
          name="city"
          defaultValue={defaultCity}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-sky-100 focus:ring-2 focus:ring-sky-500"
          placeholder="City for service"
        />
      </label>
      {locationId ? (
        <input type="hidden" name="locationId" value={locationId} />
      ) : null}
      <label className="text-sm font-semibold text-slate-800">
        How can we help?
        <textarea
          name="message"
          rows={4}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-sky-100 focus:ring-2 focus:ring-sky-500"
          placeholder="Describe your hood system, schedule, or compliance deadlines."
        />
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-75"
      >
        {status === "loading" ? "Sending..." : "Request service"}
      </button>
      {message && (
        <p
          className={`text-sm ${status === "error" ? "text-amber-700" : "text-slate-700"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
