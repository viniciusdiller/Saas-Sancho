import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { listRoomTypeOptions } from '@/services/channex/roomTypes';

export async function GET() {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const data = await listRoomTypeOptions();
  return NextResponse.json({ data });
}
