import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { replyToReview } from '@/services/channex/reviews';
import type { ChannexReviewReplyPayload } from '@/types/channex';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const body = (await request.json()) as ChannexReviewReplyPayload;
  const { id } = await context.params;
  const data = await replyToReview(id, body);
  return NextResponse.json({ data });
}
