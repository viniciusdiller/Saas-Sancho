import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { attachPropertyToGroup, removePropertyFromGroup } from '@/services/channex/groups';

export async function POST(_: Request, context: { params: Promise<{ id: string; propertyId: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { id, propertyId } = await context.params;
  const data = await attachPropertyToGroup(id, propertyId);
  return NextResponse.json(data);
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string; propertyId: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { id, propertyId } = await context.params;
  const data = await removePropertyFromGroup(id, propertyId);
  return NextResponse.json(data);
}
