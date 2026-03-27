import type { ChannexError, ChannexResponse } from '@/types/channex';

const DEFAULT_BASE_URL = 'https://staging.channex.io/api/v1';
const ONE_MINUTE_MS = 60_000;
const DEFAULT_RETRY_ATTEMPTS = 3;
const DEFAULT_BACKOFF_BASE_MS = 1_000;

type QueryInput = Record<string, string | number | undefined | null>;

type RateScope = 'availability' | 'restrictions_or_rates';

type MinuteBucket = {
  scope: RateScope;
  propertyId: string;
  count: number;
  windowStart: number;
};

const localRateBuckets = new Map<string, MinuteBucket>();
const propertyPauseUntil = new Map<string, number>();

function createQuery(params?: QueryInput) {
  if (!params) return '';

  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.append(key, String(value));
    }
  });

  const query = search.toString();
  return query ? `?${query}` : '';
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRetryAttempts() {
  const value = Number(process.env.CHANNEX_RETRY_ATTEMPTS ?? DEFAULT_RETRY_ATTEMPTS);
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_RETRY_ATTEMPTS;
}

function getBackoffBaseMs() {
  const value = Number(process.env.CHANNEX_BACKOFF_BASE_MS ?? DEFAULT_BACKOFF_BASE_MS);
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_BACKOFF_BASE_MS;
}

function getPauseTimeMs() {
  const value = Number(process.env.CHANNEX_RATE_LIMIT_PAUSE_MS ?? ONE_MINUTE_MS);
  return Number.isFinite(value) && value > 0 ? value : ONE_MINUTE_MS;
}

function detectAriScope(path: string): RateScope | null {
  if (path.includes('/availability')) {
    return 'availability';
  }

  if (path.includes('/restrictions') || path.includes('/rates')) {
    return 'restrictions_or_rates';
  }

  return null;
}

function checkPause(propertyId?: string) {
  if (!propertyId) return;

  const pausedUntil = propertyPauseUntil.get(propertyId);
  if (!pausedUntil) return;

  if (Date.now() < pausedUntil) {
    const seconds = Math.ceil((pausedUntil - Date.now()) / 1000);
    throw new Error(`Channex pausado para esta propriedade por ${seconds}s após rate limit.`);
  }

  propertyPauseUntil.delete(propertyId);
}

function trackLocalRateLimit(path: string, propertyId?: string) {
  const scope = detectAriScope(path);
  if (!scope || !propertyId) return;

  const key = `${propertyId}:${scope}`;
  const now = Date.now();
  const current = localRateBuckets.get(key);

  if (!current || now - current.windowStart >= ONE_MINUTE_MS) {
    localRateBuckets.set(key, {
      scope,
      propertyId,
      count: 1,
      windowStart: now,
    });
    return;
  }

  if (current.count >= 10) {
    throw new Error(
      `Limite local de ARI excedido para ${propertyId} (${scope}). Aguarde ${Math.ceil((ONE_MINUTE_MS - (now - current.windowStart)) / 1000)}s.`,
    );
  }

  current.count += 1;
  localRateBuckets.set(key, current);
}

export function getChannexBaseUrl() {
  return process.env.CHANNEX_BASE_URL ?? DEFAULT_BASE_URL;
}

export function isChannexConfigured() {
  return Boolean(process.env.CHANNEX_API_KEY);
}

function parseError(payload: ChannexResponse<unknown> | null, statusText: string) {
  const err = payload?.errors as ChannexError | undefined;
  if (!err) {
    return statusText;
  }

  if (err.title) {
    return err.title;
  }

  return statusText;
}

export type ChannexRequestOptions = RequestInit & {
  propertyId?: string;
  skipLocalRateLimit?: boolean;
};

export async function channexRequest<T>(
  path: string,
  options: ChannexRequestOptions = {},
  params?: QueryInput,
): Promise<ChannexResponse<T>> {
  if (!isChannexConfigured()) {
    throw new Error('CHANNEX_API_KEY não configurada.');
  }

  const url = `${getChannexBaseUrl()}${path}${createQuery(params)}`;
  const retryAttempts = getRetryAttempts();
  const backoffBaseMs = getBackoffBaseMs();
  const pauseMs = getPauseTimeMs();

  for (let attempt = 1; attempt <= retryAttempts; attempt += 1) {
    checkPause(options.propertyId);

    if (!options.skipLocalRateLimit) {
      trackLocalRateLimit(path, options.propertyId);
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'user-api-key': process.env.CHANNEX_API_KEY as string,
        ...(options.headers ?? {}),
      },
      cache: 'no-store',
    });

    const payload = (await response.json().catch(() => null)) as ChannexResponse<T> | null;

    if (response.ok) {
      if (!payload) {
        throw new Error('Resposta inválida da API Channex.');
      }

      return payload;
    }

    if (response.status === 429 && options.propertyId) {
      propertyPauseUntil.set(options.propertyId, Date.now() + pauseMs);

      if (attempt < retryAttempts) {
        const backoff = backoffBaseMs * 2 ** (attempt - 1);
        await sleep(backoff);
        continue;
      }
    }

    const message = parseError(payload, response.statusText);
    throw new Error(`Channex ${response.status}: ${message}`);
  }

  throw new Error('Falha inesperada ao chamar a API Channex.');
}

export type PaginationOptions = {
  page?: number;
  limit?: number;
};

export type BookingFilters = {
  propertyId?: string;
  dateGte?: string;
};

export type PropertyFilters = {
  id?: string;
  title?: string;
  isActive?: boolean;
};

export function toPaginationQuery(pagination?: PaginationOptions) {
  return {
    'pagination[page]': pagination?.page,
    'pagination[limit]': pagination?.limit,
  };
}

export function toBookingFilterQuery(filters?: BookingFilters) {
  return {
    'filter[property_id]': filters?.propertyId,
    'filter[date][gte]': filters?.dateGte,
  };
}

export function toPropertyFilterQuery(filters?: PropertyFilters) {
  return {
    'filter[id]': filters?.id,
    'filter[title]': filters?.title,
    'filter[is_active]': typeof filters?.isActive === 'boolean' ? String(filters.isActive) : undefined,
  };
}
