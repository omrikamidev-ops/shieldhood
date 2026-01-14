import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slugs } = body as { slugs: string[] };

    if (!Array.isArray(slugs)) {
      return NextResponse.json({ error: 'slugs must be an array' }, { status: 400 });
    }

    const existing = await prisma.localPage.findMany({
      where: { slug: { in: slugs } },
      select: { slug: true },
    });

    const existingSlugs = new Set(existing.map((p) => p.slug));

    return NextResponse.json({
      existing: slugs.filter((slug) => existingSlugs.has(slug)),
      available: slugs.filter((slug) => !existingSlugs.has(slug)),
    });
  } catch (error) {
    console.error('Check slugs failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check slugs' },
      { status: 500 },
    );
  }
}
