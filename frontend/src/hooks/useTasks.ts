import { useCallback, useMemo, useState } from 'react';

import { ApiError } from '../services/api/client';
import { createTask as createTaskApi } from '../services/api/tasksClient';
import { trackEvent } from '../services/analytics';
import { useOfflineQueue } from './useOfflineQueue';

export interface TaskDraft {
  title: string;
  reminder?: string;
  notes?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  reminderText?: string;
  offline: boolean;
}

interface CreateTaskResult {
  duplicate?: boolean;
  queued?: boolean;
}

export function useTasks() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [duplicateCandidate, setDuplicateCandidate] = useState<TaskItem | null>(null);

  const mapReminderText = useCallback((timestamp?: string) =>
    timestamp ? `Reminder set for ${new Date(timestamp).toLocaleString()}` : undefined,
  []);

  const sendToApi = useCallback(async (draft: TaskDraft, isFromQueue = false): Promise<void> => {
    const payload = {
      title: draft.title,
      notes: draft.notes,
      reminder: draft.reminder ? { scheduledFor: draft.reminder } : undefined,
      offline: isFromQueue
    };
    const response = await createTaskApi(payload);
    const mapped: TaskItem = {
      id: response.id,
      title: response.title,
      reminderText: response.reminder ? mapReminderText(response.reminder.scheduledFor) : undefined,
      offline: Boolean(response.offline)
    };
    setTasks((prev) => [mapped, ...prev.filter((task) => !task.id.startsWith('temp-'))]);
    setDuplicateCandidate(null);
    trackEvent('task.created', { offline: response.offline });
  }, [mapReminderText]);

  const { isOffline, enqueue } = useOfflineQueue<TaskDraft>({
    handler: async (entry) => {
      try {
        await sendToApi(entry.payload, true);
      } catch (error) {
        console.error('Failed to sync offline task', error);
      }
    }
  });

  const createTask = useCallback(
    async (draft: TaskDraft): Promise<CreateTaskResult> => {
      const optimisticTask: TaskItem = {
        id: `temp-${Date.now()}`,
        title: draft.title,
        reminderText: mapReminderText(draft.reminder),
        offline: true
      };

      if (isOffline) {
        setTasks((prev) => [optimisticTask, ...prev]);
        await enqueue(draft);
        trackEvent('task.created', { source: 'offline' });
        return { queued: true };
      }

      try {
        await sendToApi(draft);
        return {};
      } catch (error) {
        if (error instanceof ApiError && error.status === 409 && error.body) {
          const existing = (error.body as any).existingTask;
          setDuplicateCandidate({
            id: existing.id,
            title: existing.title,
            reminderText: existing.reminder ? mapReminderText(existing.reminder.scheduledFor) : undefined,
            offline: false
          });
          trackEvent('task.duplicate', { title: draft.title });
          return { duplicate: true };
        }

        // network failure fallback
        setTasks((prev) => [optimisticTask, ...prev]);
        await enqueue(draft);
        return { queued: true };
      }
    },
    [enqueue, isOffline, mapReminderText, sendToApi]
  );

  const clearDuplicate = useCallback(() => setDuplicateCandidate(null), []);

  const hasReminderToast = useMemo(
    () => tasks.some((task) => !task.offline && Boolean(task.reminderText)),
    [tasks]
  );

  return {
    tasks,
    createTask,
    duplicateCandidate,
    clearDuplicate,
    isOffline,
    hasReminderToast
  } as const;
}
