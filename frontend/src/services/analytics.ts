export type AnalyticsEvent =
  | 'task.created'
  | 'task.duplicate'
  | 'task.completed'
  | 'task.undo'
  | 'task.deleted'
  | 'reminder.scheduled'
  | 'reminder.interaction';

export interface AnalyticsPayload {
  [key: string]: unknown;
}

export function trackEvent(event: AnalyticsEvent, payload: AnalyticsPayload = {}): void {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.info(`[analytics] ${event}`, payload);
  }
}
