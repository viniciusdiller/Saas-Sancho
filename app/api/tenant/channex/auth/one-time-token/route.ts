import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { createOneTimeToken } from '@/services/channex/iframe';
import { buildChannelIframeUrl } from '@/services/channex/payments';
import type { ChannexOneTimeTokenPayload } from '@/types/channex';

export async function POST(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const body = (await request.json()) as ChannexOneTimeTokenPayload;
  const data = await createOneTimeToken(body);

  const server = process.env.CHANNEX_IFRAME_BASE_URL ?? 'https://staging.channex.io';
  const iframeUrl = buildChannelIframeUrl({
    server,
    oneTimeToken: data.token,
    propertyId: body.one_time_token.property_id,
    groupId: body.one_time_token.group_id,
  });

  return NextResponse.json({
    data,
    meta: {
      iframe_url: iframeUrl,
    },
  });
}
