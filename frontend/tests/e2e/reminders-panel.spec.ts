import { test, expect } from '@playwright/test';

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173';

test.describe('Reminders panel', () => {
  test('shows upcoming reminders after task creation', async ({ page }) => {
    await page.goto(baseUrl);

    await page.getByLabel('Title').fill('Reminders panel task');
    await page.getByLabel('Reminder').fill(new Date(Date.now() + 600000).toISOString().slice(0, 16));
    await page.getByRole('button', { name: /add task/i }).click();

    await expect(page.getByText('Reminders panel task')).toBeVisible();
    await expect(page.getByText(/Upcoming reminders/)).toBeVisible();
  });
});
