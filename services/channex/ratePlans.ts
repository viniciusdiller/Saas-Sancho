import { channexRequest, toPaginationQuery, type PaginationOptions } from '@/lib/channex';
import type {
  ChannexCreateRatePlanPayload,
  ChannexRatePlanOption,
  ChannexRatePlanResource,
  ChannexUpdateRatePlanPayload,
} from '@/types/channex';

function toArray<T>(data: T | T[]) {
  return Array.isArray(data) ? data : [data];
}

export async function listRatePlans(pagination?: PaginationOptions) {
  const payload = await channexRequest<ChannexRatePlanResource>('/rate_plans', {}, toPaginationQuery(pagination));
  return toArray(payload.data);
}

export async function listRatePlanOptions(propertyId: string) {
  const payload = await channexRequest<ChannexRatePlanOption>('/rate_plans/options', {}, {
    'filter[property_id]': propertyId,
  });

  return toArray(payload.data);
}

export async function getRatePlanById(id: string) {
  const payload = await channexRequest<ChannexRatePlanResource>(`/rate_plans/${id}`);
  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function createRatePlan(body: ChannexCreateRatePlanPayload) {
  const payload = await channexRequest<ChannexRatePlanResource>('/rate_plans', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function updateRatePlan(id: string, body: ChannexUpdateRatePlanPayload) {
  const payload = await channexRequest<ChannexRatePlanResource>(`/rate_plans/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function deleteRatePlan(id: string, force = false) {
  return channexRequest(`/rate_plans/${id}`, {
    method: 'DELETE',
  }, {
    force: force ? 'true' : undefined,
  });
}
