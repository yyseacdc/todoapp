import { expect, type Page } from '@playwright/test';

export async function verifyBasicAccessibility(page: Page): Promise<void> {
  await expect(page.locator('main, [role="main"]')).toHaveCount(1);
  await expect(page).toHaveTitle(/.+/);
}
