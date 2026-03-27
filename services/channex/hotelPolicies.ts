import { channexRequest, toPaginationQuery, type PaginationOptions } from '@/lib/channex';
import type {
  ChannexHotelPolicyResource,
  ChannexHotelPolicyWritePayload,
} from '@/types/channex';

function toArray<T>(data: T | T[]) {
  return Array.isArray(data) ? data : [data];
}

export async function listHotelPolicies(propertyId?: string, pagination?: PaginationOptions) {
  const payload = await channexRequest<ChannexHotelPolicyResource>('/hotel_policies', {}, {
    ...toPaginationQuery(pagination),
    'filter[property_id]': propertyId,
  });

  return toArray(payload.data);
}

export async function getHotelPolicyById(id: string) {
  const payload = await channexRequest<ChannexHotelPolicyResource>(`/hotel_policies/${id}`);
  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function createHotelPolicy(body: ChannexHotelPolicyWritePayload) {
  const payload = await channexRequest<ChannexHotelPolicyResource>('/hotel_policies', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function updateHotelPolicy(id: string, body: ChannexHotelPolicyWritePayload) {
  const payload = await channexRequest<ChannexHotelPolicyResource>(`/hotel_policies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function deleteHotelPolicy(id: string) {
  return channexRequest(`/hotel_policies/${id}`, {
    method: 'DELETE',
  });
}
