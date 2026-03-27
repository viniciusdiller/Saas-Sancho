import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { listPaymentTransactions } from '@/services/channex/payments';
import type { ChannexPaymentTransactionsQueryPayload } from '@/types/channex';

export async function POST(request: Request, context: { params: Promise<{ installationId: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { installationId } = await context.params;
  const body = (await request.json()) as ChannexPaymentTransactionsQueryPayload;
  const data = await listPaymentTransactions(installationId, body);
  return NextResponse.json({ data });
}
