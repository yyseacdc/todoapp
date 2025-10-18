import { apiClient } from './client';

export interface CreateTaskRequest {
  title: string;
  notes?: string;
  reminder?: {
    scheduledFor: string;
    channel?: string;
  };
  offline?: boolean;
}

export interface ReminderDto {
  id: string;
  taskId: string;
  scheduledFor: string;
  status: string;
  channel: string;
  snoozeUntil?: string;
}

export interface TaskDto {
  id: string;
  title: string;
  notes?: string;
  reminder?: ReminderDto;
  offline?: boolean;
}

export async function createTask(request: CreateTaskRequest): Promise<TaskDto> {
  return apiClient.post<TaskDto>('/tasks', request);
}
