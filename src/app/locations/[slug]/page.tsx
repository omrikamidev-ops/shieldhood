import { redirect } from "next/navigation";

type PageParams = { params: Promise<{ slug: string }> };

export default async function LocationRedirect({ params }: PageParams) {
  const { slug } = await params;
  const nextSlug = slug.endsWith("-hood-cleaning")
    ? `hood-cleaning-${slug.replace(/-hood-cleaning$/, "")}`
    : slug;
  redirect(`/${nextSlug}`);
}
