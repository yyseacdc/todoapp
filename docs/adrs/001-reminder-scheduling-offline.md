# ADR 001: Reminder Scheduling & Offline Queue Strategy

## Status
Accepted – 2025-10-17

## Context
The Modern Todo Reminders MVP must support:
- Reliable reminder scheduling via the FastAPI backend.
- Duplicate task detection to prevent accidental double entry.
- Offline task creation with automatic sync once connectivity returns.
- Minimal dependencies per project constitution.

## Decision
1. **Reminder scheduling** is handled by a lightweight asyncio loop (`ReminderScheduler`) running inside the FastAPI app. The loop invokes registered callbacks on a configurable interval (default 30 seconds). This avoids heavy task queues while meeting MVP scale.
2. **Duplicate detection** occurs server-side via the `DuplicateGuard` service, normalizing titles and checking for matches within the last five minutes. The API returns HTTP 409 with the existing task payload to enable client confirmation.
3. **Offline queue** uses a small IndexedDB-backed utility (`offlineQueue`) in the frontend. Draft tasks with reminders are stored locally when the app is offline. The queue flushes automatically when connectivity returns, replaying the original payload to the backend.
4. **Telemetry** records task creation and reminder scheduling events (including offline origin) to comply with the constitution's automation principle.

## Consequences
- The scheduler remains lightweight and easy to maintain, though future scaling may require a more robust job system.
- Duplicate logic is centralized, ensuring consistent behaviour across clients.
- IndexedDB keeps offline support dependency-light, but requires additional QA around browser storage availability.
- Observability covers reminder delivery lifecycle from the start, enabling quick detection of regressions.
