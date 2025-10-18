import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import TaskCard, { type TaskCardProps } from '../../src/components/TaskCard';

const buildProps = (overrides: Partial<TaskCardProps> = {}): TaskCardProps => ({
  task: {
    id: 'task-1',
    title: 'Finish homework',
    reminderText: 'Reminder set for 2025-10-19 18:00',
    completed: false,
    completedAt: undefined,
    offline: false
  },
  onComplete: vi.fn(),
  onUndo: vi.fn(),
  onDelete: vi.fn(),
  ...overrides
});

describe('TaskCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders task information and reminder text', () => {
    const props = buildProps();
    render(<TaskCard {...props} />);

    expect(screen.getByText('Finish homework')).toBeInTheDocument();
    expect(screen.getByText(/Reminder set for/)).toBeInTheDocument();
  });

  it('invokes onComplete when completing an active task', () => {
    const props = buildProps();
    render(<TaskCard {...props} />);

    fireEvent.click(screen.getByRole('button', { name: /mark complete/i }));

    expect(props.onComplete).toHaveBeenCalledWith('task-1');
  });

  it('invokes onUndo when undoing a completed task', () => {
    const props = buildProps({
      task: {
        id: 'task-2',
        title: 'Call mom',
        reminderText: undefined,
        completed: true,
        completedAt: '2025-10-19T12:00:00Z',
        offline: false
      }
    });
    render(<TaskCard {...props} />);

    fireEvent.click(screen.getByRole('button', { name: /undo/i }));

    expect(props.onUndo).toHaveBeenCalledWith('task-2');
  });

  it('invokes onDelete when delete button clicked', () => {
    const props = buildProps();
    render(<TaskCard {...props} />);

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(props.onDelete).toHaveBeenCalledWith('task-1');
  });
});
