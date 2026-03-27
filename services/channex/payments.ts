import { channexRequest } from '@/lib/channex';
import type {
  ChannexBookingPaymentActionPayload,
  ChannexPaymentProviderListPayload,
  ChannexPaymentProviderResource,
  ChannexPaymentResource,
  ChannexPaymentTransactionsQueryPayload,
  ChannexPaymentUpdateProviderPayload,
  ChannexPaymentConnectPayload,
  ChannexPaymentConnectResponse,
} from '@/types/channex';

function toArray<T>(data: T | T[]) {
  return Array.isArray(data) ? data : [data];
}

export async function connectPaymentApp(installationId: string, body: ChannexPaymentConnectPayload) {
  const payload = await channexRequest<ChannexPaymentConnectResponse>(`/applications/payment_app/${installationId}/connect`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function listPaymentProviders(installationId: string, body: ChannexPaymentProviderListPayload) {
  const payload = await channexRequest<ChannexPaymentProviderResource>(`/applications/payment_app/${installationId}/providers`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return toArray(payload.data);
}

export async function updatePaymentProvider(installationId: string, body: ChannexPaymentUpdateProviderPayload) {
  const payload = await channexRequest<ChannexPaymentProviderResource>(`/applications/payment_app/${installationId}/update_provider`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  return toArray(payload.data);
}

export async function setPaymentProviderAsDefault(installationId: string, providerId: string) {
  const payload = await channexRequest<ChannexPaymentProviderResource>(`/applications/payment_app/${installationId}/set_provider_as_default`, {
    method: 'POST',
    body: JSON.stringify({ id: providerId }),
  });

  return toArray(payload.data);
}

export async function listPaymentTransactions(installationId: string, body: ChannexPaymentTransactionsQueryPayload) {
  const payload = await channexRequest<ChannexPaymentResource>(`/applications/payment_app/${installationId}/transactions`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return toArray(payload.data);
}

export async function preAuthPayment(bookingId: string, body: ChannexBookingPaymentActionPayload) {
  const payload = await channexRequest<ChannexPaymentResource>(`/bookings/${bookingId}/pre_auth_payment`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function settlePayment(bookingId: string, body: ChannexBookingPaymentActionPayload) {
  const payload = await channexRequest<ChannexPaymentResource>(`/bookings/${bookingId}/settle_payment`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function voidPayment(bookingId: string, body: ChannexBookingPaymentActionPayload) {
  const payload = await channexRequest<ChannexPaymentResource>(`/bookings/${bookingId}/void_payment`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function chargePayment(bookingId: string, body: ChannexBookingPaymentActionPayload) {
  const payload = await channexRequest<ChannexPaymentResource>(`/bookings/${bookingId}/charge_payment`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export async function refundPayment(bookingId: string, body: ChannexBookingPaymentActionPayload) {
  const payload = await channexRequest<ChannexPaymentResource>(`/bookings/${bookingId}/refund_payment`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Array.isArray(payload.data) ? payload.data[0] : payload.data;
}

export function buildChannelIframeUrl(params: {
  server: string;
  oneTimeToken: string;
  redirectTo?: string;
  propertyId?: string;
  groupId?: string;
  channels?: string[];
  availableChannels?: string[];
  channelsFilter?: string[];
  language?: string;
  allowNotificationsEdit?: boolean;
  messagesShowBooking?: boolean;
  readOnlyAvailability?: boolean;
  hideMessagesAttachBtn?: boolean;
}) {
  const url = new URL('/auth/exchange', params.server);
  url.searchParams.set('oauth_session_key', params.oneTimeToken);
  url.searchParams.set('app_mode', 'headless');
  url.searchParams.set('redirect_to', params.redirectTo ?? '/channels');

  if (params.propertyId) url.searchParams.set('property_id', params.propertyId);
  if (params.groupId) url.searchParams.set('group_id', params.groupId);
  if (params.channels?.length) url.searchParams.set('channels', params.channels.join(','));
  if (params.availableChannels?.length) url.searchParams.set('available_channels', params.availableChannels.join(','));
  if (params.channelsFilter?.length) url.searchParams.set('channels_filter', params.channelsFilter.join(','));
  if (params.language) url.searchParams.set('lng', params.language);
  if (typeof params.allowNotificationsEdit === 'boolean') {
    url.searchParams.set('allow_notifications_edit', String(params.allowNotificationsEdit));
  }
  if (typeof params.messagesShowBooking === 'boolean') {
    url.searchParams.set('messages_show_booking', String(params.messagesShowBooking));
  }
  if (typeof params.readOnlyAvailability === 'boolean') {
    url.searchParams.set('read_only_availability', String(params.readOnlyAvailability));
  }
  if (typeof params.hideMessagesAttachBtn === 'boolean') {
    url.searchParams.set('hide_messages_attach_btn', String(params.hideMessagesAttachBtn));
  }

  return url.toString();
}

