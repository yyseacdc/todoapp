import { apiClient } from './client';

export interface ReminderSummaryDto {
  id: string;
  taskId: string;
  taskTitle: string;
  scheduledFor: string;
  status: string;
  snoozeUntil?: string | null;
}

export interface ReminderActivityDto {
  id: string;
  reminderId: string;
  eventType: string;
  eventTime: string;
  metadata?: Record<string, unknown> | null;
}

export async function fetchUpcomingReminders(): Promise<ReminderSummaryDto[]> {
  const response = await apiClient.get<{ data: ReminderSummaryDto[] }>('/reminders/upcoming');
  return response.data;
}

export async function snoozeReminder(reminderId: string, snoozeUntil: string): Promise<ReminderSummaryDto> {
  return apiClient.post<ReminderSummaryDto, { snoozeUntil: string }>(
    `/reminders/${reminderId}/snooze`,
    { snoozeUntil }
  );
}

export async function dismissReminder(reminderId: string): Promise<void> {
  await apiClient.post(`/reminders/${reminderId}/dismiss`);
}

export async function fetchReminderActivity(reminderId: string): Promise<ReminderActivityDto[]> {
  const response = await apiClient.get<{ data: ReminderActivityDto[] }>(
    `/reminders/activity?reminderId=${encodeURIComponent(reminderId)}`
  );
  return response.data;
}
