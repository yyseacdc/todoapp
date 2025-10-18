from dataclasses import dataclass


@dataclass(frozen=True)
class FeatureFlags:
    enable_reminders: bool = True
    enable_activity_feed: bool = False
    enable_offline_queue: bool = True


flags = FeatureFlags()
