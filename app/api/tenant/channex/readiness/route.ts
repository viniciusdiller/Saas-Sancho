import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { getReadinessSummary } from '@/services/channex/readiness';

export async function GET() {
  const session = await getAuthenticatedSession();

  if (!session) {
    return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });
  }

  return NextResponse.json(getReadinessSummary());
}
