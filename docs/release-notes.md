# Release Notes: Modern Todo Reminders MVP

## Highlights
- Task capture, lifecycle management, and reminders panel with real-time updates.
- Offline queue for task creation with automatic sync.
- Snooze and dismiss actions with activity log visibility.

## Screenshots
- `docs/screenshots/dashboard-light.png`
- `docs/screenshots/reminders-panel.png`

*(Capture fresh screenshots before publishing.)*

## Testing Matrix
- `npm run lint`
- `npm run typecheck`
- `npm run test -- --run --exclude tests/e2e`
- `npx playwright test`
- `ruff check src`
- `mypy src`
- `pytest --cov=src`

## Known Issues
- Authentication/collaboration features deferred to future release.
- Dev-mode Playwright dependencies report moderate npm advisories (tooling only).
