import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { getChannelSettings, updateChannelSettings } from '@/services/channex/channels';
import type { ChannexChannelSettingsWritePayload } from '@/types/channex';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { id } = await context.params;
  const data = await getChannelSettings(id);
  return NextResponse.json({ data });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const body = (await request.json()) as ChannexChannelSettingsWritePayload;
  const { id } = await context.params;
  const data = await updateChannelSettings(id, body);
  return NextResponse.json({ data });
}
