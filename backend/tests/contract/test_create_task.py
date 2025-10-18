from httpx import AsyncClient


async def test_create_task_with_reminder(client: AsyncClient) -> None:
    payload = {
        "title": "Doctor appointment",
        "reminder": {"scheduledFor": "2025-10-21T09:00:00Z"}
    }
    response = await client.post('/v1/tasks', json=payload)
    assert response.status_code == 201
    body = response.json()
    assert body['title'] == payload['title']
