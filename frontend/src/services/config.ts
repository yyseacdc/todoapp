export interface FeatureFlags {
  enableReminders: boolean;
  enableActivityFeed: boolean;
  enableOfflineQueue: boolean;
}

const defaultFlags: FeatureFlags = {
  enableReminders: true,
  enableActivityFeed: false,
  enableOfflineQueue: true
};

export function getFeatureFlags(): FeatureFlags {
  try {
    const raw = sessionStorage.getItem('todoapp:flags');
    if (raw) {
      return { ...defaultFlags, ...JSON.parse(raw) } as FeatureFlags;
    }
  } catch (error) {
    console.warn('Unable to read feature flags; falling back to defaults', error);
  }
  return defaultFlags;
}

export function setFeatureFlags(flags: Partial<FeatureFlags>): void {
  sessionStorage.setItem('todoapp:flags', JSON.stringify({ ...getFeatureFlags(), ...flags }));
}
