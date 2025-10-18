import baseConfig from './playwright.config';
import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  ...baseConfig,
  testDir: './tests/a11y',
  use: {
    ...baseConfig.use,
    viewport: { width: 1280, height: 720 }
  }
};

export default config;
