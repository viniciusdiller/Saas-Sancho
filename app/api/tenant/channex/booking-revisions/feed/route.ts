import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { feedBookingRevisions } from '@/services/channex/bookings';

export async function GET(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 10);
  const propertyId = searchParams.get('property_id') ?? undefined;
  const oldestFirst = searchParams.get('oldest_first') === 'true';

  const data = await feedBookingRevisions(propertyId, oldestFirst, { page, limit });
  return NextResponse.json({ data });
}
