import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { PublishRequest } from '@/lib/localPages/types';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PublishRequest;
    const { id, force = false } = body;

    const localPage = await prisma.localPage.findUnique({ where: { id } });
    if (!localPage) {
      return NextResponse.json({ error: 'Local page not found' }, { status: 404 });
    }

    // Check if another published page exists for this slug
    const existingPublished = await prisma.localPage.findFirst({
      where: { slug: localPage.slug, status: 'published', id: { not: id } },
    });
    if (existingPublished) {
      return NextResponse.json(
        { error: 'Another published page already exists for this slug' },
        { status: 400 },
      );
    }

    // Check safety flags and uniqueness if not forcing
    if (!force) {
      if (localPage.safetyFlags.length > 0) {
        return NextResponse.json(
          {
            error: 'Page has safety flags',
            flags: localPage.safetyFlags,
          },
          { status: 400 },
        );
      }
      if (localPage.uniquenessScore !== null) {
        const uniquenessValue = Number(localPage.uniquenessScore);
        if (uniquenessValue < 0.9) {
          return NextResponse.json(
            {
              error: 'Uniqueness score below threshold',
              uniquenessScore: uniquenessValue,
            },
            { status: 400 },
          );
        }
      }
    }

    // Publish
    const updated = await prisma.localPage.update({
      where: { id },
      data: { status: 'published' },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Publish failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to publish' },
      { status: 500 },
    );
  }
}
