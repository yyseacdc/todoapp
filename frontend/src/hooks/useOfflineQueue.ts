import { useEffect, useRef, useState } from 'react';

import { OfflineQueue, type QueueEntry } from '../services/offlineQueue';

export interface OfflineQueueOptions<TPayload> {
  handler: (entry: QueueEntry<TPayload>) => Promise<void>;
}

export function useOfflineQueue<TPayload>(options: OfflineQueueOptions<TPayload>) {
  const queueRef = useRef(new OfflineQueue<TPayload>());
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      void queueRef.current.flushWith(options.handler);
    };
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    if (typeof navigator !== 'undefined' && navigator.onLine) {
      void queueRef.current.flushWith(options.handler);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, [options.handler]);

  return {
    isOffline,
    enqueue: (payload: TPayload) => queueRef.current.enqueue(payload)
  } as const;
}
