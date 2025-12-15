"use client";

import { useEffect, useState } from "react";
import { FAQItem } from "@/lib/faq";

type Props = {
  value?: FAQItem[];
  onChange: (items: FAQItem[]) => void;
};

export function FaqEditor({ value, onChange }: Props) {
  const [items, setItems] = useState<FAQItem[]>(value ?? []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(value ?? []);
  }, [value]);

  const updateItem = (index: number, field: keyof FAQItem, newValue: string) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: newValue };
    setItems(next);
    onChange(next);
  };

  const addItem = () => {
    const next = [...items, { question: "", answer: "" }];
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
            <div className="text-sm font-semibold text-slate-900">FAQ {idx + 1}</div>
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="text-xs font-semibold text-slate-500 hover:text-amber-700"
            >
              Remove
            </button>
          </div>
          <label className="mt-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Question
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
              value={item.question}
              onChange={(e) => updateItem(idx, "question", e.target.value)}
              placeholder="What hours can you service our hood?"
            />
          </label>
          <label className="mt-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Answer
            <textarea
              rows={3}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
              value={item.answer}
              onChange={(e) => updateItem(idx, "answer", e.target.value)}
              placeholder="We schedule after last seating or early mornings to keep airflow balanced."
            />
          </label>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-sky-200 hover:text-sky-800"
      >
        + Add FAQ
      </button>
    </div>
  );
}
