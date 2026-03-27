import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { getMessageThreadById } from '@/services/channex/messages';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { id } = await context.params;
  const data = await getMessageThreadById(id);
  return NextResponse.json({ data });
}
