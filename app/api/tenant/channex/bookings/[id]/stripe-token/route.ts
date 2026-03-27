import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { createStripeCreditCardToken } from '@/services/channex/stripeTokenization';

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { id } = await context.params;
  const data = await createStripeCreditCardToken(id);
  return NextResponse.json({ data });
}
