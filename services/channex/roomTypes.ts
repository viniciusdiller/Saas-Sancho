import { channexRequest, toPaginationQuery, type PaginationOptions } from '@/lib/channex';
import type {
  ChannexCreateRoomTypePayload,
  ChannexRoomTypeOption,
  ChannexRoomTypeResource,
  ChannexUpdateRoomTypePayload,
} from '@/types/channex';

function toArray<T>(data: T | T[]) {
  return Array.isArray(data) ? data : [data];
}

export async function listRoomTypes(propertyId?: string, pagination?: PaginationOptions) {
  const payload = await channexRequest<ChannexRoomTypeResource>('/room_types', {}, {
    ...toPaginationQuery(pagination),
    'filter[property_id]': propertyId,
  });

  return toArray(payload.data);
}

export async function listRoomTypeOptions() {
  const payload = await channexRequest<ChannexRoomTypeOption>('/room_types/options');
  return toArray(payload.data);
}

export async function getRoomTypeById(id: string) {
  const payload = await channexRequest<ChannexRoomTypeResource>(`/room_types/${id}`);
  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function createRoomType(body: ChannexCreateRoomTypePayload) {
  const payload = await channexRequest<ChannexRoomTypeResource>('/room_types', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function updateRoomType(id: string, body: ChannexUpdateRoomTypePayload, force = false) {
  const payload = await channexRequest<ChannexRoomTypeResource>(`/room_types/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  }, {
    force: force ? 'true' : undefined,
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function deleteRoomType(id: string, force = false) {
  return channexRequest(`/room_types/${id}`, {
    method: 'DELETE',
  }, {
    force: force ? 'true' : undefined,
  });
}
