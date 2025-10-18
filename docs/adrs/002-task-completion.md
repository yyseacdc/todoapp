# ADR 002: Task Completion & Lifecycle Handling

## Status
Accepted – 2025-10-17

## Context
User Story 2 requires users to complete, undo, and delete tasks while maintaining reminder integrity and analytics coverage. The constitution mandates comprehensive telemetry and minimal dependencies.

## Decision
- Task lifecycle transitions are handled in `TaskService`, providing explicit methods for completion, undo, and deletion.
- Reminders are cancelled or re-scheduled by updating `Reminder` records and logging `ReminderActivity` entries, while delegating background processing to the lightweight scheduler.
- Frontend state is managed through `useTasks`, which updates local state optimistically, synchronises via API clients, and records analytics for completion, undo, and deletion events.
- UI contracts expose a `TaskCard` component and dedicated tests to keep vertical slices independently testable.

## Consequences
- Telemetry coverage now spans the entire lifecycle, supporting constitution compliance and analytics success criteria.
- Reminder cancellation/reschedule ensures no stray notifications after completion or deletion.
- Additional API endpoints and tests increase surface area but provide clearer separation of responsibilities.
- Future work may expand WebSocket payloads to push real-time lifecycle updates without manual refresh.
