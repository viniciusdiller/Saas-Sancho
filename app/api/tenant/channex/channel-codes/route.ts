import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { CHANNEX_CHANNEL_CODES } from '@/mocks/channex/channelCodes';

export async function GET() {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  return NextResponse.json({
    data: CHANNEX_CHANNEL_CODES,
    meta: {
      total: CHANNEX_CHANNEL_CODES.length,
      source: 'mock',
    },
  });
}
