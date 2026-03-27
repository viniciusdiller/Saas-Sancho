import { channexRequest } from '@/lib/channex';
import type { ChannexOneTimeTokenPayload, ChannexOneTimeTokenResponse } from '@/types/channex';

export async function createOneTimeToken(body: ChannexOneTimeTokenPayload) {
  const payload = await channexRequest<ChannexOneTimeTokenResponse>('/auth/one_time_token', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}
