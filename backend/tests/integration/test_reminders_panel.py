import asyncio
from datetime import datetime, timedelta

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_upcoming_snooze_and_dismiss(client: AsyncClient):
    create_response = await client.post(
        "/v1/tasks",
        json={
            "title": "Prepare slides",
            "reminder": {"scheduledFor": (datetime.utcnow() + timedelta(minutes=5)).replace(microsecond=0).isoformat() + "Z"}
        },
    )
    assert create_response.status_code == 201
    task = create_response.json()
    reminder_id = task["reminder"]["id"]

    upcoming = await client.get("/v1/reminders/upcoming")
    data = upcoming.json()["data"]
    assert any(item["id"] == reminder_id for item in data)

    snooze_time = (datetime.utcnow() + timedelta(minutes=30)).replace(microsecond=0)
    snooze_response = await client.post(
        f"/v1/reminders/{reminder_id}/snooze",
        json={"snoozeUntil": snooze_time.isoformat() + "Z"},
    )
    assert snooze_response.status_code == 200
    assert snooze_response.json()["snoozeUntil"].startswith(snooze_time.isoformat())

    dismiss_response = await client.post(f"/v1/reminders/{reminder_id}/dismiss")
    assert dismiss_response.status_code == 204

    refreshed = await client.get("/v1/reminders/upcoming")
    refreshed_data = refreshed.json()["data"]
    assert all(item["id"] != reminder_id for item in refreshed_data)

    activity = await client.get("/v1/reminders/activity", params={"reminderId": reminder_id})
    activity_entries = activity.json()["data"]
    assert len(activity_entries) >= 2
