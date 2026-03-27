import { channexRequest, toPaginationQuery, type PaginationOptions } from '@/lib/channex';
import type {
  ChannexBookingCrsPayload,
  ChannexBookingNoShowPayload,
  ChannexBookingResource,
  ChannexBookingRevisionResource,
  ChannexMetaMessageResponse,
} from '@/types/channex';

function toArray<T>(data: T | T[]) {
  return Array.isArray(data) ? data : [data];
}

type BookingFilterInput = {
  propertyId?: string;
  arrivalGte?: string;
  arrivalLte?: string;
  departureGte?: string;
  departureLte?: string;
  insertedAtGte?: string;
  insertedAtLte?: string;
};

function toBookingFilterQuery(filters?: BookingFilterInput) {
  return {
    'filter[property_id]': filters?.propertyId,
    'filter[arrival_date][gte]': filters?.arrivalGte,
    'filter[arrival_date][lte]': filters?.arrivalLte,
    'filter[departure_date][gte]': filters?.departureGte,
    'filter[departure_date][lte]': filters?.departureLte,
    'filter[inserted_at][gte]': filters?.insertedAtGte,
    'filter[inserted_at][lte]': filters?.insertedAtLte,
  };
}

export async function listBookings(filters?: BookingFilterInput, pagination?: PaginationOptions) {
  const payload = await channexRequest<ChannexBookingResource>('/bookings', {}, {
    ...toBookingFilterQuery(filters),
    ...toPaginationQuery(pagination),
  });

  return toArray(payload.data);
}

export async function getBookingById(id: string) {
  const payload = await channexRequest<ChannexBookingResource>(`/bookings/${id}`);
  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function createBookingCrs(body: ChannexBookingCrsPayload) {
  const payload = await channexRequest<ChannexBookingResource>('/bookings', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function updateBookingCrs(id: string, body: ChannexBookingCrsPayload) {
  const payload = await channexRequest<ChannexBookingResource>(`/bookings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function listBookingRevisions(pagination?: PaginationOptions) {
  const payload = await channexRequest<ChannexBookingRevisionResource>('/booking_revisions', {}, toPaginationQuery(pagination));
  return toArray(payload.data);
}

export async function getBookingRevisionById(id: string) {
  const payload = await channexRequest<ChannexBookingRevisionResource>(`/booking_revisions/${id}`);
  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function feedBookingRevisions(propertyId?: string, oldestFirst = false, pagination?: PaginationOptions) {
  const payload = await channexRequest<ChannexBookingRevisionResource>('/booking_revisions/feed', {}, {
    ...toPaginationQuery(pagination),
    'filter[property_id]': propertyId,
    'order[inserted_at]': oldestFirst ? 'asc' : undefined,
  });

  return toArray(payload.data);
}

export async function ackBookingRevision(id: string) {
  return channexRequest<never>(`/booking_revisions/${id}/ack`, {
    method: 'POST',
  });
}

export async function reportNoShow(bookingId: string, body: ChannexBookingNoShowPayload) {
  return channexRequest<ChannexMetaMessageResponse>(`/bookings/${bookingId}/no_show`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function reportInvalidCard(bookingId: string) {
  return channexRequest<ChannexMetaMessageResponse>(`/bookings/${bookingId}/invalid_card`, {
    method: 'POST',
  });
}

export async function cancelDueInvalidCard(bookingId: string) {
  return channexRequest<ChannexMetaMessageResponse>(`/bookings/${bookingId}/cancel_due_invalid_card`, {
    method: 'POST',
  });
}
