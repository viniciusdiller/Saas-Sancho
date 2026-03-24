import { NextResponse } from 'next/server';
import { getAuthenticatedSession } from '@/lib/auth';
import { getReservations, getRooms } from '@/services/tenantService';

export async function GET() {
  const session = await getAuthenticatedSession();

  if (!session) {
    return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });
  }

  const [rooms, reservations] = await Promise.all([getRooms(session.tenantId), getReservations(session.tenantId)]);

  return NextResponse.json({ rooms, reservations });
}
