from fastapi import FastAPI

from .config.settings import settings

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    openapi_url=f"{settings.api_prefix}/openapi.json",
    docs_url=f"{settings.api_prefix}/docs",
)


@app.get("/health", tags=["health"])  # pragma: no cover - simple sanity endpoint
async def health_check() -> dict[str, str]:
    """Return service liveness indicator."""
    return {"status": "ok"}
