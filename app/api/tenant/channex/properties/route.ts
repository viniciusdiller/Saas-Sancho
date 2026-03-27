import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import {
  createChannexProperty,
  fetchChannexProperties,
  fetchChannexPropertyOptions,
} from '@/services/channex/properties';
import type { ChannexCreatePropertyPayload } from '@/types/channex';

export async function GET(request: Request) {
  const session = await getAuthenticatedSession();

  if (!session) {
    return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode');

  if (mode === 'options') {
    const options = await fetchChannexPropertyOptions();
    return NextResponse.json({ data: options });
  }

  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 10);
  const id = searchParams.get('id') ?? undefined;
  const title = searchParams.get('title') ?? undefined;
  const isActiveParam = searchParams.get('is_active');

  const data = await fetchChannexProperties(
    {
      id,
      title,
      isActive: isActiveParam === null ? undefined : isActiveParam === 'true',
    },
    {
      page,
      limit,
    },
  );

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const session = await getAuthenticatedSession();

  if (!session) {
    return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });
  }

  const body = (await request.json()) as ChannexCreatePropertyPayload;
  const data = await createChannexProperty(body);
  return NextResponse.json({ data }, { status: 201 });
}
