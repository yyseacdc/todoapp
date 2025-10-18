import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import RemindersPanel from '../../src/components/RemindersPanel';
import type { ReminderItem } from '../../src/hooks/useReminders';

const reminders: ReminderItem[] = [
  {
    id: 'rem-1',
    taskId: 'task-1',
    taskTitle: 'Team standup',
    scheduledFor: new Date('2025-10-20T09:00:00Z').toISOString(),
    status: 'scheduled',
    offline: false
  },
  {
    id: 'rem-2',
    taskId: 'task-2',
    taskTitle: 'Doctor appointment',
    scheduledFor: new Date('2025-10-20T12:00:00Z').toISOString(),
    status: 'scheduled',
    offline: false
  }
];

describe('RemindersPanel', () => {
  it('renders placeholder when empty', () => {
    render(
      <RemindersPanel
        reminders={[]}
        onSnooze={async () => undefined}
        onDismiss={async () => undefined}
        loadActivity={async () => undefined}
        activityByReminder={{}}
      />
    );

    expect(screen.getByText(/No reminders scheduled/)).toBeInTheDocument();
  });

  it('renders reminder rows and triggers actions', () => {
    const snooze = vi.fn();
    const dismiss = vi.fn();

    render(
      <RemindersPanel
        reminders={reminders}
        onSnooze={snooze}
        onDismiss={dismiss}
        loadActivity={async () => undefined}
        activityByReminder={{}}
      />
    );

    expect(screen.getByText('Team standup')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: /Snooze/ })[0]);
    expect(snooze).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getAllByRole('button', { name: /Dismiss/ })[1]);
    expect(dismiss).toHaveBeenCalledTimes(1);
  });
});
