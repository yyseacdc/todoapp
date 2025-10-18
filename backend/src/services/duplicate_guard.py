from datetime import datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.task import Task

WINDOW_MINUTES = 5


def normalize_title(title: str) -> str:
    return ' '.join(title.strip().split()).lower()


async def find_recent_duplicate(session: AsyncSession, title: str) -> Task | None:
    normalized = normalize_title(title)
    cutoff = datetime.utcnow() - timedelta(minutes=WINDOW_MINUTES)
    stmt = (
        select(Task)
        .where(Task.created_at >= cutoff)
        .where(func.lower(Task.title) == normalized)
    )
    result = await session.execute(stmt)
    return result.scalar_one_or_none()
