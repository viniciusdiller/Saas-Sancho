import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { testWebhook } from '@/services/channex/webhooks';
import type { ChannexWebhookWritePayload } from '@/types/channex';

export async function POST(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const body = (await request.json()) as ChannexWebhookWritePayload;
  const data = await testWebhook(body);
  return NextResponse.json({ data });
}
