import logging

from fastapi import FastAPI

from .api import api_router
from .config.settings import settings
from .services.reminder_scheduler import scheduler
from .util.db import Base, get_engine

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    openapi_url=f"{settings.api_prefix}/openapi.json",
    docs_url=f"{settings.api_prefix}/docs",
)
app.include_router(api_router, prefix=settings.api_prefix)


@app.get("/health", tags=["health"])  # pragma: no cover - simple sanity endpoint
async def health_check() -> dict[str, str]:
    """Return service liveness indicator."""
    return {"status": "ok"}


@app.on_event("startup")
async def on_startup() -> None:
    logging.basicConfig(level=logging.INFO)
    engine = get_engine()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    scheduler.start()


@app.on_event("shutdown")
async def on_shutdown() -> None:
    await scheduler.stop()
    engine = get_engine()
    await engine.dispose()
