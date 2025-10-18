import asyncio
import logging
from collections.abc import Awaitable, Callable

from ..config.settings import settings

logger = logging.getLogger(__name__)


class ReminderScheduler:
    """Lightweight scheduler stub to be expanded with actual reminder scanning."""

    def __init__(self) -> None:
        self._task: asyncio.Task[None] | None = None
        self._stop_event = asyncio.Event()
        self._poll_interval = settings.reminder_poll_interval
        self._callbacks: list[Callable[[], Awaitable[None]]] = []
        self._pending: set[str] = set()

    def register_callback(self, callback: Callable[[], Awaitable[None]]) -> None:
        self._callbacks.append(callback)

    async def enqueue_reminder(self, reminder_id: str) -> None:
        self._pending.add(reminder_id)
        logger.info("Queued reminder %s", reminder_id)

    async def cancel_reminder(self, reminder_id: str) -> None:
        if reminder_id in self._pending:
            self._pending.discard(reminder_id)
            logger.info("Cancelled pending reminder %s", reminder_id)

    def start(self) -> None:
        if self._task is None or self._task.done():
            self._stop_event.clear()
            self._task = asyncio.create_task(self._run())
            logger.info("Reminder scheduler started")

    async def stop(self) -> None:
        if self._task is not None:
            self._stop_event.set()
            await self._task
            self._task = None
            logger.info("Reminder scheduler stopped")

    async def _run(self) -> None:
        while not self._stop_event.is_set():
            await self._dispatch_callbacks()
            try:
                await asyncio.wait_for(self._stop_event.wait(), timeout=self._poll_interval)
            except asyncio.TimeoutError:
                continue

    async def _dispatch_callbacks(self) -> None:
        if self._pending:
            logger.info("Processing %d pending reminders", len(self._pending))
            self._pending.clear()
        for callback in self._callbacks:
            try:
                await callback()
            except Exception:  # pylint: disable=broad-except
                logger.exception("Reminder callback execution failed")


scheduler = ReminderScheduler()
