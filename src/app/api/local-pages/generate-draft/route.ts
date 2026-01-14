import { NextResponse } from 'next/server';
import { generateLocalPageDraft } from '@/lib/localPages/generate';
import type { GenerateDraftRequest } from '@/lib/localPages/types';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateDraftRequest;
    const localPage = await generateLocalPageDraft(body);
    return NextResponse.json(localPage);
  } catch (error) {
    console.error('Generate draft failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate draft' },
      { status: 400 },
    );
  }
}
