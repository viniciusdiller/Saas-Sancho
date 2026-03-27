import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { createBookingCrs, listBookings } from '@/services/channex/bookings';
import type { ChannexBookingCrsPayload } from '@/types/channex';

export async function GET(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 10);

  const data = await listBookings(
    {
      propertyId: searchParams.get('property_id') ?? undefined,
      arrivalGte: searchParams.get('arrival_gte') ?? undefined,
      arrivalLte: searchParams.get('arrival_lte') ?? undefined,
      departureGte: searchParams.get('departure_gte') ?? undefined,
      departureLte: searchParams.get('departure_lte') ?? undefined,
      insertedAtGte: searchParams.get('inserted_at_gte') ?? undefined,
      insertedAtLte: searchParams.get('inserted_at_lte') ?? undefined,
    },
    { page, limit },
  );

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const body = (await request.json()) as ChannexBookingCrsPayload;
  const data = await createBookingCrs(body);
  return NextResponse.json({ data }, { status: 201 });
}
