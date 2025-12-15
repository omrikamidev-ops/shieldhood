export type FAQItem = {
  question: string;
  answer: string;
};

export const parseFaqString = (raw?: string | null) => {
  if (!raw) return [] as FAQItem[];

  try {
    const parsed = JSON.parse(raw) as FAQItem[];
    return Array.isArray(parsed)
      ? parsed.filter((item) => item?.question && item?.answer)
      : [];
  } catch (error) {
    console.warn("Failed to parse FAQ JSON", error);
    return [] as FAQItem[];
  }
};

export const stringifyFaq = (faq?: FAQItem[] | null) =>
  JSON.stringify(faq ?? []);

export const mergeFaqs = (globalFaq?: FAQItem[] | null, locationFaq?: FAQItem[] | null) => {
  const map = new Map<string, FAQItem>();

  (globalFaq ?? []).forEach((item) => {
    if (item.question && item.answer) {
      map.set(item.question, item);
    }
  });

  (locationFaq ?? []).forEach((item) => {
    if (item.question && item.answer) {
      map.set(item.question, item);
    }
  });

  return Array.from(map.values());
};
