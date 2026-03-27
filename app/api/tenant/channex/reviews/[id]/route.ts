import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { getReviewById } from '@/services/channex/reviews';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { id } = await context.params;
  const data = await getReviewById(id);
  return NextResponse.json({ data });
}
