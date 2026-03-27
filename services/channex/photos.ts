import { channexRequest, getChannexBaseUrl, isChannexConfigured, toPaginationQuery, type PaginationOptions } from '@/lib/channex';
import type {
  ChannexPhotoResource,
  ChannexPhotoUploadResponse,
  ChannexPhotoWritePayload,
} from '@/types/channex';

function toArray<T>(data: T | T[]) {
  return Array.isArray(data) ? data : [data];
}

export async function listPhotos(propertyId?: string, roomTypeId?: string, pagination?: PaginationOptions) {
  const payload = await channexRequest<ChannexPhotoResource>('/photos', {}, {
    ...toPaginationQuery(pagination),
    'filter[property_id]': propertyId,
    'filter[room_type_id]': roomTypeId,
  });

  return toArray(payload.data);
}

export async function getPhotoById(id: string) {
  const payload = await channexRequest<ChannexPhotoResource>(`/photos/${id}`);
  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function createPhoto(body: ChannexPhotoWritePayload) {
  const payload = await channexRequest<ChannexPhotoResource>('/photos', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function updatePhoto(id: string, body: ChannexPhotoWritePayload) {
  const payload = await channexRequest<ChannexPhotoResource>(`/photos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function deletePhoto(id: string) {
  return channexRequest(`/photos/${id}`, {
    method: 'DELETE',
  });
}

export async function uploadPhotoFile(photo: Blob, filename = 'photo.jpg') {
  if (!isChannexConfigured()) {
    throw new Error('CHANNEX_API_KEY não configurada.');
  }

  const formData = new FormData();
  formData.append('photo', photo, filename);

  const response = await fetch(`${getChannexBaseUrl()}/photos/upload`, {
    method: 'POST',
    headers: {
      'user-api-key': process.env.CHANNEX_API_KEY as string,
    },
    body: formData,
    cache: 'no-store',
  });

  const payload = (await response.json().catch(() => null)) as ChannexPhotoUploadResponse | null;

  if (!response.ok || !payload?.url) {
    throw new Error(`Channex ${response.status}: falha no upload da foto.`);
  }

  return payload;
}
