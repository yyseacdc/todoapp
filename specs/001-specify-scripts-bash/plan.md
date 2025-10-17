# Implementation Plan: Modern Todo Reminders

**Branch**: `001-specify-scripts-bash` | **Date**: 2025-10-17 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-specify-scripts-bash/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Deliver a lightweight, modern todo web application that lets users capture tasks with reminders (including duplicate confirmation and offline queueing), complete or delete tasks, and review upcoming reminders with auditable activity logs. The solution must emphasize minimal dependencies: React + Tailwind on the frontend, FastAPI with SQLite on the backend, and containerized deployment with Docker while preserving accessibility, test-first development, and performance budgets defined in the constitution and feature spec.

## Technical Context

**Language/Version**: TypeScript 5.x (frontend), Python 3.12 (backend)  
**Primary Dependencies**: React 18, Vite, Tailwind CSS, FastAPI, Pydantic, SQLAlchemy 2.x (minimal usage), Alembic (schema migrations), IndexedDB (via lightweight wrapper) for offline queue persistence  
**Storage**: SQLite (lightweight relational DB) with file persistence and WAL mode  
**Testing**: Vitest + React Testing Library (component), Playwright (accessibility + e2e), pytest + pytest-asyncio + HTTPX (API), coverage thresholds ≥90% touched files  
**Target Platform**: Responsive web app served via containerized FastAPI backend with static frontend assets, Dockerized deployment  
**Project Type**: Web application with separate frontend (`frontend/`) and backend (`backend/`) projects plus shared contracts  
**Performance Goals**: Dashboard Lighthouse ≥90 (performance) / ≥95 (accessibility); reminder delivery ≤60 s; task toggle <200 ms; initial page load <1.8 s on 3G Fast; per-route bundle ≤150 KB  
**Constraints**: Minimal third-party libraries beyond mandated stack; Docker-based dev/test/prod parity; WCAG 2.1 AA compliance; offline task queueing for reminders using IndexedDB; vertical slices behind feature flags; reminder delivery activity must be logged for auditing  
**Scale/Scope**: MVP for individual productivity with ~1k active reminders per user; three primary user stories; single engineering squad

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Consistent, Accessible Experience**: Tailwind tokens defined centrally (`frontend/src/styles/tokens.ts`) and enforced via Storybook, Vitest a11y assertions, and Playwright AXE audits prior to merge. Responsive breakpoints (mobile/tablet/desktop) verified per acceptance scenarios, including offline “Sync pending” status accessibility.  
- **Component-Driven Web Architecture**: React + TypeScript component library with colocated stories/tests; typed API client generated from OpenAPI spec; backend exposes REST endpoints aligning with contracts including `ReminderActivity` routes.  
- **Test-First Delivery**: Before implementation, create failing Vitest component tests, Playwright accessibility/offline checks, and pytest contract/integration suites (including reminder activity logging). Enforce ≥90% coverage on touched files and 100% on reminder scheduling utilities; CI blocks on unmet thresholds.  
- **Production-Grade Code Craftsmanship**: Lint/format via ESLint + Prettier (frontend) and Ruff + Black (backend) with minimal configs. ADRs recorded under `docs/adrs/` for reminder scheduling and Docker decisions. Required peer reviews with checklist covering maintainability, accessibility, performance.  
- **Incremental Value Delivery**: Each user story shipped as vertical slice (task capture, completion flows, reminder dashboard) behind configuration-based feature flags; independent deployments validated through staging.  
- **Performance-Focused Experience**: Performance budgets tracked in `frontend/perf-budget.json`; Lighthouse CI gating; backend load testing via Locust targeting 200 ms p95; reminder polling uses event-driven notifications to prevent bundle bloat; offline sync retries capped to protect battery/perf budgets.  
- **Sustainable Quality Automation**: CI pipeline runs lint, type-check, unit/component/integration tests, Lighthouse, pa11y, npm audit, pip-audit. Telemetry events for creation/completion/reminders and reminder delivery activity feed into analytics dashboard reviewed monthly.

## Project Structure

### Documentation (this feature)

```
specs/001-specify-scripts-bash/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```
backend/
├── src/
│   ├── api/
│   ├── services/
│   ├── models/
│   └── util/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── styles/
└── tests/

contracts/
└── openapi/
```

**Structure Decision**: Adopt the web application split. Frontend assets (including offline queue utilities and analytics) and tests reside under `frontend/`, backend FastAPI service (including reminder activity endpoints) and tests under `backend/`, and generated API contracts shared via `contracts/openapi/` folder.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |

## Constitution Check (Post-Design Review)

- **Consistent, Accessible Experience**: UX flows reference shared Tailwind tokens and accessibility audits (Vitest axe + Playwright). Storybook captures responsive states, including offline sync indicators and duplicate confirmation modal.  
- **Component-Driven Web Architecture**: Design finalized with typed API client generation, offline queue modules, and WebSocket service abstractions; ensures frontend/backend contract alignment across reminder activity endpoints.  
- **Test-First Delivery**: Test suites enumerated per story (frontend component, backend contract, Playwright e2e) cover duplicate confirmation, offline queueing, and reminder activity logging. Coverage targets and CI gates documented in quickstart.  
- **Production-Grade Code Craftsmanship**: Documented ADR requirements for reminder scheduling, offline queue design, and Docker; lint/format tools chosen with minimal configuration; peer review checklist to be enforced.  
- **Incremental Value Delivery**: Feature flags defined in config to enable per-story rollout; data model supports independent slices without cross-story dependencies, including reminder activity logging.  
- **Performance-Focused Experience**: Performance budgets captured in quickstart; load testing via Locust and Lighthouse CI integrated into automation plan; offline sync retry intervals documented.  
- **Sustainable Quality Automation**: CI pipeline scope defined (lint, type-check, unit, integration, coverage, Lighthouse, pa11y, dependency audits); telemetry instrumentation captured in requirements, including ReminderActivity persistence and analytics events.
