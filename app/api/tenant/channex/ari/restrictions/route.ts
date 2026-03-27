import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { getRatePlanRestrictions, updateRateRestrictions } from '@/services/channex/ari';
import type { ChannexAriUpdatePayload, ChannexRestrictionName } from '@/types/channex';

export async function GET(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get('property_id');
  const restrictions = searchParams.get('restrictions');

  if (!propertyId || !restrictions) {
    return NextResponse.json({ message: 'property_id e restrictions são obrigatórios.' }, { status: 400 });
  }

  const data = await getRatePlanRestrictions({
    propertyId,
    date: searchParams.get('date') ?? undefined,
    dateFrom: searchParams.get('date_from') ?? undefined,
    dateTo: searchParams.get('date_to') ?? undefined,
    restrictions: restrictions.split(',').map((r) => r.trim()) as ChannexRestrictionName[],
  });

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const body = (await request.json()) as ChannexAriUpdatePayload;
  const propertyId = body.values?.[0]?.property_id;

  if (!propertyId) {
    return NextResponse.json({ message: 'property_id é obrigatório no primeiro item de values.' }, { status: 400 });
  }

  const data = await updateRateRestrictions(propertyId, body);
  return NextResponse.json(data);
}
