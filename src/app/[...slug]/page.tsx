import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getGlobalSettings } from '@/lib/data';
import { buildFaqJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { PRIMARY_KEYWORDS } from '@/lib/localPagesConfig';
import type { LocalPageContent } from '@/lib/localPages/types';

type PageParams = {
  params: Promise<{
    slug: string[];
  }>;
};

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const slugStr = `/${slug.join('/')}`;
  
  const localPage = await prisma.localPage.findUnique({
    where: { slug: slugStr, status: 'published' },
  });

  if (!localPage) {
    return {};
  }

  const settings = await getGlobalSettings();
  const canonical = `${settings.baseDomain}${slugStr}`;

  return {
    title: localPage.title,
    description: localPage.metaDescription,
    alternates: {
      canonical,
    },
  };
}

export default async function LocalPageDynamic({ params }: PageParams) {
  const { slug } = await params;
  const slugStr = `/${slug.join('/')}`;

  // Skip if this is a locations hub (handled by other route)
  if (slug.length === 2 && slug[1] === 'locations') {
    notFound();
  }

  const [settings, localPage] = await Promise.all([
    getGlobalSettings(),
    prisma.localPage.findUnique({
      where: { slug: slugStr, status: 'published' },
    }),
  ]);

  if (!localPage) {
    notFound();
  }

  const content = localPage.contentJson as unknown as LocalPageContent;
  const canonical = `${settings.baseDomain}${slugStr}`;
  const faqs = (localPage.faqJson as Array<{ question: string; answer: string }>) || [];
  const internalLinks = (localPage.internalLinksJson as Array<{ text: string; url: string }>) || [];

  // Build JSON-LD
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.businessName,
    url: canonical,
    telephone: settings.primaryPhone,
    ...(settings.primaryEmail ? { email: settings.primaryEmail } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: localPage.city,
      addressRegion: localPage.state,
      postalCode: localPage.zip || undefined,
    },
    areaServed: localPage.zip ? `ZIP ${localPage.zip}` : `${localPage.city}, ${localPage.state}`,
  };

  const faqJsonLd = buildFaqJsonLd(faqs.map((f) => ({ question: f.question, answer: f.answer })));

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: settings.baseDomain,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Locations',
        item: `${settings.baseDomain}/${localPage.primaryKeywordSlug}/locations/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: localPage.zip ? `ZIP ${localPage.zip}` : `${localPage.city}, ${localPage.state}`,
        item: canonical,
      },
    ],
  };

  // Get nearby pages
  const nearbyPages = await prisma.localPage.findMany({
    where: {
      status: 'published',
      primaryKeywordSlug: localPage.primaryKeywordSlug,
      slug: { not: slugStr },
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <JsonLd data={localBusinessJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <article>
        <h1 className="text-3xl font-semibold text-slate-900">{localPage.h1}</h1>

        <div
          className="prose prose-slate mt-6 max-w-none"
          dangerouslySetInnerHTML={{ __html: localPage.renderedHtml }}
        />

        {faqs.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-slate-900">Frequently Asked Questions</h2>
            <div className="mt-4 space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-lg border border-slate-200 p-4">
                  <h3 className="font-semibold text-slate-900">{faq.question}</h3>
                  <p className="mt-2 text-sm text-slate-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-slate-900">Locations & Nearby Help</h2>
          <div className="mt-4 space-y-2">
            <a
              href={`/${localPage.primaryKeywordSlug}/locations/`}
              className="block text-sky-600 hover:underline"
            >
              View all locations →
            </a>
            <a href="/contact" className="block text-sky-600 hover:underline">
              Contact us →
            </a>
            {nearbyPages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-700">Nearby locations:</p>
                <ul className="mt-2 space-y-1">
                  {nearbyPages.map((page) => (
                    <li key={page.id}>
                      <a href={page.slug} className="text-sm text-sky-600 hover:underline">
                        {page.city || page.zip}, {page.state}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </article>
    </div>
  );
}
