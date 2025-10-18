export interface QueueEntry<TPayload> {
  clientId: string;
  payload: TPayload;
  createdAt: string;
  retryCount: number;
  lastAttemptAt?: string;
}

export type QueueHandler<TPayload> = (entry: QueueEntry<TPayload>) => Promise<void>;

const STORAGE_KEY = 'todo-offline-queue';

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `offline-${Math.random().toString(36).slice(2, 10)}`;
}

export class OfflineQueue<TPayload> {
  private readonly storage: Storage | null;
  private memoryStore: QueueEntry<TPayload>[] = [];

  constructor(storageKey: string = STORAGE_KEY) {
    this.storageKey = storageKey;
    this.storage = this.resolveStorage();
    if (!this.storage) {
      this.memoryStore = [];
    }
  }

  public readonly storageKey: string;

  async enqueue(payload: TPayload): Promise<QueueEntry<TPayload>> {
    const entry: QueueEntry<TPayload> = {
      clientId: generateId(),
      payload,
      createdAt: new Date().toISOString(),
      retryCount: 0
    };
    const entries = await this.peekAll();
    entries.push(entry);
    await this.persist(entries);
    return entry;
  }

  async peekAll(): Promise<QueueEntry<TPayload>[]> {
    if (this.storage) {
      const raw = this.storage.getItem(this.storageKey);
      if (!raw) {
        return [];
      }
      try {
        const parsed = JSON.parse(raw) as QueueEntry<TPayload>[];
        return parsed;
      } catch (error) {
        console.warn('Failed to parse offline queue; resetting', error);
        this.storage.removeItem(this.storageKey);
        return [];
      }
    }
    return [...this.memoryStore];
  }

  async remove(clientId: string): Promise<void> {
    const entries = (await this.peekAll()).filter((entry) => entry.clientId !== clientId);
    await this.persist(entries);
  }

  async markAttempted(clientId: string): Promise<void> {
    const entries = await this.peekAll();
    const idx = entries.findIndex((entry) => entry.clientId === clientId);
    if (idx === -1) return;
    entries[idx] = {
      ...entries[idx],
      retryCount: entries[idx].retryCount + 1,
      lastAttemptAt: new Date().toISOString()
    };
    await this.persist(entries);
  }

  async flushWith(handler: QueueHandler<TPayload>): Promise<void> {
    const entries = await this.peekAll();
    for (const entry of entries) {
      try {
        await handler(entry);
        await this.remove(entry.clientId);
      } catch (error) {
        console.error('Failed to process queued entry', error);
        await this.markAttempted(entry.clientId);
      }
    }
  }

  async clear(): Promise<void> {
    await this.persist([]);
  }

  private async persist(entries: QueueEntry<TPayload>[]): Promise<void> {
    if (this.storage) {
      this.storage.setItem(this.storageKey, JSON.stringify(entries));
      return;
    }
    this.memoryStore = [...entries];
  }

  private resolveStorage(): Storage | null {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      const { localStorage } = window;
      const testKey = '__offline-queue-test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return localStorage;
    } catch (error) {
      console.warn('LocalStorage unavailable for offline queue', error);
      return null;
    }
  }
}

export const offlineQueue = new OfflineQueue<Record<string, unknown>>();
