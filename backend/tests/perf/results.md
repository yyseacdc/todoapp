# Locust Smoke Test Summary

Date: 2025-10-17
Command: `locust -f locustfile.py --headless -u 50 -r 5 --run-time 2m`

| Endpoint | Requests | Avg (ms) | P95 (ms) | Failures |
|----------|----------|----------|----------|----------|
| POST /v1/tasks | 550 | 82 | 140 | 0 |
| GET /v1/reminders/upcoming | 320 | 45 | 90 | 0 |
| POST /v1/reminders/{id}/snooze | 120 | 88 | 150 | 0 |
| POST /v1/reminders/{id}/dismiss | 115 | 70 | 120 | 0 |

Observations:
- Reminder operations remain under the 200 ms p95 target.
- Scheduler-generated websocket traffic remained stable during the run.
- Re-run after significant backend performance changes.
