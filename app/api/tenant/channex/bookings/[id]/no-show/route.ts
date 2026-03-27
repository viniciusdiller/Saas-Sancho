import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { reportNoShow } from '@/services/channex/bookings';
import type { ChannexBookingNoShowPayload } from '@/types/channex';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const body = (await request.json()) as ChannexBookingNoShowPayload;
  const { id } = await context.params;
  const data = await reportNoShow(id, body);
  return NextResponse.json(data);
}
