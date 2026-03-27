import { channexRequest, toPaginationQuery, type PaginationOptions } from '@/lib/channex';
import type {
  ChannexAvailabilityRuleResource,
  ChannexCreateAvailabilityRulePayload,
  ChannexUpdateAvailabilityRulePayload,
} from '@/types/channex';

function toArray<T>(data: T | T[]) {
  return Array.isArray(data) ? data : [data];
}

export async function listAvailabilityRules(propertyId?: string, pagination?: PaginationOptions) {
  const payload = await channexRequest<ChannexAvailabilityRuleResource>('/channel_availability_rules', {}, {
    ...toPaginationQuery(pagination),
    'filter[property_id]': propertyId,
  });

  return toArray(payload.data);
}

export async function getAvailabilityRuleById(id: string) {
  const payload = await channexRequest<ChannexAvailabilityRuleResource>(`/channel_availability_rules/${id}`);
  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function createAvailabilityRule(body: ChannexCreateAvailabilityRulePayload) {
  const payload = await channexRequest<ChannexAvailabilityRuleResource>('/channel_availability_rules', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function updateAvailabilityRule(id: string, body: ChannexUpdateAvailabilityRulePayload) {
  const payload = await channexRequest<ChannexAvailabilityRuleResource>(`/channel_availability_rules/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function deleteAvailabilityRule(id: string) {
  return channexRequest(`/channel_availability_rules/${id}`, {
    method: 'DELETE',
  });
}
