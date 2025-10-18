from __future__ import annotations
import uuid
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum as PgEnum, ForeignKey, JSON, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..util.db import Base

if TYPE_CHECKING:  # pragma: no cover
    from .reminder import Reminder


class ReminderEvent(str, Enum):
    SCHEDULED = 'scheduled'
    DELIVERED = 'delivered'
    DISMISSED = 'dismissed'
    SNOOZED = 'snoozed'
    ERROR = 'error'


class ReminderActivity(Base):
    __tablename__ = 'reminder_activity'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    reminder_id: Mapped[str] = mapped_column(String, ForeignKey('reminders.id'), nullable=False, index=True)
    event_type: Mapped[ReminderEvent] = mapped_column(PgEnum(ReminderEvent), nullable=False)
    event_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    metadata: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    reminder: Mapped[Reminder] = relationship('Reminder', back_populates='activity')
