"use client";

import { useState } from "react";
import { FAQItem } from "@/lib/faq";

type Props = {
  faqs: FAQItem[];
  className?: string;
};

export function FAQAccordion({ faqs, className }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={className}>
      {faqs.map((faq, idx) => (
        <div key={faq.question} className="border-b border-slate-200 py-4">
          <button
            type="button"
            className="flex w-full items-center justify-between text-left"
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          >
            <span className="text-base font-semibold text-slate-900">
              {faq.question}
            </span>
            <span className="text-slate-500">{openIndex === idx ? "–" : "+"}</span>
          </button>
          {openIndex === idx && (
            <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
}
