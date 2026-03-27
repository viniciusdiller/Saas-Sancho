import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { createWebhook, listWebhooks } from '@/services/channex/webhooks';
import type { ChannexWebhookWritePayload } from '@/types/channex';

export async function GET(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 10);

  const data = await listWebhooks({ page, limit });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const body = (await request.json()) as ChannexWebhookWritePayload;
  const data = await createWebhook(body);
  return NextResponse.json({ data }, { status: 201 });
}
