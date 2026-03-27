import { channexRequest, toPaginationQuery, type PaginationOptions } from '@/lib/channex';
import type {
  ChannexDetailedScoreResource,
  ChannexPropertyScoreResource,
  ChannexReviewGuestReviewPayload,
  ChannexReviewReplyPayload,
  ChannexReviewResource,
} from '@/types/channex';

function toArray<T>(data: T | T[]) {
  return Array.isArray(data) ? data : [data];
}

export async function listReviews(propertyId?: string, pagination?: PaginationOptions) {
  const payload = await channexRequest<ChannexReviewResource>('/reviews', {}, {
    ...toPaginationQuery(pagination),
    'filter[property_id]': propertyId,
  });

  return toArray(payload.data);
}

export async function getReviewById(id: string) {
  const payload = await channexRequest<ChannexReviewResource>(`/reviews/${id}`);
  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function replyToReview(id: string, body: ChannexReviewReplyPayload) {
  const payload = await channexRequest<ChannexReviewResource>(`/reviews/${id}/reply`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function sendGuestReview(id: string, body: ChannexReviewGuestReviewPayload) {
  const payload = await channexRequest<ChannexReviewResource>(`/reviews/${id}/guest_review`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function getPropertyScore(propertyId: string) {
  const payload = await channexRequest<ChannexPropertyScoreResource>(`/scores/${propertyId}`);
  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function getDetailedPropertyScore(propertyId: string) {
  const payload = await channexRequest<ChannexDetailedScoreResource>(`/scores/${propertyId}/detailed`);
  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}
