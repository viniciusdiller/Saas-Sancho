import { channexRequest, toPaginationQuery, toPropertyFilterQuery, type PaginationOptions, type PropertyFilters } from '@/lib/channex';
import type {
  ChannexCreatePropertyPayload,
  ChannexProperty,
  ChannexPropertyOption,
  ChannexUpdatePropertyPayload,
} from '@/types/channex';

function toArray<T>(data: T | T[]) {
  return Array.isArray(data) ? data : [data];
}

export async function fetchChannexProperties(filters?: PropertyFilters, pagination?: PaginationOptions) {
  const payload = await channexRequest<ChannexProperty>('/properties', {}, {
    ...toPropertyFilterQuery(filters),
    ...toPaginationQuery(pagination),
  });

  return toArray(payload.data);
}

export async function fetchChannexPropertyOptions() {
  const payload = await channexRequest<ChannexPropertyOption>('/properties/options');
  return toArray(payload.data);
}

export async function fetchChannexPropertyById(propertyId: string) {
  const payload = await channexRequest<ChannexProperty>(`/properties/${propertyId}`);
  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function createChannexProperty(body: ChannexCreatePropertyPayload) {
  const payload = await channexRequest<ChannexProperty>('/properties', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function updateChannexProperty(propertyId: string, body: ChannexUpdatePropertyPayload) {
  const payload = await channexRequest<ChannexProperty>(`/properties/${propertyId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function removeChannexProperty(propertyId: string, force = false) {
  return channexRequest(`/properties/${propertyId}`, {
    method: 'DELETE',
  }, {
    force: force ? 'true' : undefined,
  });
}
