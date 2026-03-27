import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { listBookingMessages, sendBookingMessage } from '@/services/channex/messages';
import type { ChannexBookingMessageWritePayload } from '@/types/channex';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 10);

  const { id } = await context.params;
  const data = await listBookingMessages(id, { page, limit });
  return NextResponse.json({ data });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const body = (await request.json()) as ChannexBookingMessageWritePayload;
  const { id } = await context.params;
  const data = await sendBookingMessage(id, body);
  return NextResponse.json({ data });
}
