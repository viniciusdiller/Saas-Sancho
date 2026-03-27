import { channexRequest } from '@/lib/channex';
import type {
  ChannexInvitePropertyUserPayload,
  ChannexPropertyUser,
  ChannexUpdatePropertyUserPayload,
} from '@/types/channex';

function toArray<T>(data: T | T[]) {
  return Array.isArray(data) ? data : [data];
}

export async function listPropertyUsers(propertyId: string) {
  const payload = await channexRequest<ChannexPropertyUser>('/property_users', {}, {
    'filter[property_id]': propertyId,
  });

  return toArray(payload.data);
}

export async function invitePropertyUser(body: ChannexInvitePropertyUserPayload) {
  const payload = await channexRequest<ChannexPropertyUser>('/property_users', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function getPropertyUserById(id: string) {
  const payload = await channexRequest<ChannexPropertyUser>(`/property_users/${id}`);
  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function updatePropertyUser(id: string, body: ChannexUpdatePropertyUserPayload) {
  const payload = await channexRequest<ChannexPropertyUser>(`/property_users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function deletePropertyUser(id: string) {
  return channexRequest(`/property_users/${id}`, { method: 'DELETE' });
}
