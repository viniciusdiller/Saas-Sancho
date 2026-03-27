import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { listRatePlanOptions } from '@/services/channex/ratePlans';

export async function GET(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get('property_id');

  if (!propertyId) {
    return NextResponse.json({ message: 'property_id é obrigatório para /rate-plans/options.' }, { status: 400 });
  }

  const data = await listRatePlanOptions(propertyId);
  return NextResponse.json({ data });
}
