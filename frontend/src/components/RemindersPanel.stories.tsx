import type { Meta, StoryObj } from '@storybook/react';

import RemindersPanel from './RemindersPanel';
import type { ReminderItem } from '../hooks/useReminders';

const sampleReminders: ReminderItem[] = [
  {
    id: 'rem-1',
    taskId: 'task-1',
    taskTitle: 'Plan sprint review',
    scheduledFor: new Date(Date.now() + 3600000).toISOString(),
    status: 'scheduled'
  },
  {
    id: 'rem-2',
    taskId: 'task-2',
    taskTitle: 'Send project update',
    scheduledFor: new Date(Date.now() + 7200000).toISOString(),
    status: 'scheduled'
  }
];

const meta: Meta<typeof RemindersPanel> = {
  title: 'Components/RemindersPanel',
  component: RemindersPanel,
  args: {
    reminders: sampleReminders,
    onSnooze: async () => undefined,
    onDismiss: async () => undefined,
    loadActivity: async () => undefined,
    activityByReminder: {}
  }
};

export default meta;

type Story = StoryObj<typeof RemindersPanel>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    reminders: []
  }
};
