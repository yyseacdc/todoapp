# Reminder Panel Performance Notes

- Upcoming reminders endpoint is capped to a 48 hour horizon and returns lightweight summary objects.
- Snooze and dismiss actions optimistically update UI while backend broadcasts `reminders.updated` events for remote clients.
- WebSocket messages trigger incremental fetches rather than pushing full payloads to minimise transfer volume.
- Frontend list rendering uses the existing virtual DOM diffing; panel tested with synthetic data up to 100 reminders without noticeable jank.
