import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getGlobalSettings } from '@/lib/data';
import { PRIMARY_KEYWORDS } from '@/lib/localPagesConfig';

type PageParams = {
  params: Promise<{
    keywordSlug: string;
  }>;
};

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { keywordSlug } = await params;
  const keyword = PRIMARY_KEYWORDS.find((kw) => kw.slug === keywordSlug);
  
  if (!keyword) {
    return {};
  }

  const settings = await getGlobalSettings();
  const canonical = `${settings.baseDomain}/${keywordSlug}/locations/`;

  return {
    title: `${keyword.label} Locations | ${settings.businessName}`,
    description: `Find ${keyword.label.toLowerCase()} services in cities across California.`,
    alternates: {
      canonical,
    },
  };
}

export default async function LocationsHubPage({ params }: PageParams) {
  const { keywordSlug } = await params;
  
  const keyword = PRIMARY_KEYWORDS.find((kw) => kw.slug === keywordSlug);
  if (!keyword) {
    notFound();
  }

  const [settings, pages] = await Promise.all([
    getGlobalSettings(),
    prisma.localPage.findMany({
      where: {
        status: 'published',
        primaryKeywordSlug: keywordSlug,
      },
      orderBy: { city: 'asc' },
    }),
  ]);

  // Group pages by first character
  const grouped: Record<string, typeof pages> = {};
  pages.forEach((page) => {
    const firstChar = (page.city || page.zip || 'Other')[0].toUpperCase();
    const key = /[A-Z]/.test(firstChar) ? firstChar : /[0-9]/.test(firstChar) ? '0-9' : '#';
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(page);
  });

  const sortedGroups = Object.keys(grouped).sort();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          {keyword.label} Locations
        </h1>
        <p className="mt-2 text-slate-600">
          Find {keyword.label.toLowerCase()} services in cities across California.
        </p>
      </div>

      {/* Jump links */}
      <div className="flex flex-wrap gap-2">
        {sortedGroups.map((group) => (
          <a
            key={group}
            href={`#group-${group}`}
            className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            {group}
          </a>
        ))}
      </div>

      {/* Grouped pages */}
      <div className="space-y-8">
        {sortedGroups.map((group) => (
          <section key={group} id={`group-${group}`}>
            <h2 className="text-2xl font-semibold text-slate-900">{group}</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {grouped[group].map((page) => (
                <a
                  key={page.id}
                  href={page.slug}
                  className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50"
                >
                  <div className="font-semibold text-slate-900">
                    {page.city || `ZIP ${page.zip}`}
                  </div>
                  {page.county && (
                    <div className="text-xs text-slate-600">{page.county} County</div>
                  )}
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="pt-4">
        <a href="#top" className="text-sm text-sky-600 hover:underline">
          Back to top ↑
        </a>
      </div>
    </div>
  );
}
