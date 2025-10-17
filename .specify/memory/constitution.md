<!--
Sync Impact Report
Version change: 1.0.0 -> 1.1.0
Modified principles:
- Delightful, Accessible Experience -> Consistent, Accessible Experience
- Test-First Delivery (NON-NEGOTIABLE) (expanded testing standards)
- Sustainable Quality Automation (refocused on automation + telemetry)
Added principles:
- Production-Grade Code Craftsmanship
- Performance-Focused Experience
Added sections:
- none
Removed sections:
- none
Templates requiring updates:
- ✅ Updated: .specify/templates/plan-template.md
- ✅ Updated: .specify/templates/spec-template.md
- ✅ Updated: .specify/templates/tasks-template.md
Follow-up TODOs:
- none
-->
# TodoApp Constitution

## Core Principles

### Consistent, Accessible Experience
- The UI MUST provide a responsive layout that behaves consistently on mobile, tablet, and desktop viewports.
- Visual styling MUST use the shared design tokens, typography scale, spacing system, and motion specs maintained in the design system; ad-hoc styling changes require documented updates to that system.
- Every interactive element MUST meet WCAG 2.1 AA accessibility standards, including keyboard navigation, color contrast, focus management, and semantic markup.
- Interaction patterns (empty states, notifications, dialogs) MUST reuse approved component variants to prevent experience drift across the app.
- Usability validation MUST occur at the end of each user story by running the scripted acceptance scenario against the current build.
Rationale: A modern todo app only succeeds when it is visually polished, predictable, and effortless for every user.

### Component-Driven Web Architecture
- The frontend MUST be implemented with a TypeScript-based, component-driven framework (React + Vite baseline) and colocated story/test files per component.
- State management MUST remain predictable: use React hooks and a single source of truth per view; introduce global stores only when justified in the plan.
- API interactions MUST go through a typed client layer that centralizes network logic, error handling, and caching strategy.
- Styling MUST rely on utility-first CSS (Tailwind or equivalent) or component-scoped styles to preserve consistency and reusability.
Rationale: A modular architecture keeps the experience maintainable while enabling rapid iteration on UI polish.

### Test-First Delivery (NON-NEGOTIABLE)
- No production code MAY be written until a failing automated test (unit, component, or integration) proves the absence of the behavior.
- Each feature MUST include component tests for UI behavior and API contract tests that cover happy path and critical edge cases.
- The red-green-refactor cycle MUST be documented in commit history: add failing test, make it pass, then refactor safely.
- Tests MUST cover the agreed story acceptance criteria with minimum 90% line coverage on touched files and 100% coverage for critical domain utilities.
- Test suites MUST run in CI and locally before review; flaky tests require an immediate fix or quarantine story before merge.
- Pull requests MUST show passing test suites in CI; merges are blocked if any mandatory test is skipped or fails.
Rationale: Test-first discipline guarantees regressions are caught immediately and anchors the development pace to user expectations.

### Production-Grade Code Craftsmanship
- Code MUST remain readable, documented where intent is non-obvious, and conform to the shared linting and formatting rules; lint violations block merges.
- Architectural decisions (component boundaries, state management choices, data shaping) MUST be recorded as ADRs or design notes linked from the change.
- All new code MUST include TypeScript typings with strict null checks and rely on shared utility helpers to avoid duplication.
- Every pull request MUST receive a peer review focused on maintainability, accessibility, and performance implications; unreviewed merges are prohibited.
- Refactoring debt MUST be tracked as backlog items if deferred; no TODO comments may persist without associated work items.
Rationale: Sustainable code quality keeps velocity high and reduces regressions as the product evolves.

### Incremental Value Delivery
- Work MUST be organized into independently deployable vertical slices that map 1:1 to prioritized user stories.
- Each slice MUST deliver a complete user outcome (UI, API hooks, persistence) and ship behind a feature flag if incomplete features remain.
- Backlog prioritization MUST be driven by user and stakeholder feedback captured after every release.
- Documentation for each slice (plan, spec, tasks) MUST reflect the story’s acceptance criteria and trace to implemented tests.
Rationale: Delivering value in vertical slices keeps the product adaptable while honoring user-centered design.

### Performance-Focused Experience
- Initial page load MUST stay under 1.8 seconds on 3G Fast networks and maintain a Lighthouse performance score ≥ 90 for primary routes.
- Interactions MUST respond within 100 ms after hydration; long-running operations MUST display progress affordances within 200 ms.
- Bundle budgets MUST be enforced per route (<= 150 KB compressed per critical path) with alerts triggered in CI when exceeded.
- Server/API endpoints MUST meet p95 latency targets of 200 ms under projected peak load, with documented load-test results for major changes.
- Performance regressions MUST be investigated within the sprint and logged with root cause notes in the performance journal.
Rationale: Fast experiences drive adoption and reinforce the sense of polish promised in modern productivity tools.

### Sustainable Quality Automation
- CI pipelines MUST run linting, type checks, unit/component/integration tests, and accessibility audits on every push.
- Static analysis (dependency checks, security scans, bundle diffing) MUST run automatically with gating thresholds defined in CI workflows.
- Telemetry (analytics + error tracking) MUST be instrumented for critical user flows and reviewed monthly for regressions.
- Dependencies MUST be updated proactively; any high severity security advisory triggers an immediate maintenance story.
- Automated code style, formatting, and accessibility checks MUST run in pre-commit hooks to prevent regressions before CI.
- Observability dashboards MUST remain current, documenting alert thresholds and on-call escalation paths for production incidents.
Rationale: Automated quality signals prevent regressions from eroding the polished experience promised to users.

## Product Standards

- Maintain a centralized design system covering typography, color palette, spacing, and interactive states; update documentation when components evolve.
- Provide a keyboard-accessible command palette and quick-add flow to keep task creation frictionless.
- Persist tasks with optimistic UI updates so users see their changes instantly while the backend syncs.
- Localize user-facing strings via a translation layer; English is default, but architecture MUST support future locales.
- Log meaningful analytics events for creation, completion, and organization actions to inform UX improvements.

## Delivery Workflow

- Before coding, capture the feature spec, plan, and tasks with explicit references to governing principles and acceptance tests.
- Design reviews MUST precede implementation for any new component or interaction to confirm alignment with the design system.
- Tests MUST be authored and committed before the implementation for every task, with CI configured to fail if new tests are missing.
- Pull requests MUST include screenshots or short screen recordings demonstrating the user story experience in both light and dark themes.
- Every sprint closes with an accessibility and usability check against the current backlog to reprioritize work based on findings.

## Governance

- Amendments require consensus from the core maintainers (product, design, engineering leads) and a documented rationale linked in the repo.
- Constitution updates MUST bump the semantic version: MAJOR for principle changes that alter enforcement, MINOR for new guidance, PATCH for clarifications.
- Ratified principles supersede conflicting process documents; update affected templates and scripts within the same change set.
- Quarterly compliance reviews MUST audit a random sample of features to verify adherence to principles, workflow rules, and automation coverage.
- Runtime guidance (README, onboarding docs, templates) MUST stay synchronized with the latest constitution version.

**Version**: 1.1.0 | **Ratified**: 2025-10-17 | **Last Amended**: 2025-10-17
