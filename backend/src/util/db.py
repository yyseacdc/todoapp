from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from ..config.settings import settings


class Base(DeclarativeBase):
    """Declarative base class for ORM models."""


_engine: AsyncEngine | None = None
_session_maker: async_sessionmaker[AsyncSession] | None = None


def get_engine() -> AsyncEngine:
    global _engine
    if _engine is None:
        _engine = create_async_engine(settings.database_url, future=True, echo=False)
    return _engine


def get_session_maker() -> async_sessionmaker[AsyncSession]:
    global _session_maker
    if _session_maker is None:
        _session_maker = async_sessionmaker(get_engine(), expire_on_commit=False)
    return _session_maker


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    session_factory = get_session_maker()
    async with session_factory() as session:
        yield session
