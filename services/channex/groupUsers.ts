import { channexRequest } from '@/lib/channex';
import type {
  ChannexGroupUser,
  ChannexInviteGroupUserPayload,
  ChannexUpdateGroupUserPayload,
} from '@/types/channex';

function toArray<T>(data: T | T[]) {
  return Array.isArray(data) ? data : [data];
}

export async function listGroupUsers(groupId: string) {
  const payload = await channexRequest<ChannexGroupUser>('/group_users', {}, {
    'filter[group_id]': groupId,
  });

  return toArray(payload.data);
}

export async function inviteGroupUser(body: ChannexInviteGroupUserPayload) {
  const payload = await channexRequest<ChannexGroupUser>('/group_users', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function getGroupUserById(id: string) {
  const payload = await channexRequest<ChannexGroupUser>(`/group_users/${id}`);
  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function updateGroupUser(id: string, body: ChannexUpdateGroupUserPayload) {
  const payload = await channexRequest<ChannexGroupUser>(`/group_users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function deleteGroupUser(id: string) {
  return channexRequest(`/group_users/${id}`, { method: 'DELETE' });
}
