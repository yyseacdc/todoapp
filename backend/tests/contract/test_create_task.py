import json
from collections.abc import AsyncIterator

import pytest
from httpx import AsyncClient

from src.main import app


@pytest.fixture
async def client() -> AsyncIterator[AsyncClient]:
    async with AsyncClient(app=app, base_url="http://testserver") as ac:
        yield ac


async def test_create_task_with_reminder(client: AsyncClient) -> None:
    payload = {
        "title": "Doctor appointment",
        "reminder": "2025-10-21T09:00:00Z"
    }
    response = await client.post('/v1/tasks', content=json.dumps(payload))
    assert response.status_code in (201, 409)
