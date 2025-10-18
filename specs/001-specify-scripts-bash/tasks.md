---
description: "Task list for Modern Todo Reminders implementation"
---

# Tasks: Modern Todo Reminders

**Input**: Design documents from `/specs/001-specify-scripts-bash/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are MANDATORY per the constitution. Write and commit them FIRST; ensure they fail before any implementation task starts.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure directories in `frontend/`, `backend/`, and `contracts/openapi/`
- [X] T002 Scaffold Vite + React + TypeScript app in `frontend/package.json` and baseline source files
- [X] T003 Configure Tailwind CSS setup in `frontend/tailwind.config.ts` and `frontend/postcss.config.cjs`
- [X] T004 Add ESLint + Prettier configs in `frontend/.eslintrc.cjs` and `frontend/.prettierrc`
- [X] T005 Install Storybook with minimal setup in `frontend/.storybook/main.ts`
- [X] T006 Initialize FastAPI application entrypoint in `backend/src/main.py`
- [X] T007 Define backend dependencies in `backend/requirements.txt` and lock file
- [X] T008 Add backend environment template and settings module in `backend/.env.example` and `backend/src/config/settings.py`
- [X] T009 Author Dockerfiles for frontend and backend plus `docker-compose.yml` at repo root
- [X] T010 Configure repository pre-commit hooks in `.pre-commit-config.yaml` covering lint, type-check, accessibility snapshots

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T011 Create shared Tailwind design tokens in `frontend/src/styles/tokens.ts`
- [X] T012 [P] Set up accessibility testing harness in `frontend/tests/setup/a11y.ts`
- [X] T013 Configure Vitest and Playwright baselines in `frontend/vitest.config.ts` and `frontend/playwright.config.ts`
- [X] T014 [P] Add API client generation scaffold in `frontend/src/services/api/client.ts`
- [X] T015 Implement database session and Base metadata in `backend/src/util/db.py`
- [X] T016 Configure Alembic environment and base migration in `backend/alembic/env.py` and `backend/alembic/versions/0001_initial.py`
- [X] T017 Scaffold FastAPI routing package in `backend/src/api/__init__.py` and `backend/src/api/routes/__init__.py`
- [X] T018 Implement reminder scheduler skeleton in `backend/src/services/reminder_scheduler.py`
- [X] T019 Create WebSocket connection manager in `backend/src/api/routes/ws.py`
- [X] T020 Add telemetry instrumentation utilities in `backend/src/util/telemetry.py`
- [X] T021 Define feature flag configuration in `backend/src/config/flags.py` and `frontend/src/services/config.ts`
- [X] T022 Configure CI pipeline for lint/test/a11y/perf in `.github/workflows/ci.yml`
- [X] T023 [P] Build offline queue storage module using IndexedDB in `frontend/src/services/offlineQueue.ts`
- [X] T024 [P] Add Vitest unit tests for offline queue behavior in `frontend/tests/services/offlineQueue.test.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Capture Tasks with Reminders (Priority: P1) 🎯 MVP

**Goal**: Allow users to create tasks with optional reminders, handle duplicates, support offline queueing, and log reminder delivery activity.

**Independent Test**: Using Playwright, create a task with a reminder while online and offline, verify duplicate title confirmation, ensure the task appears in the active list with reminder metadata, and confirm ReminderActivity logging via API.

### Tests for User Story 1 (WRITE FIRST) ✅

- [X] T025 [P] [US1] Write Vitest component tests for TaskForm covering validation, duplicate confirmation, and offline chip in `frontend/tests/components/TaskForm.test.tsx`
- [X] T026 [P] [US1] Write Playwright end-to-end spec for task creation (online/offline with reminder) in `frontend/tests/e2e/task-create-reminder.spec.ts`
- [X] T027 [P] [US1] Write FastAPI contract tests for `POST /tasks` and reminder scheduling in `backend/tests/contract/test_create_task.py`
- [X] T028 [P] [US1] Write backend unit tests for reminder scheduler logging to ReminderActivity in `backend/tests/unit/test_reminder_logging.py`
- [X] T029 [US1] Enforce coverage thresholds (≥90% touched files, 100% reminder utilities) in `frontend/package.json` and `backend/pyproject.toml`

### Implementation for User Story 1

- [X] T030 [US1] Implement `Task` model with fields and constraints from spec in `backend/src/models/task.py`
- [X] T031 [US1] Implement `Reminder` model with scheduling constraints in `backend/src/models/reminder.py`
- [X] T032 [US1] Create Alembic migration for tasks and reminders in `backend/alembic/versions/0002_create_tasks_and_reminders.py`
- [X] T033 [US1] Implement `ReminderActivity` model with indexes in `backend/src/models/reminder_activity.py`
- [X] T034 [US1] Create Alembic migration for reminder activity table in `backend/alembic/versions/0003_create_reminder_activity.py`
- [X] T035 [P] [US1] Implement Pydantic schemas for tasks, reminders, and reminder activity in `backend/src/api/schemas/task.py`
- [X] T036 [US1] Implement duplicate title guard service in `backend/src/services/duplicate_guard.py`
- [X] T037 [US1] Implement task service create logic with duplicate confirmation and offline flags in `backend/src/services/task_service.py`
- [X] T038 [US1] Add `POST /tasks` endpoint with confirmation response handling in `backend/src/api/routes/tasks.py`
- [X] T039 [US1] Integrate reminder scheduler enqueue and delivery logging in `backend/src/services/reminder_scheduler.py`
- [X] T040 [P] [US1] Generate typed API client methods for task creation and duplicate confirmation in `frontend/src/services/api/tasksClient.ts`
- [X] T041 [P] [US1] Build TaskForm component using design tokens with duplicate confirmation modal in `frontend/src/components/TaskForm.tsx`
- [X] T042 [US1] Implement offline queue hook flushing pending tasks in `frontend/src/hooks/useOfflineQueue.ts`
- [X] T043 [US1] Update dashboard to display sync pending status and reminder metadata in `frontend/src/pages/Dashboard.tsx`
- [X] T044 [P] [US1] Implement reminder toast/notification UI in `frontend/src/components/ReminderToast.tsx`
- [X] T045 [US1] Update tasks state hook to merge WebSocket updates and offline queue in `frontend/src/hooks/useTasks.ts`
- [X] T046 [US1] Instrument analytics events for task creation and reminder scheduling in `frontend/src/services/analytics.ts`
- [X] T047 [US1] Document Storybook stories and visual tests for TaskForm (online/offline/duplicate) in `frontend/src/components/TaskForm.stories.tsx`
- [X] T048 [US1] Record ADR covering reminder scheduling, duplicate guard, and offline queue design in `docs/adrs/001-reminder-scheduling-offline.md`

**Checkpoint**: User Story 1 delivers MVP slice (task creation + reminders + logging) ready for demo behind feature flag.

---

## Phase 4: User Story 2 - Complete and Organize Tasks (Priority: P2)

**Goal**: Enable users to complete, undo, or delete tasks while keeping reminders and history consistent with analytics tracking.

**Independent Test**: Using Playwright, toggle a task as completed, undo within 30 seconds, and delete another task ensuring reminders are cancelled, history updates, and analytics fire.

### Tests for User Story 2 (WRITE FIRST) ✅

- [X] T049 [P] [US2] Write Vitest component tests for TaskCard completion states in `frontend/tests/components/TaskCard.test.tsx`
- [X] T050 [P] [US2] Write Playwright spec for completion, undo, and delete flows in `frontend/tests/e2e/task-complete.spec.ts`
- [X] T051 [P] [US2] Write backend integration tests for completion and deletion endpoints in `backend/tests/integration/test_complete_task.py`

### Implementation for User Story 2

- [X] T052 [US2] Extend task service with completion, undo, and delete logic in `backend/src/services/task_service.py`
- [X] T053 [US2] Add `/tasks/{id}/complete` and `/tasks/{id}/undo` endpoints in `backend/src/api/routes/tasks.py`
- [X] T054 [US2] Implement guarded delete endpoint with reminder confirmation in `backend/src/api/routes/tasks.py`
- [X] T055 [P] [US2] Update API client with completion and delete methods in `frontend/src/services/api/tasksClient.ts`
- [X] T056 [P] [US2] Update TaskCard component with new states and reduced-motion animations in `frontend/src/components/TaskCard.tsx`
- [X] T057 [US2] Render completed tasks section with timestamps in `frontend/src/pages/Dashboard.tsx`
- [X] T058 [US2] Instrument analytics events for completion and deletion in `frontend/src/services/analytics.ts`
- [X] T059 [US2] Refresh TaskCard Storybook stories and visual regression in `frontend/src/components/TaskCard.stories.tsx`
- [X] T060 [US2] Cancel or reschedule reminders on completion/deletion in `backend/src/services/reminder_scheduler.py`
- [X] T061 [US2] Capture task lifecycle ADR updates in `docs/adrs/002-task-completion.md`

**Checkpoint**: User Story 2 enables independent management of task lifecycle with analytics instrumentation.

---

## Phase 5: User Story 3 - Review Upcoming Reminders (Priority: P3)

**Goal**: Provide a reminders panel showing upcoming alerts with snooze/dismiss actions, reminder activity feed, and real-time updates.

**Independent Test**: Using Playwright, verify reminders panel lists upcoming reminders chronologically, supports snooze/dismiss, reflects updates instantly, and exposes reminder activity logs.

### Tests for User Story 3 (WRITE FIRST) ✅

- [X] T062 [P] [US3] Write Vitest tests for RemindersPanel component sorting and accessibility in `frontend/tests/components/RemindersPanel.test.tsx`
- [X] T063 [P] [US3] Write Playwright spec for reminders panel interactions in `frontend/tests/e2e/reminders-panel.spec.ts`
- [X] T064 [P] [US3] Write backend integration tests for upcoming reminders, snooze/dismiss, and `GET /reminders/activity` in `backend/tests/integration/test_reminders_panel.py`

### Implementation for User Story 3

- [X] T065 [US3] Implement reminder query services for upcoming view in `backend/src/services/reminder_service.py`
- [X] T066 [US3] Add `GET /reminders/upcoming` endpoint in `backend/src/api/routes/reminders.py`
- [X] T067 [US3] Add snooze and dismiss endpoints in `backend/src/api/routes/reminders.py`
- [X] T068 [US3] Implement `GET /reminders/activity` endpoint with pagination in `backend/src/api/routes/reminders.py`
- [X] T069 [US3] Broadcast reminder updates and activity events over WebSocket in `backend/src/services/reminder_scheduler.py`
- [X] T070 [P] [US3] Build RemindersPanel UI with virtualization in `frontend/src/components/RemindersPanel.tsx`
- [X] T071 [US3] Integrate reminders panel into dashboard layout in `frontend/src/pages/Dashboard.tsx`
- [X] T072 [P] [US3] Implement reminder row actions and state hook in `frontend/src/components/ReminderRow.tsx`
- [X] T073 [US3] Extend analytics tracking for panel engagement and activity views in `frontend/src/services/analytics.ts`
- [X] T074 [US3] Add RemindersPanel Storybook stories and visual checks in `frontend/src/components/RemindersPanel.stories.tsx`
- [X] T075 [US3] Log performance findings for reminder workload and activity feed in `docs/performance/reminders.md`

**Checkpoint**: User Story 3 delivers full reminders overview with actionable controls, activity feed, and telemetry.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T076 [P] Update onboarding instructions in `specs/001-specify-scripts-bash/quickstart.md` with final commands and flags
- [ ] T077 Run Lighthouse CI and archive report in `frontend/reports/lighthouse.md`
- [ ] T078 Execute Locust smoke tests and record metrics in `backend/tests/perf/results.md`
- [ ] T079 [P] Harden Docker Compose for production profiles in `docker-compose.yml`
- [ ] T080 Perform security audit and document findings in `docs/security/audit.md`
- [ ] T081 Assemble release notes with screenshots in `docs/release-notes.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** → foundational tasks
- **Foundational (Phase 2)** → unlocks User Stories 1–3
- **User Story 1 (P1)** → MVP; required before US2 and US3 to ensure shared models/services exist
- **User Story 2 (P2)** → depends on US1 entities but can proceed once its tests are authored
- **User Story 3 (P3)** → depends on US1 reminder infrastructure and activity logging; can start after foundational tasks and US1 tests are created
- **Polish Phase** → runs after desired user stories are complete

### User Story Dependencies

- US1: No story dependencies
- US2: Depends on US1 data structures and reminder cancellation hooks
- US3: Depends on US1 reminder scheduling, activity logging, and WebSocket infrastructure

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- UI wiring after API readiness
- Story complete before moving to next priority

### Parallel Opportunities

- Parallelize tasks marked `[P]` such as component tests, API client updates, and UI builds
- Tests within a story can run concurrently once scoped
- Different developers can own separate user stories after foundational completion (subject to dependencies above)

## Parallel Example: User Story 1

```bash
# Run in parallel after writing tests:
Task: "T025 [P] [US1] Write Vitest component tests for TaskForm covering validation, duplicate confirmation, and offline chip in frontend/tests/components/TaskForm.test.tsx"
Task: "T026 [P] [US1] Write Playwright end-to-end spec for task creation (online/offline with reminder) in frontend/tests/e2e/task-create-reminder.spec.ts"
Task: "T027 [P] [US1] Write FastAPI contract tests for POST /tasks and reminder scheduling in backend/tests/contract/test_create_task.py"

# Parallel implementation once tests exist:
Task: "T040 [P] [US1] Generate typed API client methods for task creation and duplicate confirmation in frontend/src/services/api/tasksClient.ts"
Task: "T041 [P] [US1] Build TaskForm component using design tokens with duplicate confirmation modal in frontend/src/components/TaskForm.tsx"
Task: "T044 [P] [US1] Implement reminder toast/notification UI in frontend/src/components/ReminderToast.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup  
2. Complete Phase 2: Foundational (blocking)  
3. Author and run User Story 1 tests (T025–T028) to confirm they fail  
4. Implement US1 (T030–T048) until tests pass, ReminderActivity logs emit, and Lighthouse targets met  
5. Validate accessibility, duplicate confirmation, offline sync, and reminder delivery; demo MVP slice

### Incremental Delivery

1. Deliver US1 as MVP behind feature flag  
2. Enable US2 to add task lifecycle management; release after independent validation  
3. Layer US3 reminders panel and activity feed; release when telemetry + performance goals met  
4. Finish with Polish phase to finalize docs, performance, and deployment hardening

### Parallel Team Strategy

1. Shared team executes Setup + Foundational tasks  
2. Assign US1 to Developer A, US2 to Developer B, US3 to Developer C (tests first)  
3. Coordinate via feature flags and shared contracts; merge once each slice passes tests and audits

---

## Notes

- [P] tasks = different files, no dependencies  
- [Story] label maps task to specific user story for traceability  
- Ensure screenshots or GIFs accompany PRs per governance  
- Attach ADR updates, coverage reports, and performance journals to relevant PRs  
- Keep dependency footprint minimal; evaluate new packages against constitution before adding
