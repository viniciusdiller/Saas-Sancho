import { channexRequest, toPaginationQuery, type PaginationOptions } from '@/lib/channex';
import type {
  ChannexAttachmentCreatePayload,
  ChannexAttachmentResource,
  ChannexBookingMessageWritePayload,
  ChannexMessageResource,
  ChannexMessageThreadResource,
  ChannexThreadMessageWritePayload,
} from '@/types/channex';

function toArray<T>(data: T | T[]) {
  return Array.isArray(data) ? data : [data];
}

export async function listBookingMessages(bookingId: string, pagination?: PaginationOptions) {
  const payload = await channexRequest<ChannexMessageResource>(`/bookings/${bookingId}/messages`, {}, toPaginationQuery(pagination));
  return toArray(payload.data);
}

export async function sendBookingMessage(bookingId: string, body: ChannexBookingMessageWritePayload) {
  const payload = await channexRequest<ChannexMessageResource>(`/bookings/${bookingId}/messages`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function createAttachment(body: ChannexAttachmentCreatePayload) {
  const payload = await channexRequest<ChannexAttachmentResource>('/attachments', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function listMessageThreads(propertyId?: string, pagination?: PaginationOptions) {
  const payload = await channexRequest<ChannexMessageThreadResource>('/message_threads', {}, {
    ...toPaginationQuery(pagination),
    'filter[property_id]': propertyId,
  });

  return toArray(payload.data);
}

export async function getMessageThreadById(id: string) {
  const payload = await channexRequest<ChannexMessageThreadResource>(`/message_threads/${id}`);
  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function listThreadMessages(id: string, pagination?: PaginationOptions) {
  const payload = await channexRequest<ChannexMessageResource>(`/message_threads/${id}/messages`, {}, toPaginationQuery(pagination));
  return toArray(payload.data);
}

export async function sendThreadMessage(id: string, body: ChannexThreadMessageWritePayload) {
  const payload = await channexRequest<ChannexMessageResource>(`/message_threads/${id}/messages`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function closeThread(id: string) {
  const payload = await channexRequest<ChannexMessageThreadResource>(`/message_threads/${id}/close`, {
    method: 'POST',
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function markThreadNoReplyNeeded(id: string) {
  const payload = await channexRequest<ChannexMessageThreadResource>(`/message_threads/${id}/no_reply_needed`, {
    method: 'POST',
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}
