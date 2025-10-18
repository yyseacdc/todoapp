from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from ...api.routes.ws import notify_reminders_update
from ...services.reminder_service import ReminderNotFoundError, ReminderService
from ...util.db import get_session
from ..schemas.task import (
    ReminderActivityListResponse,
    ReminderActivityLog,
    ReminderSnoozeRequest,
    ReminderSummary,
    UpcomingRemindersResponse,
)

router = APIRouter()


@router.get('/reminders/upcoming', response_model=UpcomingRemindersResponse)
async def list_upcoming_reminders(
    session: AsyncSession = Depends(get_session),
) -> UpcomingRemindersResponse:
    service = ReminderService(session)
    reminders = await service.list_upcoming()
    summaries = [
        ReminderSummary(
            id=reminder.id,
            taskId=reminder.task_id,
            taskTitle=reminder.task.title if reminder.task else 'Unknown task',
            scheduledFor=reminder.scheduled_for,
            status=reminder.status,
            snoozeUntil=reminder.snooze_until,
        )
        for reminder in reminders
    ]
    return UpcomingRemindersResponse(data=summaries)


@router.post('/reminders/{reminder_id}/snooze', response_model=ReminderSummary)
async def snooze_reminder(
    reminder_id: str,
    request: ReminderSnoozeRequest,
    session: AsyncSession = Depends(get_session),
) -> ReminderSummary:
    service = ReminderService(session)
    try:
        reminder = await service.snooze(reminder_id, request.snoozeUntil)
    except ReminderNotFoundError as exc:  # pragma: no cover - defensive
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Reminder not found') from exc
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    await notify_reminders_update()
    return ReminderSummary(
        id=reminder.id,
        taskId=reminder.task_id,
        taskTitle=reminder.task.title if reminder.task else 'Unknown task',
        scheduledFor=reminder.scheduled_for,
        status=reminder.status,
        snoozeUntil=reminder.snooze_until,
    )


@router.post('/reminders/{reminder_id}/dismiss', status_code=status.HTTP_204_NO_CONTENT)
async def dismiss_reminder(
    reminder_id: str,
    session: AsyncSession = Depends(get_session),
) -> None:
    service = ReminderService(session)
    try:
        await service.dismiss(reminder_id)
    except ReminderNotFoundError as exc:  # pragma: no cover - defensive
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Reminder not found') from exc
    await notify_reminders_update()


@router.get('/reminders/activity', response_model=ReminderActivityListResponse)
async def list_reminder_activity(
    reminderId: str | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
) -> ReminderActivityListResponse:
    service = ReminderService(session)
    logs = await service.list_activity(reminder_id=reminderId, limit=limit)
    response = [
        ReminderActivityLog(
            id=log.id,
            reminderId=log.reminder_id,
            eventType=log.event_type,
            eventTime=log.event_time,
            metadata=log.metadata,
        )
        for log in logs
    ]
    return ReminderActivityListResponse(data=response)
