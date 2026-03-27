import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { updatePaymentProvider } from '@/services/channex/payments';
import type { ChannexPaymentUpdateProviderPayload } from '@/types/channex';

export async function PUT(request: Request, context: { params: Promise<{ installationId: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { installationId } = await context.params;
  const body = (await request.json()) as ChannexPaymentUpdateProviderPayload;
  const data = await updatePaymentProvider(installationId, body);
  return NextResponse.json({ data });
}
