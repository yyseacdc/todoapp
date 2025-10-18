from __future__ import annotations
import uuid
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum as PgEnum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..util.db import Base

if TYPE_CHECKING:  # pragma: no cover
    from .task import Task
    from .reminder_activity import ReminderActivity


class ReminderStatus(str, Enum):
    SCHEDULED = 'scheduled'
    SENT = 'sent'
    CANCELLED = 'cancelled'
    SNOOZED = 'snoozed'


class Reminder(Base):
    __tablename__ = 'reminders'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id: Mapped[str] = mapped_column(String, ForeignKey('tasks.id'), unique=True, nullable=False)
    scheduled_for: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    channel: Mapped[str] = mapped_column(String(32), default='in_app', nullable=False)
    status: Mapped[ReminderStatus] = mapped_column(PgEnum(ReminderStatus), default=ReminderStatus.SCHEDULED, nullable=False)
    snooze_until: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    task: Mapped[Task] = relationship('Task', back_populates='reminder', uselist=False)
    activity: Mapped[list[ReminderActivity]] = relationship('ReminderActivity', back_populates='reminder', cascade='all, delete-orphan')
