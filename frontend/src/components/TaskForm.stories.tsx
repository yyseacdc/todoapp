import type { Meta, StoryObj } from '@storybook/react';
import TaskForm from './TaskForm';

const meta: Meta<typeof TaskForm> = {
  title: 'Components/TaskForm',
  component: TaskForm,
  args: {
    onSubmit: async () => undefined,
    onDuplicateConfirm: () => undefined,
    onDuplicateDismiss: () => undefined,
    offline: false
  }
};

export default meta;

type Story = StoryObj<typeof TaskForm>;

export const Default: Story = {};

export const OfflineState: Story = {
  args: {
    offline: true
  }
};

export const Duplicate: Story = {
  args: {
    duplicateCandidate: {
      id: 'duplicate-task',
      title: 'Existing task',
      reminderText: 'Reminder set for 2025-10-21 09:00'
    }
  }
};
