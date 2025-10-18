import { test, expect } from '@playwright/test';

const dashboardUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173';

test.describe('Task creation flow', () => {
  test('creates a task with reminder and displays success state', async ({ page }) => {
    await page.goto(dashboardUrl);

    await page.getByLabel('Title').fill('Doctor appointment');
    await page.getByLabel('Reminder').fill('2025-10-21T09:00');
    await page.getByRole('button', { name: 'Add task' }).click();

    await expect(page.getByText('Doctor appointment')).toBeVisible();
    await expect(page.getByText('Reminder set for')).toBeVisible();
  });
});
