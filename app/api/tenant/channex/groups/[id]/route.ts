import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { deleteGroup, getGroupById, updateGroup } from '@/services/channex/groups';
import type { ChannexUpdateGroupPayload } from '@/types/channex';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { id } = await context.params;
  const data = await getGroupById(id);
  return NextResponse.json({ data });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const body = (await request.json()) as ChannexUpdateGroupPayload;
  const { id } = await context.params;
  const data = await updateGroup(id, body);
  return NextResponse.json({ data });
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { id } = await context.params;
  const data = await deleteGroup(id);
  return NextResponse.json(data);
}
