# Quickstart: Modern Todo Reminders

## Prerequisites
- Node.js 20.x with npm
- Python 3.12
- Docker & Docker Compose (v2)
- Make (optional convenience)

## 1. Clone & Install
```bash
git clone <repo-url>
cd todoapp

# Frontend
cd frontend
npm install

# Backend
cd ../backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 2. Environment Setup
Create `.env` files from provided examples:
- `frontend/.env.local` → configure API base URL (`VITE_API_BASE_URL=http://localhost:8000/v1`)
- `backend/.env` → set `DATABASE_URL=sqlite:///./data/todo.db`, `REMINDER_POLL_INTERVAL=30`

## 3. Run Development Servers
```bash
# In backend/
uvicorn src.main:app --reload --port 8000

# In frontend/
npm run dev -- --port 5173
```
Access the app at http://localhost:5173.

## 4. Docker Workflow
```bash
docker compose up --build
```
Services:
- `frontend` (Vite dev server or Nginx for production build)
- `backend` (FastAPI + SQLite volume)

Stop with `docker compose down`.

## 5. Testing (Test-First Enforcement)
- Frontend: `npm run test` (Vitest), `npm run test:e2e` (Playwright)
- Backend: `pytest --cov=src`
- Lint/typecheck: `npm run lint`, `npm run typecheck`, `ruff check`, `mypy`
- Offline queue suite: `npm run test:offline` (targets `frontend/tests/services/offlineQueue.test.ts`)

All tests must be written and run before implementation per constitution; CI enforces coverage ≥90% on changed files.

## 6. Storybook & Accessibility
```bash
cd frontend
npm run storybook   # Component review
npm run test:a11y   # Pa11y/axe audits
```

## 7. Database Migrations
```bash
cd backend
alembic upgrade head    # apply migrations
alembic revision --autogenerate -m "describe change"  # create new migration
```

## 8. API Contracts
Regenerate typed clients after contract updates:
```bash
pnpm openapi --input ../specs/001-specify-scripts-bash/contracts/openapi.yaml \
             --output frontend/src/services/api
```
(Adjust command based on selected codegen tool.)

## 9. Performance & Accessibility Checks
- Run Lighthouse CI script (`npm run audit`) before merging.
- Execute Locust smoke tests (`locust -f locustfile.py --headless -u 50 -r 5`) to confirm reminder endpoints meet 200 ms p95.
- Run Playwright offline scenario (`npm run test:e2e -- --grep "offline"`) to verify sync pending and retry flows.

## 10. Feature Flags & Releases
- Feature toggles defined in `backend/src/config/flags.py` and consumed in frontend via `/config` endpoint.
- Each user story should be deployable independently; verify toggles before release.
