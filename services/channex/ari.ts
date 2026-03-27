import { channexRequest } from '@/lib/channex';
import { queueAriPost } from '@/services/channex/queue';
import type {
  ChannexAriUpdatePayload,
  ChannexAvailabilityObject,
  ChannexRestrictionName,
  ChannexRestrictionObject,
  ChannexTaskResource,
} from '@/types/channex';

type DateFilterInput = {
  propertyId: string;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
};

function toDateFilterQuery(input: DateFilterInput) {
  return {
    'filter[property_id]': input.propertyId,
    'filter[date]': input.date,
    'filter[date][gte]': input.dateFrom,
    'filter[date][lte]': input.dateTo,
  };
}

export async function getRatePlanRestrictions(input: DateFilterInput & { restrictions: ChannexRestrictionName[] }) {
  const payload = await channexRequest<ChannexRestrictionObject>(
    '/restrictions',
    {
      propertyId: input.propertyId,
      skipLocalRateLimit: true,
    },
    {
      ...toDateFilterQuery(input),
      'filter[restrictions]': input.restrictions.join(','),
    },
  );

  return payload.data;
}

export async function getRatePlanRates(input: DateFilterInput) {
  const payload = await channexRequest<ChannexRestrictionObject>(
    '/rates',
    {
      propertyId: input.propertyId,
      skipLocalRateLimit: true,
    },
    toDateFilterQuery(input),
  );

  return payload.data;
}

export async function getRoomTypeAvailability(input: DateFilterInput) {
  const payload = await channexRequest<ChannexAvailabilityObject>(
    '/availability',
    {
      propertyId: input.propertyId,
      skipLocalRateLimit: true,
    },
    toDateFilterQuery(input),
  );

  return payload.data;
}

export async function updateRateRestrictions(propertyId: string, body: ChannexAriUpdatePayload) {
  const payload = await queueAriPost<ChannexTaskResource[]>(propertyId, '/restrictions', body);
  return payload;
}

export async function updateRates(propertyId: string, body: ChannexAriUpdatePayload) {
  const payload = await queueAriPost<ChannexTaskResource[]>(propertyId, '/rates', body);
  return payload;
}

export async function updateAvailability(propertyId: string, body: ChannexAriUpdatePayload) {
  const payload = await queueAriPost<ChannexTaskResource[]>(propertyId, '/availability', body);
  return payload;
}
