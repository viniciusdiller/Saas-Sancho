import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { deleteHotelPolicy, getHotelPolicyById, updateHotelPolicy } from '@/services/channex/hotelPolicies';
import type { ChannexHotelPolicyWritePayload } from '@/types/channex';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { id } = await context.params;
  const data = await getHotelPolicyById(id);
  return NextResponse.json({ data });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const body = (await request.json()) as ChannexHotelPolicyWritePayload;
  const { id } = await context.params;
  const data = await updateHotelPolicy(id, body);
  return NextResponse.json({ data });
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { id } = await context.params;
  const data = await deleteHotelPolicy(id);
  return NextResponse.json(data);
}
