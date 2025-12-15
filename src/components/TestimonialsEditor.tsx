"use client";

import { useEffect, useState } from "react";
import { LocalTestimonial } from "@/lib/data";

type Props = {
  value?: LocalTestimonial[];
  onChange: (items: LocalTestimonial[]) => void;
};

export function TestimonialsEditor({ value, onChange }: Props) {
  const [items, setItems] = useState<LocalTestimonial[]>(value ?? []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(value ?? []);
  }, [value]);

  const updateItem = (index: number, field: keyof LocalTestimonial, newValue: string) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: newValue };
    setItems(next);
    onChange(next);
  };

  const addItem = () => {
    const next = [...items, { name: "", role: "", quote: "", area: "" }];
    setItems(next);
    onChange(next);
  };

  const removeItem = (index: number) => {
    const next = items.filter((_, idx) => idx !== index);
    setItems(next);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={idx} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Testimonial {idx + 1}</div>
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="text-xs font-semibold text-slate-500 hover:text-amber-700"
            >
              Remove
            </button>
          </div>
          <label className="mt-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Name
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
              value={item.name}
              onChange={(e) => updateItem(idx, "name", e.target.value)}
              placeholder="Chef or manager name"
            />
          </label>
          <label className="mt-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Role or business type
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
              value={item.role || ""}
              onChange={(e) => updateItem(idx, "role", e.target.value)}
              placeholder="GM, Owner, Chef"
            />
          </label>
          <label className="mt-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Quote
            <textarea
              rows={3}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
              value={item.quote}
              onChange={(e) => updateItem(idx, "quote", e.target.value)}
              placeholder="They cleaned the whole run overnight and documented everything."
            />
          </label>
          <label className="mt-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            City / Neighborhood label
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
              value={item.area || ""}
              onChange={(e) => updateItem(idx, "area", e.target.value)}
              placeholder="Arts District, Downtown"
            />
          </label>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-sky-200 hover:text-sky-800"
      >
        + Add testimonial
      </button>
    </div>
  );
}
