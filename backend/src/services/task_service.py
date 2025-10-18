from dataclasses import dataclass
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..api.routes.ws import notify_reminders_update
from ..api.schemas.task import TaskCreate
from ..models.reminder import Reminder, ReminderStatus
from ..models.reminder_activity import ReminderActivity, ReminderEvent
from ..models.task import Task, TaskPriority, TaskStatus
from ..services.reminder_scheduler import scheduler
from ..util.telemetry import log_event
from .duplicate_guard import find_recent_duplicate


@dataclass
class TaskCreationResult:
    task: Task | None
    duplicate: Task | None = None


class TaskNotFoundError(Exception):
    """Raised when a task cannot be retrieved."""


class TaskService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create_task(self, payload: TaskCreate) -> TaskCreationResult:
        duplicate = await find_recent_duplicate(self.session, payload.title)
        if duplicate and not payload.allowDuplicate:
            log_event('task.duplicate', payload={'taskId': duplicate.id})
            return TaskCreationResult(task=None, duplicate=duplicate)

        task = Task(
            title=self._sanitize_title(payload.title),
            notes=payload.notes.strip() if payload.notes else None,
            due_at=payload.dueAt,
            priority=payload.priority or TaskPriority.NORMAL,
            status=TaskStatus.ACTIVE,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        if payload.reminder:
            reminder = Reminder(
                task=task,
                scheduled_for=payload.reminder.scheduledFor,
                channel=payload.reminder.channel,
                status=ReminderStatus.SCHEDULED,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )
            task.reminder = reminder
            activity = ReminderActivity(
                reminder=reminder,
                event_type=ReminderEvent.SCHEDULED,
                metadata={'channel': reminder.channel}
            )
            self.session.add(activity)

        self.session.add(task)
        await self.session.flush()
        await self.session.commit()
        await self.session.refresh(task)

        if task.reminder:
            await scheduler.enqueue_reminder(task.reminder.id)
            await notify_reminders_update()

        log_event('task.created', payload={'taskId': task.id, 'offline': payload.offline})
        if task.reminder:
            log_event('reminder.scheduled', payload={'taskId': task.id})

        return TaskCreationResult(task=task)

    async def complete_task(self, task_id: str) -> Task:
        task = await self._get_task(task_id)
        if task.status != TaskStatus.COMPLETED:
            task.mark_completed()
            if task.reminder:
                task.reminder.status = ReminderStatus.CANCELLED
                activity = ReminderActivity(
                    reminder=task.reminder,
                    event_type=ReminderEvent.DISMISSED,
                    metadata={'reason': 'task_completed'}
                )
                self.session.add(activity)
                await scheduler.cancel_reminder(task.reminder.id)
        await self.session.commit()
        await self.session.refresh(task)
        log_event('task.completed', payload={'taskId': task.id})
        return task

    async def undo_completion(self, task_id: str) -> Task:
        task = await self._get_task(task_id)
        if task.status == TaskStatus.COMPLETED:
            task.reinstate()
            if task.reminder:
                task.reminder.status = ReminderStatus.SCHEDULED
                activity = ReminderActivity(
                    reminder=task.reminder,
                    event_type=ReminderEvent.SCHEDULED,
                    metadata={'reason': 'task_reopened'}
                )
                self.session.add(activity)
                await scheduler.enqueue_reminder(task.reminder.id)
        await self.session.commit()
        await self.session.refresh(task)
        log_event('task.undo', payload={'taskId': task.id})
        return task

    async def delete_task(self, task_id: str) -> None:
        task = await self._get_task(task_id)
        task.status = TaskStatus.DELETED
        task.updated_at = datetime.utcnow()
        if task.reminder:
            task.reminder.status = ReminderStatus.CANCELLED
            activity = ReminderActivity(
                reminder=task.reminder,
                event_type=ReminderEvent.DISMISSED,
                metadata={'reason': 'task_deleted'}
            )
            self.session.add(activity)
            await scheduler.cancel_reminder(task.reminder.id)
        await self.session.commit()
        log_event('task.deleted', payload={'taskId': task.id})

    async def _get_task(self, task_id: str) -> Task:
        result = await self.session.execute(select(Task).where(Task.id == task_id))
        task = result.scalar_one_or_none()
        if task is None:
            raise TaskNotFoundError(task_id)
        return task

    def _sanitize_title(self, title: str) -> str:
        return ' '.join(title.strip().split())
