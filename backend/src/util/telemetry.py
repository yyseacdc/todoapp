import logging
from typing import Any

logger = logging.getLogger('telemetry')


def log_event(event: str, *, payload: dict[str, Any] | None = None) -> None:
    logger.info("event=%s payload=%s", event, payload or {})


def log_error(event: str, *, error: Exception, payload: dict[str, Any] | None = None) -> None:
    logger.error("event=%s payload=%s error=%s", event, payload or {}, error, exc_info=True)
