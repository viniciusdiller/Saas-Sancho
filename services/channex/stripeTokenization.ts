import { channexRequest } from '@/lib/channex';
import type { ChannexStripeTokenResponse } from '@/types/channex';

export async function createStripeCreditCardToken(bookingId: string) {
  const payload = await channexRequest<ChannexStripeTokenResponse>(`/bookings/${bookingId}/stripe_token`, {
    method: 'POST',
  });

  const data = Array.isArray(payload.data) ? payload.data[0] : payload.data;
  return data;
}

export async function createStripePaymentMethodToken(bookingId: string) {
  const payload = await channexRequest<ChannexStripeTokenResponse>(`/bookings/${bookingId}/stripe_payment_method`, {
    method: 'POST',
  });

  const data = Array.isArray(payload.data) ? payload.data[0] : payload.data;
  return data;
}
