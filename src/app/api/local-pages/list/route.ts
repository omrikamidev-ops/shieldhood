import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status') as 'draft' | 'published' | null;

    const where = status ? { status } : {};

    const pages = await prisma.localPage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error('List failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list pages' },
      { status: 500 },
    );
  }
}
