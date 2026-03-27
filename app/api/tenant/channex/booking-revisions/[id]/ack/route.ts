import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { ackBookingRevision } from '@/services/channex/bookings';

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { id } = await context.params;
  const data = await ackBookingRevision(id);
  return NextResponse.json(data);
}
