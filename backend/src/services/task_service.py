from dataclasses import dataclass
from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession

from ..models.reminder import Reminder, ReminderStatus
from ..models.reminder_activity import ReminderActivity, ReminderEvent
from ..models.task import Task, TaskPriority, TaskStatus
from ..util.telemetry import log_event
from ..api.schemas.task import TaskCreate
from ..services.reminder_scheduler import scheduler
from .duplicate_guard import find_recent_duplicate


@dataclass
class TaskCreationResult:
    task: Task | None
    duplicate: Task | None = None


class TaskService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create_task(self, payload: TaskCreate) -> TaskCreationResult:
        duplicate = await find_recent_duplicate(self.session, payload.title)
        if duplicate:
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

        log_event('task.created', payload={'taskId': task.id, 'offline': payload.offline})
        if task.reminder:
            log_event('reminder.scheduled', payload={'taskId': task.id})

        return TaskCreationResult(task=task)

    def _sanitize_title(self, title: str) -> str:
        return ' '.join(title.strip().split())
