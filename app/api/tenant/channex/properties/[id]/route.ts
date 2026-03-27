import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import {
  fetchChannexPropertyById,
  removeChannexProperty,
  updateChannexProperty,
} from '@/services/channex/properties';
import type { ChannexUpdatePropertyPayload } from '@/types/channex';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();

  if (!session) {
    return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });
  }

  const { id } = await context.params;
  const data = await fetchChannexPropertyById(id);
  return NextResponse.json({ data });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();

  if (!session) {
    return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as ChannexUpdatePropertyPayload;
  const data = await updateChannexProperty(id, body);
  return NextResponse.json({ data });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();

  if (!session) {
    return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const force = searchParams.get('force') === 'true';
  const { id } = await context.params;
  const data = await removeChannexProperty(id, force);
  return NextResponse.json(data);
}
