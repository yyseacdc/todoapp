from fastapi import APIRouter

from . import reminders, tasks, ws

router = APIRouter()
router.include_router(tasks.router, tags=['tasks'])
router.include_router(reminders.router, tags=['reminders'])
router.include_router(ws.router, prefix='/ws', tags=['ws'])

__all__ = ['router']
