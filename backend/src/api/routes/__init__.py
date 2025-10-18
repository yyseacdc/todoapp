from fastapi import APIRouter

from . import ws
from . import tasks

router = APIRouter()
router.include_router(tasks.router, tags=['tasks'])
router.include_router(ws.router, prefix='/ws', tags=['ws'])

__all__ = ['router']
