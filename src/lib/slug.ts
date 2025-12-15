const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const generateLocationSlug = (city: string, state?: string) => {
  const base = [city, state, "hood cleaning"].filter(Boolean).join(" ");
  return slugify(base);
};

export const ensureUniqueSlug = async (
  slug: string,
  exists: (candidate: string) => Promise<boolean>,
) => {
  let candidate = slugify(slug);
  let counter = 1;

  while (await exists(candidate)) {
    candidate = `${slugify(slug)}-${counter}`;
    counter += 1;
  }

  return candidate;
};
