import React from 'react';

import { formatDateTime } from '../utils/formatDateTime';
import type { ReminderItem } from '../hooks/useReminders';
import type { ReminderActivityDto } from '../services/api/remindersClient';
import ReminderRow from './ReminderRow';

export interface RemindersPanelProps {
  reminders: ReminderItem[];
  onSnooze: (id: string, snoozeUntil: string) => Promise<void> | void;
  onDismiss: (id: string) => Promise<void> | void;
  loadActivity: (id: string) => Promise<void> | void;
  activityByReminder: Record<string, ReminderActivityDto[]>;
}

const RemindersPanel: React.FC<RemindersPanelProps> = ({
  reminders,
  onSnooze,
  onDismiss,
  loadActivity,
  activityByReminder
}) => {
  if (reminders.length === 0) {
    return (
      <section className="bg-slate-800 rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-2">Upcoming reminders</h2>
        <p className="text-slate-400 text-sm">No reminders scheduled for the next 48 hours.</p>
      </section>
    );
  }

  return (
    <section className="bg-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Upcoming reminders</h2>
        <span className="text-xs text-slate-400">Sorted by time</span>
      </div>
      <ul className="divide-y divide-slate-700">
        {reminders.map((reminder) => (
          <li key={reminder.id} className="py-3">
            <ReminderRow
              reminder={reminder}
              formattedTime={formatDateTime(reminder.scheduledFor)}
              onSnooze={onSnooze}
              onDismiss={onDismiss}
              loadActivity={loadActivity}
              activityLogs={activityByReminder[reminder.id] ?? []}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RemindersPanel;
