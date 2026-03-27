import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { listPropertyFacilityOptions } from '@/services/channex/facilities';

export async function GET() {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const data = await listPropertyFacilityOptions();
  return NextResponse.json({ data });
}
