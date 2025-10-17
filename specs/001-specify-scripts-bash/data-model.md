# Data Model: Modern Todo Reminders

## Overview
Lightweight relational schema backing task management, reminder scheduling, and activity tracking using SQLite (WAL mode). Models leverage SQLAlchemy 2.0 declarative mappings with Pydantic DTOs for API contracts.

## Entities

### Task
- **Primary Key**: `id` (UUID, stored as TEXT)
- **Fields**:
  - `title` (TEXT, 1-120 chars, trimmed)
  - `notes` (TEXT, optional, max 2000 chars)
  - `due_at` (TIMESTAMP WITH TIMEZONE, optional)
  - `priority` (ENUM: `low`, `normal`, `high`; default `normal`)
  - `status` (ENUM: `active`, `completed`, `deleted`; default `active`)
  - `created_at` (TIMESTAMP WITH TIMEZONE, default current)
  - `updated_at` (TIMESTAMP WITH TIMEZONE, auto-managed)
  - `completed_at` (TIMESTAMP WITH TIMEZONE, nullable)
  - `reminder_id` (FK → Reminder.id, nullable)
  - `user_id` (UUID TEXT, ties to auth service; assumption: provided by upstream)
- **Relationships**:
  - One-to-one with `Reminder` (optional)
  - One-to-many with `ReminderActivity` (through Reminder)
- **Validation**:
  - Titles sanitized against duplicate whitespace; duplicates within 5 minutes trigger confirmation (handled at service layer).
  - When `status = completed`, `completed_at` must be set and `reminder_id` nullified.
  - When `status = deleted`, soft-delete logic ensures record retained but excluded from default queries.
- **State Transitions**:
  - `active` → `completed`: allowed; sets `completed_at`, cancels reminder.
  - `completed` → `active`: allowed via undo; clears `completed_at`, reinstates reminder if provided.
  - `active/completed` → `deleted`: allowed; cascades to mark reminder cancelled.

### Reminder
- **Primary Key**: `id` (UUID TEXT)
- **Fields**:
  - `task_id` (FK → Task.id, unique)
  - `scheduled_for` (TIMESTAMP WITH TIMEZONE, future constraint)
  - `channel` (ENUM: `in_app` default; placeholder for future expansion)
  - `status` (ENUM: `scheduled`, `sent`, `cancelled`, `snoozed`)
  - `snooze_until` (TIMESTAMP WITH TIMEZONE, nullable, must be > current time if set)
  - `created_at`, `updated_at`
- **Relationships**:
  - One-to-one with `Task`
  - One-to-many with `ReminderActivity`
- **Validation**:
  - `scheduled_for` must be ≥ current time + 1 minute (prevent past reminders).
  - `status` changes enforced by service rules (e.g., only `scheduled` reminders can become `sent`).

### ReminderActivity
- **Primary Key**: `id` (UUID TEXT)
- **Fields**:
  - `reminder_id` (FK → Reminder.id, indexed)
  - `event_type` (ENUM: `delivered`, `dismissed`, `snoozed`, `error`)
  - `event_time` (TIMESTAMP WITH TIMEZONE)
  - `metadata` (JSONB-like TEXT storing key-value pairs, optional)
- **Indexes**: `(reminder_id, event_time)` composite index for chronological queries
- **Relationships**:
  - Many-to-one to `Reminder`
- **Validation**:
  - `event_time` auto-populated at insert.
  - `metadata` validated against JSON schema ensuring keys (`channel`, `error_code`, etc.) if present.
- **Usage**:
  - Delivery scheduler logs `delivered` or `error` events.
  - User interactions (dismiss, snooze) append entries for audit and engagement analytics.

### UserPreference (Read-only reference)
- **Primary Key**: `user_id` (UUID TEXT)
- **Fields**:
  - `default_reminder_offset_minutes` (INTEGER default 30)
  - `timezone` (TEXT, Olson format)
  - `notification_channels` (JSON array; currently supports `in_app`)
- **Purpose**: Sourced from broader platform; consumed to determine scheduling defaults. No write endpoints in this feature.

- **OfflineTaskQueueEntry (Frontend Local Storage)**
  - Stored via IndexedDB under `todo-offline-queue`.
  - Fields: `clientId` (UUID), `payload` (task + reminder data), `createdAt`, `retryCount`, `lastAttemptAt`.
  - Sync service flushes entries when connectivity restored; successful sync removes entry, failures increment retry count (max 3 then surface error).

## Derived Views / Materialized Data
- **Upcoming Reminders View**: Query combining `Task`, `Reminder` for `status = scheduled` within next 48 hours, ordered by `scheduled_for`.
- **Completed Tasks View**: Filter `Task` with `status = completed`, sorted by `completed_at` desc for history tab.
- **Reminder Activity Feed**: Join `ReminderActivity` with `Task` to expose latest user-visible events in reminders panel.

## Data Integrity Rules
- Cascading rules: deleting a task (`status = deleted`) sets associated reminder `status = cancelled` and prevents further scheduling. Hard deletes run via nightly maintenance job outside MVP scope.
- Reminders cannot exist without associated Task; enforce via FK constraint with cascade delete.
- ReminderActivity entries cannot be added once reminder is `cancelled` unless event_type = `error` for logging.

## Migrations Strategy
- Use Alembic auto-generated migrations with manual review to ensure minimal SQL footprint.
- Initialize base migration creating tables and necessary indexes (`task_due_at_idx`, `reminder_scheduled_idx`, `activity_reminder_idx`).
- Future schema changes must document ADR updates and migration rollback plans.
