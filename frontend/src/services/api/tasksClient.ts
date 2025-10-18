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
  status: 'active' | 'completed' | 'deleted';
  completedAt?: string;
  reminder?: ReminderDto;
  offline?: boolean;
}

export async function createTask(request: CreateTaskRequest): Promise<TaskDto> {
  return apiClient.post<TaskDto>('/tasks', request);
}

export async function completeTask(taskId: string): Promise<TaskDto> {
  return apiClient.post<TaskDto>(`/tasks/${taskId}/complete`);
}

export async function undoTask(taskId: string): Promise<TaskDto> {
  return apiClient.post<TaskDto>(`/tasks/${taskId}/undo`);
}

export async function deleteTask(taskId: string): Promise<void> {
  await apiClient.delete(`/tasks/${taskId}`);
}
