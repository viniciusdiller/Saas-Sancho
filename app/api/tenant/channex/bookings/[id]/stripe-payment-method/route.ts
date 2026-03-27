import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { createStripePaymentMethodToken } from '@/services/channex/stripeTokenization';

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { id } = await context.params;
  const data = await createStripePaymentMethodToken(id);
  return NextResponse.json({ data });
}
