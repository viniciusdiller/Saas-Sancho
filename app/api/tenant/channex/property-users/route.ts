import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { invitePropertyUser, listPropertyUsers } from '@/services/channex/propertyUsers';
import type { ChannexInvitePropertyUserPayload } from '@/types/channex';

export async function GET(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get('property_id');
  if (!propertyId) return NextResponse.json({ message: 'property_id é obrigatório.' }, { status: 400 });

  const data = await listPropertyUsers(propertyId);
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const body = (await request.json()) as ChannexInvitePropertyUserPayload;
  const data = await invitePropertyUser(body);
  return NextResponse.json({ data }, { status: 201 });
}
