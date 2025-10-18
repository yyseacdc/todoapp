import React, { FormEvent, useState } from 'react';

export interface DuplicateCandidate {
  id: string;
  title: string;
  reminderText?: string;
}

export interface TaskFormPayload {
  title: string;
  reminder?: string;
  notes?: string;
}

export interface TaskFormProps {
  onSubmit: (payload: TaskFormPayload) => Promise<{ duplicate?: boolean } | void;
  onDuplicateConfirm: () => Promise<void> | void;
  onDuplicateDismiss?: () => void;
  duplicateCandidate?: DuplicateCandidate | null;
  offline?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onDuplicateConfirm,
  onDuplicateDismiss,
  duplicateCandidate,
  offline = false
}) => {
  const [title, setTitle] = useState('');
  const [reminder, setReminder] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError(null);
    const result = await onSubmit({
      title: title.trim(),
      reminder: reminder ? new Date(reminder).toISOString() : undefined,
      notes: notes.trim() || undefined
    });
    if (!result || !result.duplicate) {
      setTitle('');
      setReminder('');
      setNotes('');
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-lg space-y-4">
      <form role="form" className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="task-title">
            Title
          </label>
          <input
            id="task-title"
            aria-label="Title"
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Add a task"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="task-reminder">
            Reminder
          </label>
          <input
            type="datetime-local"
            id="task-reminder"
            aria-label="Reminder"
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={reminder}
            onChange={(event) => setReminder(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="task-notes">
            Notes
          </label>
          <textarea
            id="task-notes"
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            placeholder="Optional notes"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-sky-500 text-white font-medium hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            Add task
          </button>

          {offline && (
            <span className="text-xs uppercase tracking-wide text-amber-400">Sync pending</span>
          )}
        </div>
      </form>

      {duplicateCandidate && (
        <div className="rounded-md border border-yellow-500 bg-yellow-900/40 p-4 space-y-3">
          <p className="font-medium">Looks like you already created “{duplicateCandidate.title}”.</p>
          {duplicateCandidate.reminderText && (
            <p className="text-sm text-slate-200">{duplicateCandidate.reminderText}</p>
          )}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600"
              onClick={() => void onDuplicateConfirm()}
            >
              Create anyway
            </button>
            <button
              type="button"
              className="px-3 py-2 rounded-md text-slate-200 hover:bg-slate-700"
              onClick={() => {
                setError(null);
                onDuplicateDismiss?.();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskForm;
