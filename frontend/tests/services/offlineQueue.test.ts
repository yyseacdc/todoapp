import { describe, expect, it, beforeEach, vi } from 'vitest';
import { OfflineQueue } from '../../src/services/offlineQueue';

const createQueue = () => new OfflineQueue<{ value: string }>('test-queue');

beforeEach(() => {
  window.localStorage.clear();
});

describe('OfflineQueue', () => {
  it('enqueues payloads and persists to storage', async () => {
    const queue = createQueue();
    const entry = await queue.enqueue({ value: 'alpha' });

    expect(entry.payload.value).toBe('alpha');

    const items = await queue.peekAll();
    expect(items).toHaveLength(1);
    expect(items[0].payload.value).toBe('alpha');
  });

  it('removes entries after successful flush', async () => {
    const queue = createQueue();
    const entry = await queue.enqueue({ value: 'beta' });

    await queue.flushWith(async ({ clientId }) => {
      expect(clientId).toBe(entry.clientId);
    });

    expect(await queue.peekAll()).toHaveLength(0);
  });

  it('increments retry count on failure during flush', async () => {
    const queue = createQueue();
    const entry = await queue.enqueue({ value: 'gamma' });

    const handler = vi.fn<Parameters<typeof queue.flushWith>[0]>().mockRejectedValueOnce(
      new Error('network down')
    );

    await queue.flushWith(handler);

    const items = await queue.peekAll();
    expect(items[0].retryCount).toBe(1);
    expect(handler).toHaveBeenCalledTimes(1);

    // Verify subsequent success removes the item
    await queue.flushWith(async () => undefined);
    expect(await queue.peekAll()).toHaveLength(0);
  });
});
