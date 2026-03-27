import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import {
  deleteAvailabilityRule,
  getAvailabilityRuleById,
  updateAvailabilityRule,
} from '@/services/channex/channelAvailabilityRules';
import type { ChannexUpdateAvailabilityRulePayload } from '@/types/channex';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { id } = await context.params;
  const data = await getAvailabilityRuleById(id);
  return NextResponse.json({ data });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const body = (await request.json()) as ChannexUpdateAvailabilityRulePayload;
  const { id } = await context.params;
  const data = await updateAvailabilityRule(id, body);
  return NextResponse.json({ data });
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { id } = await context.params;
  const data = await deleteAvailabilityRule(id);
  return NextResponse.json(data);
}
