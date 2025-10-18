import { useCallback, useEffect, useMemo, useState } from 'react';

import { ApiError } from '../services/api/client';
import {
  createTask as createTaskApi,
  completeTask as completeTaskApi,
  deleteTask as deleteTaskApi,
  undoTask as undoTaskApi,
  type TaskDto
} from '../services/api/tasksClient';
import { trackEvent } from '../services/analytics';
import { useOfflineQueue } from './useOfflineQueue';

export interface TaskDraft {
  title: string;
  reminder?: string;
  notes?: string;
  allowDuplicate?: boolean;
  clientId?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  reminderText?: string;
  completed: boolean;
  completedAt?: string;
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

  const mapTaskDto = useCallback(
    (dto: TaskDto, offlineOverride = false): TaskItem => ({
      id: dto.id,
      title: dto.title,
      reminderText: dto.reminder ? mapReminderText(dto.reminder.scheduledFor) : undefined,
      completed: dto.status === 'completed',
      completedAt: dto.completedAt,
      offline: offlineOverride || Boolean(dto.offline)
    }),
    [mapReminderText]
  );

  const sendToApi = useCallback(async (draft: TaskDraft, isFromQueue = false): Promise<void> => {
    const payload = {
      title: draft.title,
      notes: draft.notes,
      reminder: draft.reminder ? { scheduledFor: draft.reminder } : undefined,
      offline: isFromQueue,
      allowDuplicate: draft.allowDuplicate ?? false
    };
    const response = await createTaskApi(payload);
    const mapped = mapTaskDto(response);
    setTasks((prev) => {
      const withoutPlaceholder = draft.clientId
        ? prev.filter((task) => task.id !== draft.clientId)
        : prev;
      const withoutDuplicate = withoutPlaceholder.filter((task) => task.id !== mapped.id);
      return [mapped, ...withoutDuplicate];
    });
    setDuplicateCandidate(null);
    trackEvent('task.created', { offline: response.offline });
  }, [mapTaskDto]);

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
        completed: false,
        completedAt: undefined,
        offline: true
      };
      const queuedDraft: TaskDraft = { ...draft, clientId: optimisticTask.id };

      if (isOffline) {
        setTasks((prev) => [optimisticTask, ...prev]);
        await enqueue(queuedDraft);
        trackEvent('task.created', { source: 'offline' });
        return { queued: true };
      }

      try {
        await sendToApi(draft);
        return {};
      } catch (error) {
        if (error instanceof ApiError && error.status === 409 && error.body) {
          const existing = (error.body as any).existingTask;
          setDuplicateCandidate(mapTaskDto(existing as TaskDto));
          trackEvent('task.duplicate', { title: draft.title });
          return { duplicate: true };
        }

        // network failure fallback
        setTasks((prev) => [optimisticTask, ...prev]);
        await enqueue(queuedDraft);
        return { queued: true };
      }
    },
    [enqueue, isOffline, mapReminderText, mapTaskDto, sendToApi]
  );

  const completeTask = useCallback(
    async (taskId: string) => {
      const response = await completeTaskApi(taskId);
      setTasks((prev) => prev.map((task) => (task.id === taskId ? mapTaskDto(response) : task)));
      trackEvent('task.completed', { taskId });
    },
    [mapTaskDto]
  );

  const undoTask = useCallback(
    async (taskId: string) => {
      const response = await undoTaskApi(taskId);
      setTasks((prev) => prev.map((task) => (task.id === taskId ? mapTaskDto(response) : task)));
      trackEvent('task.undo', { taskId });
    },
    [mapTaskDto]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      await deleteTaskApi(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      trackEvent('task.deleted', { taskId });
    },
    []
  );


  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/v1').replace(/\/$/, '');
    const wsBase = baseUrl.startsWith('https')
      ? baseUrl.replace(/^https/, 'wss')
      : baseUrl.replace(/^http/, 'ws');
    let socket: WebSocket | null = null;
    try {
      socket = new WebSocket(`${wsBase}/ws/reminders`);
      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload?.task) {
            const mapped = mapTaskDto(payload.task as TaskDto);
            setTasks((prev) => {
              if (prev.some((task) => task.id === mapped.id)) {
                return prev.map((task) => (task.id === mapped.id ? mapped : task));
              }
              return [mapped, ...prev];
            });
          }
        } catch (error) {
          console.warn('Unable to parse reminder websocket payload', error);
        }
      };
    } catch (error) {
      console.warn('Unable to open reminder websocket connection', error);
    }
    return () => {
      socket?.close();
    };
  }, [mapTaskDto]);
  const clearDuplicate = useCallback(() => setDuplicateCandidate(null), []);

  const activeTasks = useMemo(() => tasks.filter((task) => !task.completed), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((task) => task.completed), [tasks]);

  const hasReminderToast = useMemo(
    () => activeTasks.some((task) => !task.offline && Boolean(task.reminderText)),
    [activeTasks]
  );

  return {
    tasks,
    activeTasks,
    completedTasks,
    createTask,
    completeTask,
    undoTask,
    deleteTask,
    duplicateCandidate,
    clearDuplicate,
    isOffline,
    hasReminderToast
  } as const;
}
