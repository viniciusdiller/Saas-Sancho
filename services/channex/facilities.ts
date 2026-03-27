import { channexRequest, toPaginationQuery, type PaginationOptions } from '@/lib/channex';
import type { ChannexFacilityResource } from '@/types/channex';

function toArray<T>(data: T | T[]) {
  return Array.isArray(data) ? data : [data];
}

export async function listPropertyFacilities(pagination?: PaginationOptions) {
  const payload = await channexRequest<ChannexFacilityResource>('/property_facilities', {}, toPaginationQuery(pagination));
  return toArray(payload.data);
}

export async function listPropertyFacilityOptions() {
  const payload = await channexRequest<ChannexFacilityResource>('/property_facilities/options');
  return toArray(payload.data);
}

export async function listRoomFacilities(pagination?: PaginationOptions) {
  const payload = await channexRequest<ChannexFacilityResource>('/room_facilities', {}, toPaginationQuery(pagination));
  return toArray(payload.data);
}

export async function listRoomFacilityOptions() {
  const payload = await channexRequest<ChannexFacilityResource>('/room_facilities/options');
  return toArray(payload.data);
}
