import { channexRequest } from '@/lib/channex';

type QueueTask<T> = {
  run: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
};

const queueByProperty = new Map<string, QueueTask<unknown>[]>();
const runningByProperty = new Set<string>();

const DEFAULT_FLUSH_INTERVAL_MS = 6_000;

function getFlushIntervalMs() {
  const value = Number(process.env.CHANNEX_ARI_FLUSH_INTERVAL_MS ?? DEFAULT_FLUSH_INTERVAL_MS);
  return Number.isFinite(value) && value >= 1000 ? value : DEFAULT_FLUSH_INTERVAL_MS;
}

async function flushPropertyQueue(propertyId: string) {
  if (runningByProperty.has(propertyId)) {
    return;
  }

  runningByProperty.add(propertyId);

  try {
    while (true) {
      const queue = queueByProperty.get(propertyId);
      const task = queue?.shift();

      if (!task) {
        break;
      }

      try {
        const result = await task.run();
        task.resolve(result);
      } catch (error) {
        task.reject(error);
      }

      await new Promise((resolve) => setTimeout(resolve, getFlushIntervalMs()));
    }
  } finally {
    runningByProperty.delete(propertyId);
  }
}

export function enqueueAriRequest<T>(propertyId: string, run: () => Promise<T>) {
  return new Promise<T>((resolve, reject) => {
    const queue = queueByProperty.get(propertyId) ?? [];
    queue.push({ run, resolve, reject } as QueueTask<unknown>);
    queueByProperty.set(propertyId, queue);

    void flushPropertyQueue(propertyId);
  });
}

export function queueAvailabilityUpdate<T>(propertyId: string, path: string, body: unknown) {
  return enqueueAriRequest(propertyId, () =>
    channexRequest<T>(
      path,
      {
        method: 'POST',
        body: JSON.stringify(body),
        propertyId,
      },
    ),
  );
}


export function queueAriPost<T>(propertyId: string, path: '/availability' | '/restrictions' | '/rates', body: unknown) {
  return enqueueAriRequest(propertyId, () =>
    channexRequest<T>(
      path,
      {
        method: 'POST',
        body: JSON.stringify(body),
        propertyId,
      },
    ),
  );
}
