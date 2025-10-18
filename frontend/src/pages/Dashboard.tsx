import React, { useState } from 'react';

import ReminderToast from '../components/ReminderToast';
import TaskForm, { TaskFormPayload } from '../components/TaskForm';
import { useTasks, type TaskDraft } from '../hooks/useTasks';
import { trackEvent } from '../services/analytics';

const Dashboard: React.FC = () => {
  const { tasks, createTask, duplicateCandidate, clearDuplicate, isOffline, hasReminderToast } = useTasks();
  const [pendingDraft, setPendingDraft] = useState<TaskDraft | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCreateTask = async (payload: TaskFormPayload) => {
    const draft: TaskDraft = { title: payload.title, reminder: payload.reminder, notes: payload.notes };
    setPendingDraft(draft);
    const result = await createTask(draft);
    if (result.duplicate) {
      return { duplicate: true as const };
    }
    if (!result.queued && draft.reminder) {
      const message = `Reminder set for ${new Date(draft.reminder).toLocaleString()}`;
      setToastMessage(message);
      trackEvent('reminder.scheduled', { title: draft.title });
      setTimeout(() => setToastMessage(null), 3000);
    }
    setPendingDraft(null);
    return {};
  };

  const handleDuplicateConfirm = async () => {
    if (!pendingDraft) {
      clearDuplicate();
      return;
    }
    const result = await createTask(pendingDraft);
    if (!result.duplicate) {
      clearDuplicate();
      setPendingDraft(null);
    }
  };

  return (
    <main className="max-w-3xl mx-auto py-12 space-y-8">
      <section>
        <TaskForm
          onSubmit={handleCreateTask}
          onDuplicateConfirm={handleDuplicateConfirm}
          onDuplicateDismiss={clearDuplicate}
          duplicateCandidate={duplicateCandidate ?? undefined}
          offline={isOffline}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Active tasks</h2>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="bg-slate-800 rounded-lg px-4 py-3 flex justify-between">
              <span>{task.title}</span>
              <div className="text-sm text-slate-400">
                {task.reminderText && <span>{task.reminderText}</span>}
                {task.offline && <span className="ml-3 text-amber-400">Sync pending</span>}
              </div>
            </li>
          ))}
          {tasks.length === 0 && <p className="text-slate-500">No tasks yet—add your first reminder.</p>}
        </ul>
      </section>

      {toastMessage && hasReminderToast && <ReminderToast message={toastMessage} />}
    </main>
  );
};

export default Dashboard;
