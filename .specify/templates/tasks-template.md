---
description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are MANDATORY per the constitution. Write and commit them FIRST; ensure they fail before any implementation task starts.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

<!-- 
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
  
  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/
  
  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment
  
  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize TypeScript + React + Vite frontend and configure shared design system tokens
- [ ] T003 Initialize backend/API layer (if required) with typed client scaffolding
- [ ] T004 [P] Configure linting, formatting, type checking, and automated accessibility checks (axe, eslint-plugin-jsx-a11y)
- [ ] T005 [P] Configure CI workflow to run lint, type check, unit, component, integration, and accessibility suites on all pushes
- [ ] T006 [P] Install and enforce pre-commit hooks for lint, formatting, type-check, and accessibility snapshots

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Setup database schema and migrations framework
- [ ] T005 [P] Implement authentication/authorization framework
- [ ] T006 [P] Setup API routing and middleware structure
- [ ] T007 Create base models/entities that all stories depend on
- [ ] T008 Configure error handling and logging infrastructure
- [ ] T009 Setup environment configuration management
- [ ] T010 Establish shared component library with Storybook (or equivalent) and baseline visual regression tests
- [ ] T011 Document performance budgets and configure bundle analysis tooling
- [ ] T012 Configure static analysis/security scanning (e.g., npm audit, dependency review) inside CI
- [ ] T013 Create architecture decision record (ADR) index and template for feature documentation

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 (WRITE FIRST) ✅

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T012 [P] [US1] Component test for [UI element] in frontend/tests/components/[name].test.tsx
- [ ] T013 [P] [US1] Accessibility regression test (axe/lighthouse) for [user flow]
- [ ] T014 [P] [US1] Contract test for [endpoint] in tests/contract/test_[name].ts
- [ ] T015 [P] [US1] Integration test for [user journey] in tests/integration/[name].test.ts
- [ ] T016 [US1] Configure coverage thresholds (≥90% touched files) and add coverage assertions for this story

### Implementation for User Story 1

- [ ] T017 [P] [US1] Create [Entity1] model in src/models/[entity1].ts
- [ ] T018 [P] [US1] Create [Entity2] model in src/models/[entity2].ts
- [ ] T019 [US1] Implement [Service] in src/services/[service].ts (depends on T017, T018)
- [ ] T020 [US1] Implement [endpoint/feature] in src/[location]/[file].ts(x)
- [ ] T021 [US1] Wire UI component in frontend/src/components/[component].tsx using design tokens and responsive breakpoints
- [ ] T022 [US1] Add validation, optimistic updates, and error handling
- [ ] T023 [US1] Capture analytics events for [key interactions]
- [ ] T024 [US1] Update Storybook stories and visual regression baselines
- [ ] T025 [US1] Update or author ADR covering architectural decisions introduced in this story
- [ ] T026 [US1] Record Lighthouse/performance results and compare against budgets

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (WRITE FIRST) ✅

- [ ] T024 [P] [US2] Component test for [UI element] in frontend/tests/components/[name].test.tsx
- [ ] T025 [P] [US2] Accessibility regression test (axe/lighthouse) for [user flow]
- [ ] T026 [P] [US2] Contract test for [endpoint] in tests/contract/test_[name].ts
- [ ] T027 [P] [US2] Integration test for [user journey] in tests/integration/[name].test.ts
- [ ] T028 [US2] Validate coverage thresholds maintained and update coverage reports

### Implementation for User Story 2

- [ ] T029 [P] [US2] Create [Entity] model in src/models/[entity].ts
- [ ] T030 [US2] Implement [Service] in src/services/[service].ts
- [ ] T031 [US2] Implement [endpoint/feature] in src/[location]/[file].ts(x)
- [ ] T032 [US2] Integrate with User Story 1 components (if needed)
- [ ] T033 [US2] Update analytics and telemetry to capture new events
- [ ] T034 [US2] Refresh Storybook stories and visual regression baselines
- [ ] T035 [US2] Update ADRs or design notes capturing cross-story architectural impacts
- [ ] T036 [US2] Run Lighthouse/performance checks and log deltas

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (WRITE FIRST) ✅

- [ ] T034 [P] [US3] Component test for [UI element] in frontend/tests/components/[name].test.tsx
- [ ] T035 [P] [US3] Accessibility regression test (axe/lighthouse) for [user flow]
- [ ] T036 [P] [US3] Contract test for [endpoint] in tests/contract/test_[name].ts
- [ ] T037 [P] [US3] Integration test for [user journey] in tests/integration/[name].test.ts
- [ ] T038 [US3] Confirm performance budgets remain within thresholds and capture report

### Implementation for User Story 3

- [ ] T039 [P] [US3] Create [Entity] model in src/models/[entity].ts
- [ ] T040 [US3] Implement [Service] in src/services/[service].ts
- [ ] T041 [US3] Implement [endpoint/feature] in src/[location]/[file].ts(x)
- [ ] T042 [US3] Sync analytics, performance instrumentation, and documentation updates
- [ ] T043 [US3] Capture ADR updates or link to existing decisions
- [ ] T044 [US3] Update performance journal with findings

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Additional unit tests (if requested) in tests/unit/
- [ ] TXXX Security hardening
- [ ] TXXX Run quickstart.md validation
- [ ] TXXX Re-run Lighthouse/performance budgets and update documentation
- [ ] TXXX Conduct code quality audit (lint, dead code scan) and remediate blockers

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch mandatory tests for User Story 1 together:
Task: "Contract test for [endpoint] in tests/contract/test_[name].ts"
Task: "Integration test for [user journey] in tests/integration/test_[name].test.ts"

# Launch all models for User Story 1 together:
Task: "Create [Entity1] model in src/models/[entity1].ts"
Task: "Create [Entity2] model in src/models/[entity2].ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Author and run User Story 1 tests (all failing) before implementation
4. Complete Phase 3: User Story 1 until all tests pass
5. **STOP and VALIDATE**: Run accessibility + performance budgets and demo
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Write tests first → Make tests pass → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Write tests first → Make tests pass → Test independently → Deploy/Demo
4. Add User Story 3 → Write tests first → Make tests pass → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (owns tests + implementation)
   - Developer B: User Story 2 (owns tests + implementation)
   - Developer C: User Story 3 (owns tests + implementation)
3. Stories complete and integrate independently, each behind a feature flag until validated

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Capture screenshots/gifs for each story and attach to PR per governance rules
- Ensure ADR updates, coverage reports, and performance journals are attached to PR descriptions
