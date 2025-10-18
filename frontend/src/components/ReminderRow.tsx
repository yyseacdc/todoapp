import React, { useState } from 'react';

import { ReminderItem } from '../hooks/useReminders';
import type { ReminderActivityDto } from '../services/api/remindersClient';

interface ReminderRowProps {
  reminder: ReminderItem;
  formattedTime: string;
  onSnooze: (id: string, snoozeUntil: string) => Promise<void> | void;
  onDismiss: (id: string) => Promise<void> | void;
  loadActivity: (id: string) => Promise<void> | void;
  activityLogs: ReminderActivityDto[];
}

const ReminderRow: React.FC<ReminderRowProps> = ({
  reminder,
  formattedTime,
  onSnooze,
  onDismiss,
  loadActivity,
  activityLogs
}) => {
  const [snoozeMinutes, setSnoozeMinutes] = useState(15);
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-slate-100">{reminder.taskTitle}</p>
        <p className="text-sm text-slate-400">{formattedTime}</p>
        <button
          type="button"
          className="text-xs text-sky-400 hover:underline"
          onClick={() => loadActivity(reminder.id)}
        >
          {activityLogs.length > 0
            ? `Last event: ${activityLogs[0].eventType} at ${new Date(activityLogs[0].eventTime).toLocaleString()}`
            : 'View activity'}
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select
          className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
          value={snoozeMinutes}
          onChange={(event) => setSnoozeMinutes(Number(event.target.value))}
        >
          {[5, 15, 30, 60].map((minutes) => (
            <option key={minutes} value={minutes}>
              Snooze {minutes}m
            </option>
          ))}
        </select>
        <button
          type="button"
          className="px-3 py-2 rounded-md bg-sky-500 text-white text-sm hover:bg-sky-400"
          onClick={() => {
            const snoozeUntil = new Date(Date.now() + snoozeMinutes * 60000).toISOString();
            void onSnooze(reminder.id, snoozeUntil);
          }}
        >
          Snooze
        </button>
        <button
          type="button"
          className="px-3 py-2 rounded-md bg-slate-700 text-sm text-slate-100 hover:bg-slate-600"
          onClick={() => void onDismiss(reminder.id)}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default ReminderRow;
