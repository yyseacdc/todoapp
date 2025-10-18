import React from 'react';

export interface TaskCardTask {
  id: string;
  title: string;
  reminderText?: string;
  completed: boolean;
  completedAt?: string;
  offline?: boolean;
}

export interface TaskCardProps {
  task: TaskCardTask;
  onComplete: (taskId: string) => Promise<void> | void;
  onUndo: (taskId: string) => Promise<void> | void;
  onDelete: (taskId: string) => Promise<void> | void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onUndo, onDelete }) => {
  const completedAtLabel = task.completedAt
    ? `Completed at ${new Date(task.completedAt).toLocaleString()}`
    : null;

  return (
    <article className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 flex items-start justify-between gap-4">
      <div className="space-y-1">
        <h3 className="text-lg font-medium text-slate-100">{task.title}</h3>
        {task.reminderText && <p className="text-sm text-slate-400">{task.reminderText}</p>}
        {completedAtLabel && <p className="text-xs text-emerald-400">{completedAtLabel}</p>}
        {task.offline && <p className="text-xs uppercase text-amber-400">Sync pending</p>}
      </div>

      <div className="flex items-center gap-2">
        {task.completed ? (
          <button
            type="button"
            className="px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600"
            onClick={() => void onUndo(task.id)}
          >
            Undo
          </button>
        ) : (
          <button
            type="button"
            className="px-3 py-2 rounded-md bg-sky-500 text-white hover:bg-sky-400"
            onClick={() => void onComplete(task.id)}
          >
            Mark complete
          </button>
        )}
        <button
          type="button"
          className="px-3 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-red-300"
          onClick={() => void onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
};

export default TaskCard;
