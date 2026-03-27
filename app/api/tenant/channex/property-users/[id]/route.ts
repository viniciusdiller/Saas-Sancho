import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { deletePropertyUser, getPropertyUserById, updatePropertyUser } from '@/services/channex/propertyUsers';
import type { ChannexUpdatePropertyUserPayload } from '@/types/channex';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { id } = await context.params;
  const data = await getPropertyUserById(id);
  return NextResponse.json({ data });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const body = (await request.json()) as ChannexUpdatePropertyUserPayload;
  const { id } = await context.params;
  const data = await updatePropertyUser(id, body);
  return NextResponse.json({ data });
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { id } = await context.params;
  const data = await deletePropertyUser(id);
  return NextResponse.json(data);
}
