import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { deleteRatePlan, getRatePlanById, updateRatePlan } from '@/services/channex/ratePlans';
import type { ChannexUpdateRatePlanPayload } from '@/types/channex';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { id } = await context.params;
  const data = await getRatePlanById(id);
  return NextResponse.json({ data });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const body = (await request.json()) as ChannexUpdateRatePlanPayload;
  const { id } = await context.params;
  const data = await updateRatePlan(id, body);
  return NextResponse.json({ data });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const force = searchParams.get('force') === 'true';
  const { id } = await context.params;
  const data = await deleteRatePlan(id, force);
  return NextResponse.json(data);
}
