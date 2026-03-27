import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { createPhoto, listPhotos } from '@/services/channex/photos';
import type { ChannexPhotoWritePayload } from '@/types/channex';

export async function GET(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get('property_id') ?? undefined;
  const roomTypeId = searchParams.get('room_type_id') ?? undefined;
  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 10);

  const data = await listPhotos(propertyId, roomTypeId, { page, limit });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const body = (await request.json()) as ChannexPhotoWritePayload;
  const data = await createPhoto(body);
  return NextResponse.json({ data }, { status: 201 });
}
