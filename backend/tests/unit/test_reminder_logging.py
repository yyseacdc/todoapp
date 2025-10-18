import asyncio

import pytest

from src.services.reminder_scheduler import scheduler


@pytest.mark.asyncio
async def test_scheduler_registers_and_invokes_callbacks():
    events: list[str] = []

    scheduler._callbacks.clear()  # type: ignore[attr-defined]
    scheduler._pending.clear()  # type: ignore[attr-defined]

    async def callback() -> None:
        events.append('triggered')
        await scheduler.stop()

    scheduler.register_callback(callback)
    scheduler.start()
    await asyncio.sleep(0.1)
    assert 'triggered' in events
