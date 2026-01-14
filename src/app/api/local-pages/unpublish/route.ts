import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id } = body as { id: string };

    const localPage = await prisma.localPage.findUnique({ where: { id } });
    if (!localPage) {
      return NextResponse.json({ error: 'Local page not found' }, { status: 404 });
    }

    const updated = await prisma.localPage.update({
      where: { id },
      data: { status: 'draft' },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Unpublish failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to unpublish' },
      { status: 500 },
    );
  }
}
