import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_complete_undo_and_delete_task(client: AsyncClient):
    create_payload = {
        "title": "Write status update",
        "reminder": {"scheduledFor": "2025-10-21T10:00:00Z"}
    }
    response = await client.post("/v1/tasks", json=create_payload)
    assert response.status_code == 201
    task = response.json()
    task_id = task["id"]

    # Complete the task
    response = await client.post(f"/v1/tasks/{task_id}/complete")
    assert response.status_code == 200
    completed_task = response.json()
    assert completed_task["status"] == "completed"
    assert completed_task["completedAt"] is not None

    # Undo completion
    response = await client.post(f"/v1/tasks/{task_id}/undo")
    assert response.status_code == 200
    undone_task = response.json()
    assert undone_task["status"] == "active"
    assert undone_task["completedAt"] is None

    # Delete task
    response = await client.delete(f"/v1/tasks/{task_id}")
    assert response.status_code == 204
