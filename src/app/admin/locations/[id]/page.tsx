import { notFound } from "next/navigation";
import { LocationForm } from "@/components/LocationForm";
import { prisma } from "@/lib/prisma";
import { parseFaqString } from "@/lib/faq";
import { parseTestimonials } from "@/lib/data";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function EditLocationPage({ params }: Params) {
  const { id } = await params;
  const locationId = Number(id);
  const location = await prisma.location.findUnique({ where: { id: locationId } });

  if (!location) {
    notFound();
  }

  const faqItems = parseFaqString(location.locationFAQ);
  const testimonials = parseTestimonials(location.localTestimonials);

  return (
    <div className="panel">
      <h1 className="text-xl font-semibold text-slate-900">Edit location</h1>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">Update meta, content, and publish state.</p>
        <a
          href={`/locations/${location.slug}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-sky-700 hover:text-sky-800"
        >
          Preview page →
        </a>
      </div>
      <div className="mt-4">
        <LocationForm
          mode="edit"
          initialData={{
            ...location,
            faqItems,
            testimonials,
          }}
        />
      </div>
    </div>
  );
}
