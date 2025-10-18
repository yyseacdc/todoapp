from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from ...util.db import get_session
from ...models.task import Task
from ...models.reminder import Reminder
from ...services.task_service import TaskService
from ...api.schemas.task import (
    TaskCreate,
    TaskResponse,
    ReminderResponse,
    DuplicateTaskResponse,
)

router = APIRouter()


def serialize_reminder(reminder: Reminder | None) -> ReminderResponse | None:
    if reminder is None:
        return None
    return ReminderResponse(
        id=reminder.id,
        taskId=reminder.task_id,
        scheduledFor=reminder.scheduled_for,
        status=reminder.status,
        channel=reminder.channel,
        snoozeUntil=reminder.snooze_until,
    )


def serialize_task(task: Task, *, offline: bool = False) -> TaskResponse:
    return TaskResponse(
        id=task.id,
        title=task.title,
        notes=task.notes,
        dueAt=task.due_at,
        priority=task.priority,
        status=task.status,
        createdAt=task.created_at,
        updatedAt=task.updated_at,
        completedAt=task.completed_at,
        reminder=serialize_reminder(task.reminder),
        offline=offline,
    )


@router.post(
    '/tasks',
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_409_CONFLICT: {
            'description': 'Duplicate task detected',
            'model': DuplicateTaskResponse
        }
    }
)
async def create_task(
    payload: TaskCreate,
    session: AsyncSession = Depends(get_session)
):
    service = TaskService(session)
    result = await service.create_task(payload)
    if result.duplicate:
        duplicate_response = DuplicateTaskResponse(
            existingTask=serialize_task(result.duplicate)
        )
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content=duplicate_response.model_dump()
        )
    assert result.task is not None
    return serialize_task(result.task, offline=payload.offline)
