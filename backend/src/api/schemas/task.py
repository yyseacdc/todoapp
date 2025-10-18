from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field, validator

from ...models.task import TaskPriority, TaskStatus
from ...models.reminder import ReminderStatus
from ...models.reminder_activity import ReminderEvent


class ReminderInput(BaseModel):
    scheduledFor: datetime = Field(..., description="ISO timestamp for reminder trigger")
    channel: str = Field(default='in_app')

    @validator('scheduledFor')
    def validate_future_time(cls, value: datetime) -> datetime:
        if value <= datetime.utcnow():
            raise ValueError('reminder must be scheduled in the future')
        return value


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=120)
    notes: str | None = Field(default=None, max_length=2000)
    dueAt: datetime | None = Field(default=None)
    priority: TaskPriority = Field(default=TaskPriority.NORMAL)
    reminder: ReminderInput | None = None
    offline: bool = Field(default=False)


class ReminderResponse(BaseModel):
    id: str
    taskId: str
    scheduledFor: datetime
    status: ReminderStatus
    channel: str
    snoozeUntil: datetime | None = None


class ReminderActivityResponse(BaseModel):
    id: str
    reminderId: str
    eventType: ReminderEvent
    eventTime: datetime
    metadata: dict[str, Any] | None = None


class TaskResponse(BaseModel):
    id: str
    title: str
    notes: str | None = None
    dueAt: datetime | None = None
    priority: TaskPriority
    status: TaskStatus
    createdAt: datetime
    updatedAt: datetime
    completedAt: datetime | None = None
    reminder: ReminderResponse | None = None
    offline: bool = False


class DuplicateTaskResponse(BaseModel):
    duplicateDetected: bool = True
    existingTask: TaskResponse
