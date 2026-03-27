import { channexRequest, toPaginationQuery, type PaginationOptions } from '@/lib/channex';
import type {
  ChannexChannelMappingWritePayload,
  ChannexChannelResource,
  ChannexChannelSettingsWritePayload,
  ChannexChannelWritePayload,
} from '@/types/channex';

function toArray<T>(data: T | T[]) {
  return Array.isArray(data) ? data : [data];
}

export async function listChannels(propertyId?: string, pagination?: PaginationOptions) {
  const payload = await channexRequest<ChannexChannelResource>('/channels', {}, {
    ...toPaginationQuery(pagination),
    'filter[property_id]': propertyId,
  });

  return toArray(payload.data);
}

export async function getChannelById(id: string) {
  const payload = await channexRequest<ChannexChannelResource>(`/channels/${id}`);
  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function createChannel(body: ChannexChannelWritePayload) {
  const payload = await channexRequest<ChannexChannelResource>('/channels', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function updateChannel(id: string, body: ChannexChannelWritePayload) {
  const payload = await channexRequest<ChannexChannelResource>(`/channels/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function deleteChannel(id: string) {
  return channexRequest(`/channels/${id}`, {
    method: 'DELETE',
  });
}

export async function getChannelSettings(id: string) {
  const payload = await channexRequest<ChannexChannelResource>(`/channels/${id}/settings`);
  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function updateChannelSettings(id: string, body: ChannexChannelSettingsWritePayload) {
  const payload = await channexRequest<ChannexChannelResource>(`/channels/${id}/settings`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function getChannelMappings(id: string) {
  const payload = await channexRequest<ChannexChannelResource>(`/channels/${id}/mappings`);
  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function updateChannelMappings(id: string, body: ChannexChannelMappingWritePayload) {
  const payload = await channexRequest<ChannexChannelResource>(`/channels/${id}/mappings`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}
