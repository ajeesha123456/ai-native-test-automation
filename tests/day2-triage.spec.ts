import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('https://example.com');

  await expect(page).toHaveTitle(/Example Domain/);
});

test('intentional checkout failure', async ({ page }) => {
  await page.goto('https://example.com');

  await expect(
    page.getByRole('button', { name: 'Checkout' })
  ).toBeVisible();
});