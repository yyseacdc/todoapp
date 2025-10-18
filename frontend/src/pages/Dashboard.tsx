import React, { useState } from 'react';

import RemindersPanel from '../components/RemindersPanel';
import ReminderToast from '../components/ReminderToast';
import TaskCard from '../components/TaskCard';
import TaskForm, { TaskFormPayload } from '../components/TaskForm';
import { useReminders } from '../hooks/useReminders';
import { useTasks, type TaskDraft } from '../hooks/useTasks';
import { trackEvent } from '../services/analytics';

const Dashboard: React.FC = () => {
  const {
    activeTasks,
    completedTasks,
    createTask,
    completeTask,
    undoTask,
    deleteTask,
    duplicateCandidate,
    clearDuplicate,
    isOffline,
    hasReminderToast
  } = useTasks();
  const { reminders, snooze, dismiss, activity, loadActivity } = useReminders();
  const [pendingDraft, setPendingDraft] = useState<TaskDraft | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCreateTask = async (payload: TaskFormPayload) => {
    const draft: TaskDraft = {
      title: payload.title,
      reminder: payload.reminder,
      notes: payload.notes,
      allowDuplicate: false
    };
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
    const result = await createTask({ ...pendingDraft, allowDuplicate: true });
    if (!result.duplicate && !result.queued && pendingDraft.reminder) {
      const message = `Reminder set for ${new Date(pendingDraft.reminder).toLocaleString()}`;
      setToastMessage(message);
      trackEvent('reminder.scheduled', { title: pendingDraft.title, override: true });
      setTimeout(() => setToastMessage(null), 3000);
    }
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
        <div className="space-y-2">
          {activeTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={completeTask}
              onUndo={undoTask}
              onDelete={deleteTask}
            />
          ))}
          {activeTasks.length === 0 && <p className="text-slate-500">No tasks yet—add your first reminder.</p>}
        </div>
      </section>

      {completedTasks.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Completed tasks</h2>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={completeTask}
                onUndo={undoTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </section>
      )}

      <RemindersPanel
        reminders={reminders}
        onSnooze={snooze}
        onDismiss={dismiss}
        loadActivity={loadActivity}
        activityByReminder={activity}
      />

      {toastMessage && hasReminderToast && <ReminderToast message={toastMessage} />}
    </main>
  );
};

export default Dashboard;
