import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { deleteRoomType, getRoomTypeById, updateRoomType } from '@/services/channex/roomTypes';
import type { ChannexUpdateRoomTypePayload } from '@/types/channex';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { id } = await context.params;
  const data = await getRoomTypeById(id);
  return NextResponse.json({ data });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const force = searchParams.get('force') === 'true';
  const body = (await request.json()) as ChannexUpdateRoomTypePayload;
  const { id } = await context.params;
  const data = await updateRoomType(id, body, force);
  return NextResponse.json({ data });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const force = searchParams.get('force') === 'true';
  const { id } = await context.params;
  const data = await deleteRoomType(id, force);
  return NextResponse.json(data);
}
