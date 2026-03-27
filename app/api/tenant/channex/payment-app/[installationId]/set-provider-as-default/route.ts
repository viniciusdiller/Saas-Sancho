import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { setPaymentProviderAsDefault } from '@/services/channex/payments';

type SetAsDefaultPayload = {
  id: string;
};

export async function POST(request: Request, context: { params: Promise<{ installationId: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { installationId } = await context.params;
  const body = (await request.json()) as SetAsDefaultPayload;
  const data = await setPaymentProviderAsDefault(installationId, body.id);
  return NextResponse.json({ data });
}
