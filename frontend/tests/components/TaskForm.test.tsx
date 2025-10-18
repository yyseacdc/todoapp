import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TaskForm, { TaskFormProps } from '../../src/components/TaskForm';

const defaultProps: TaskFormProps = {
  onSubmit: vi.fn(),
  onDuplicateConfirm: vi.fn(),
  offline: false
};

function setup(overrides: Partial<TaskFormProps> = {}) {
  const props = { ...defaultProps, ...overrides };
  render(<TaskForm {...props} />);
  return props;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('TaskForm component', () => {
  it('validates required title field', async () => {
    const props = setup();

    fireEvent.submit(screen.getByRole('form'));

    expect(props.onSubmit).not.toHaveBeenCalled();
    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
  });

  it('submits with reminder data when provided', async () => {
    const props = setup();

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Pay rent' } });
    fireEvent.change(screen.getByLabelText(/reminder/i), {
      target: { value: '2025-10-20T12:30' }
    });

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(props.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Pay rent',
          reminder: expect.any(String)
        })
      );
    });
  });

  it('shows duplicate confirmation modal when server signals duplicate', async () => {
    const props = setup({ duplicateCandidate: { title: 'Pay rent', id: 'task-123' } });

    expect(await screen.findByText(/looks like you already created/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /create anyway/i }));

    expect(props.onDuplicateConfirm).toHaveBeenCalled();
  });

  it('renders offline sync chip when offline', () => {
    setup({ offline: true });
    expect(screen.getByText(/sync pending/i)).toBeInTheDocument();
  });
});
