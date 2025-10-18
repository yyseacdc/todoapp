from __future__ import annotations

from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..api.routes.ws import notify_reminders_update
from ..models.reminder import Reminder, ReminderStatus
from ..models.reminder_activity import ReminderActivity, ReminderEvent
from ..services.reminder_scheduler import scheduler


class ReminderNotFoundError(Exception):
    """Raised when a reminder cannot be located."""


class ReminderService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_upcoming(self, horizon: timedelta = timedelta(hours=48)) -> list[Reminder]:
        cutoff = datetime.utcnow() + horizon
        stmt = (
            select(Reminder)
            .options(selectinload(Reminder.task))
            .where(Reminder.status.in_([ReminderStatus.SCHEDULED, ReminderStatus.SNOOZED]))
            .where(Reminder.scheduled_for <= cutoff)
            .order_by(Reminder.scheduled_for.asc())
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().unique())

    async def snooze(self, reminder_id: str, snooze_until: datetime) -> Reminder:
        reminder = await self._get(reminder_id)
        if snooze_until <= datetime.utcnow():
            raise ValueError("Snooze time must be in the future.")
        reminder.scheduled_for = snooze_until
        reminder.snooze_until = snooze_until
        reminder.status = ReminderStatus.SNOOZED
        activity = ReminderActivity(
            reminder=reminder,
            event_type=ReminderEvent.SNOOZED,
            metadata={"snoozeUntil": snooze_until.isoformat()},
        )
        self.session.add(activity)
        await self.session.commit()
        await self.session.refresh(reminder)
        await scheduler.enqueue_reminder(reminder.id)
        await notify_reminders_update()
        return reminder

    async def dismiss(self, reminder_id: str) -> Reminder:
        reminder = await self._get(reminder_id)
        reminder.status = ReminderStatus.CANCELLED
        reminder.snooze_until = None
        activity = ReminderActivity(
            reminder=reminder,
            event_type=ReminderEvent.DISMISSED,
            metadata={"reason": "user_dismissed"},
        )
        self.session.add(activity)
        await scheduler.cancel_reminder(reminder.id)
        await self.session.commit()
        await self.session.refresh(reminder)
        await notify_reminders_update()
        return reminder

    async def list_activity(
        self,
        reminder_id: str | None,
        limit: int = 20,
    ) -> list[ReminderActivity]:
        stmt = select(ReminderActivity).order_by(ReminderActivity.event_time.desc())
        if reminder_id:
            stmt = stmt.where(ReminderActivity.reminder_id == reminder_id)
        stmt = stmt.limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars())

    async def _get(self, reminder_id: str) -> Reminder:
        result = await self.session.execute(
            select(Reminder).options(selectinload(Reminder.task)).where(Reminder.id == reminder_id)
        )
        reminder = result.scalar_one_or_none()
        if reminder is None:
            raise ReminderNotFoundError(reminder_id)
        return reminder
