import { channexRequest, toPaginationQuery, type PaginationOptions } from '@/lib/channex';
import type {
  ChannexWebhookResource,
  ChannexWebhookTestResponse,
  ChannexWebhookWritePayload,
} from '@/types/channex';

function toArray<T>(data: T | T[]) {
  return Array.isArray(data) ? data : [data];
}

export async function listWebhooks(pagination?: PaginationOptions) {
  const payload = await channexRequest<ChannexWebhookResource>('/webhooks', {}, toPaginationQuery(pagination));
  return toArray(payload.data);
}

export async function getWebhookById(id: string) {
  const payload = await channexRequest<ChannexWebhookResource>(`/webhooks/${id}`);
  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function createWebhook(body: ChannexWebhookWritePayload) {
  const payload = await channexRequest<ChannexWebhookResource>('/webhooks', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function updateWebhook(id: string, body: ChannexWebhookWritePayload) {
  const payload = await channexRequest<ChannexWebhookResource>(`/webhooks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function deleteWebhook(id: string) {
  return channexRequest(`/webhooks/${id}`, { method: 'DELETE' });
}

export async function testWebhook(body: ChannexWebhookWritePayload) {
  const payload = await channexRequest<ChannexWebhookTestResponse>('/webhooks/test', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}
