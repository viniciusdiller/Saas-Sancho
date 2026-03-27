import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { createGroup, listGroups } from '@/services/channex/groups';
import type { ChannexCreateGroupPayload } from '@/types/channex';

export async function GET() {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const data = await listGroups();
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const body = (await request.json()) as ChannexCreateGroupPayload;
  const data = await createGroup(body);
  return NextResponse.json({ data }, { status: 201 });
}
