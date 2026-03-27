import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { createAttachment } from '@/services/channex/messages';
import type { ChannexAttachmentCreatePayload } from '@/types/channex';

export async function POST(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const body = (await request.json()) as ChannexAttachmentCreatePayload;
  const data = await createAttachment(body);
  return NextResponse.json({ data });
}
