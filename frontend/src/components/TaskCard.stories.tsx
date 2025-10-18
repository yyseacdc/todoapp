import type { Meta, StoryObj } from '@storybook/react';

import TaskCard from './TaskCard';

const meta: Meta<typeof TaskCard> = {
  title: 'Components/TaskCard',
  component: TaskCard,
  args: {
    task: {
      id: 'task-1',
      title: 'Draft sprint update',
      reminderText: 'Reminder set for 2025-10-21 09:00',
      completed: false,
      offline: false
    },
    onComplete: async () => undefined,
    onUndo: async () => undefined,
    onDelete: async () => undefined
  }
};

export default meta;

type Story = StoryObj<typeof TaskCard>;

export const Active: Story = {};

export const Completed: Story = {
  args: {
    task: {
      id: 'task-2',
      title: 'Submit expense report',
      reminderText: undefined,
      completed: true,
      completedAt: new Date().toISOString(),
      offline: false
    }
  }
};

export const OfflinePending: Story = {
  args: {
    task: {
      id: 'task-3',
      title: 'Sync offline notes',
      reminderText: 'Reminder set for 2025-10-22 14:00',
      completed: false,
      offline: true
    }
  }
};
