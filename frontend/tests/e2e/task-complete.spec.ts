import { test, expect } from '@playwright/test';

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173';

test.describe('Task lifecycle', () => {
  test('complete, undo, and delete task', async ({ page }) => {
    await page.goto(baseUrl);

    // Create a new task
    await page.getByLabel('Title').fill('Wash the car');
    await page.getByRole('button', { name: /add task/i }).click();

    const taskRow = page.getByText('Wash the car');
    await expect(taskRow).toBeVisible();

    // Complete the task
    await page.getByRole('button', { name: /mark complete/i }).first().click();
    await expect(page.getByText(/Completed at/i)).toBeVisible();

    // Undo completion
    await page.getByRole('button', { name: /undo/i }).first().click();
    await expect(page.getByRole('button', { name: /mark complete/i })).toBeVisible();

    // Delete task
    await page.getByRole('button', { name: /delete/i }).first().click();
    await expect(page.getByText('Wash the car')).toHaveCount(0);
  });
});
