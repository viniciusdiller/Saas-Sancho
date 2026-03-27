import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { inviteGroupUser, listGroupUsers } from '@/services/channex/groupUsers';
import type { ChannexInviteGroupUserPayload } from '@/types/channex';

export async function GET(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get('group_id');
  if (!groupId) return NextResponse.json({ message: 'group_id é obrigatório.' }, { status: 400 });

  const data = await listGroupUsers(groupId);
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const body = (await request.json()) as ChannexInviteGroupUserPayload;
  const data = await inviteGroupUser(body);
  return NextResponse.json({ data }, { status: 201 });
}
