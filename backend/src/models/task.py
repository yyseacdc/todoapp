from __future__ import annotations
import uuid
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, DateTime, Enum as PgEnum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..util.db import Base

if TYPE_CHECKING:  # pragma: no cover
    from .reminder import Reminder


class TaskStatus(str, Enum):
    ACTIVE = 'active'
    COMPLETED = 'completed'
    DELETED = 'deleted'


class TaskPriority(str, Enum):
    LOW = 'low'
    NORMAL = 'normal'
    HIGH = 'high'


class Task(Base):
    __tablename__ = 'tasks'
    __table_args__ = (
        CheckConstraint("length(title) BETWEEN 1 AND 120", name="ck_tasks_title_length"),
    )

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    due_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    priority: Mapped[TaskPriority] = mapped_column(PgEnum(TaskPriority), default=TaskPriority.NORMAL, nullable=False)
    status: Mapped[TaskStatus] = mapped_column(PgEnum(TaskStatus), default=TaskStatus.ACTIVE, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    reminder_id: Mapped[str | None] = mapped_column(String, ForeignKey('reminders.id'), nullable=True)

    reminder: Mapped[Reminder | None] = relationship('Reminder', back_populates='task', uselist=False)

    def mark_completed(self) -> None:
        self.status = TaskStatus.COMPLETED
        self.completed_at = datetime.utcnow()

    def reinstate(self) -> None:
        self.status = TaskStatus.ACTIVE
        self.completed_at = None
