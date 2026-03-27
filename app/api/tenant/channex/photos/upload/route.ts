import { NextResponse } from 'next/server';

import { getAuthenticatedSession } from '@/lib/auth';
import { uploadPhotoFile } from '@/services/channex/photos';

export async function POST(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  const formData = await request.formData();
  const photo = formData.get('photo');

  if (!(photo instanceof Blob)) {
    return NextResponse.json({ message: 'Campo photo é obrigatório.' }, { status: 400 });
  }

  const fileName = photo instanceof File ? photo.name : 'photo.jpg';
  const data = await uploadPhotoFile(photo, fileName);
  return NextResponse.json({ data }, { status: 201 });
}
