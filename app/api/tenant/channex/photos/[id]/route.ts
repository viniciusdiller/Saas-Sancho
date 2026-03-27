import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { deletePhoto, getPhotoById, updatePhoto } from '@/services/channex/photos';
import type { ChannexPhotoWritePayload } from '@/types/channex';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { id } = await context.params;
  const data = await getPhotoById(id);
  return NextResponse.json({ data });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const body = (await request.json()) as ChannexPhotoWritePayload;
  const { id } = await context.params;
  const data = await updatePhoto(id, body);
  return NextResponse.json({ data });
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { id } = await context.params;
  const data = await deletePhoto(id);
  return NextResponse.json(data);
}
