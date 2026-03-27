import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { listMessageThreads } from '@/services/channex/messages';

export async function GET(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get('property_id') ?? undefined;
  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 10);

  const data = await listMessageThreads(propertyId, { page, limit });
  return NextResponse.json({ data });
}
