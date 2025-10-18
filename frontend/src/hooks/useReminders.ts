import { useCallback, useEffect, useState } from 'react';

import {
  dismissReminder,
  fetchReminderActivity,
  fetchUpcomingReminders,
  ReminderActivityDto,
  ReminderSummaryDto,
  snoozeReminder
} from '../services/api/remindersClient';
import { trackEvent } from '../services/analytics';

export interface ReminderItem {
  id: string;
  taskId: string;
  taskTitle: string;
  scheduledFor: string;
  status: string;
  snoozeUntil?: string | null;
}

export function useReminders() {
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [activity, setActivity] = useState<Record<string, ReminderActivityDto[]>>({});

  const mapReminder = useCallback((dto: ReminderSummaryDto): ReminderItem => ({
    id: dto.id,
    taskId: dto.taskId,
    taskTitle: dto.taskTitle,
    scheduledFor: dto.scheduledFor,
    status: dto.status,
    snoozeUntil: dto.snoozeUntil ?? undefined
  }), []);

  const refresh = useCallback(async () => {
    const upcoming = await fetchUpcomingReminders();
    setReminders(
      upcoming
        .map(mapReminder)
        .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())
    );
  }, [mapReminder]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

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
          if (payload?.event === 'reminders.updated') {
            void refresh();
          }
        } catch (error) {
          console.warn('Unable to parse reminder websocket payload', error);
        }
      };
    } catch (error) {
      console.warn('Unable to open reminder websocket connection', error);
    }
    return () => socket?.close();
  }, [refresh]);

  const snooze = useCallback(
    async (reminderId: string, snoozeUntil: string) => {
      const updated = await snoozeReminder(reminderId, snoozeUntil);
      setReminders((prev) =>
        prev
          .map((item) => (item.id === reminderId ? mapReminder(updated) : item))
          .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())
      );
      trackEvent('reminder.interaction', { action: 'snooze', reminderId, snoozeUntil });
    },
    [mapReminder]
  );

  const dismiss = useCallback(async (reminderId: string) => {
    await dismissReminder(reminderId);
    setReminders((prev) => prev.filter((item) => item.id !== reminderId));
    trackEvent('reminder.interaction', { action: 'dismiss', reminderId });
  }, []);

  const loadActivity = useCallback(async (reminderId: string) => {
    const logs = await fetchReminderActivity(reminderId);
    setActivity((prev) => ({ ...prev, [reminderId]: logs }));
  }, []);

  return {
    reminders,
    activity,
    refresh,
    snooze,
    dismiss,
    loadActivity
  } as const;
}
