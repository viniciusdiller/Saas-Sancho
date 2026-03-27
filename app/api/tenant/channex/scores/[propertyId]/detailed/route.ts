import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { getDetailedPropertyScore } from '@/services/channex/reviews';

export async function GET(_: Request, context: { params: Promise<{ propertyId: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { propertyId } = await context.params;
  const data = await getDetailedPropertyScore(propertyId);
  return NextResponse.json({ data });
}
