# Research: Modern Todo Reminders

## Reminder Scheduling without Heavy Dependencies
- **Decision**: Implement reminder dispatch using FastAPI's startup background task that runs an `asyncio` loop checking due reminders every 30 seconds, paired with WebSocket push notifications for active sessions.  
- **Rationale**: Native FastAPI/Starlette tooling keeps the stack lightweight, aligns with minimal dependency constraint, and suffices for the MVP reminder volume (≈1k active reminders per user).  
- **Alternatives considered**:  
  - APScheduler: robust job management but adds an extra dependency and configuration surface that exceeds "minimal libraries" requirement.  
  - Celery/Redis workers: scalable but heavy infrastructure and violates lightweight constraint.  
  - Client-side polling only: simpler but risks missed reminders when user tab inactive and fails reliability expectation.

## Persistence Strategy
- **Decision**: Use SQLite in WAL mode with SQLAlchemy 2.0 declarative models and Alembic migrations.  
- **Rationale**: SQLite is the lightest relational database fulfilling user request; WAL mode supports concurrent reads/writes for reminder checks; SQLAlchemy delivers safety and maintainability with minimal additional dependency overhead (already bundled with Alembic).  
- **Alternatives considered**:  
  - Raw `sqlite3` module: fewer dependencies but increased risk of SQL injection and duplicated query logic; harder to maintain migrations.  
  - PostgreSQL: powerful but heavier operational footprint than required.  
  - DuckDB: analytical focus, lacks robust concurrent write support for prod web workloads.

## Frontend Architecture
- **Decision**: Scaffold React 18 + Vite with Tailwind CSS and TypeScript, using component-level design tokens and Storybook for visual validation.  
- **Rationale**: Meets directive to use React and Tailwind while keeping toolchain light (Vite dev server). TypeScript enforces data contracts per constitution; Storybook supports accessibility/performance reviews with minimal overhead.  
- **Alternatives considered**:  
  - Next.js: adds SSR/ISR complexity unnecessary for MVP; heavier dependency graph.  
  - CRA: deprecated and heavier build output.  
  - Pure vanilla CSS modules: would conflict with Tailwind requirement and reduce consistency.

## In-App Reminder Delivery Channel
- **Decision**: Provide real-time reminder updates via FastAPI WebSocket endpoint with fallback long-polling API for clients unable to keep sockets open.  
- **Rationale**: WebSockets are built into FastAPI/Starlette, impose no extra dependency, and enable timely in-app notifications meeting UX expectations. Fallback ensures accessibility for restrictive networks.  
- **Alternatives considered**:  
  - Server-Sent Events: simpler but limited browser support for reconnection handling compared to WebSocket.  
  - Push notifications via Service Workers: powerful but requires additional setup (VAPID keys) and conflicts with "minimal libs" for MVP.  
  - Polling-only approach: increases network load and may miss near-real-time delivery goals.

## Containerization Approach
- **Decision**: Use Docker multi-stage builds—one image for frontend (Node + Vite build → static assets) and one for backend (Python slim base), orchestrated via docker-compose for local parity.  
- **Rationale**: Satisfies "use Docker when possible," keeps runtime images slim (production images copy built assets only) and simplifies onboarding through `docker compose up`.  
- **Alternatives considered**:  
  - Single combined image: simpler but produces larger image and couples build steps, harming cache efficiency.  
  - Podman or non-container dev: violates user directive for Docker usage.  
  - Kubernetes manifests: heavyweight for MVP scope.

## Testing & Automation Strategy
- **Decision**: Adopt Vitest + React Testing Library, Playwright for end-to-end and accessibility checks, pytest with coverage + schemathesis for contract testing, automated via GitHub Actions matrix.  
- **Rationale**: These tools align with constitution’s test-first mandate, remain relatively lightweight, and integrate well with Vite/FastAPI without introducing excessive dependencies.  
- **Alternatives considered**:  
  - Jest: heavier configuration when using Vite.  
  - Cypress: powerful but larger install footprint compared to Playwright for cross-browser tests.  
  - Locust alternative artillery: Locust integrates with Python ecosystem already in use.

## Offline Task Queue Strategy
- **Decision**: Persist pending task/reminder payloads in the browser via IndexedDB (using a minimal wrapper) with automatic retry every 30 seconds and manual retry fallback.  
- **Rationale**: IndexedDB is available natively, satisfies lightweight constraint, and supports structured storage for queued requests without adding heavy libraries.  
- **Alternatives considered**:  
  - LocalStorage: simple but lacks transactional guarantees and size limits for queued payloads.  
  - Service Worker background sync: powerful but increases setup complexity and dependency surface beyond MVP scope.  
  - Third-party offline libraries (e.g., Workbox): add weight contrary to minimal dependency directive.

## Duplicate Task Detection
- **Decision**: Guard task creation via a backend service comparing normalized titles over a rolling five-minute window, prompting users with confirmation before creating duplicates.  
- **Rationale**: Centralizing detection prevents inconsistent logic across clients, supports auditing via ReminderActivity logs, and remains lightweight using existing database indices.  
- **Alternatives considered**:  
  - Client-only duplicate warnings: faster but unreliable across devices and cannot enforce confirmation.  
  - Full-text search tooling: overkill for limited scope and adds extra dependencies.  
  - Ignoring duplicates: contradicts UX requirement to prevent accidental duplicates.
