import { channexRequest } from '@/lib/channex';
import type { ChannexCreateGroupPayload, ChannexGroup, ChannexUpdateGroupPayload } from '@/types/channex';

function toArray<T>(data: T | T[]) {
  return Array.isArray(data) ? data : [data];
}

export async function listGroups() {
  const payload = await channexRequest<ChannexGroup>('/groups');
  return toArray(payload.data);
}

export async function getGroupById(id: string) {
  const payload = await channexRequest<ChannexGroup>(`/groups/${id}`);
  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function createGroup(body: ChannexCreateGroupPayload) {
  const payload = await channexRequest<ChannexGroup>('/groups', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function updateGroup(id: string, body: ChannexUpdateGroupPayload) {
  const payload = await channexRequest<ChannexGroup>(`/groups/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function deleteGroup(id: string) {
  return channexRequest(`/groups/${id}`, { method: 'DELETE' });
}

export async function attachPropertyToGroup(groupId: string, propertyId: string) {
  return channexRequest(`/groups/${groupId}/properties/${propertyId}`, { method: 'POST' });
}

export async function removePropertyFromGroup(groupId: string, propertyId: string) {
  return channexRequest(`/groups/${groupId}/properties/${propertyId}`, { method: 'DELETE' });
}
