import { test, expect } from '@playwright/test';

test('homepage loads, no horizontal overflow', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page).toHaveTitle(/Sihatree/i);
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  expect(hasOverflow).toBe(false);
});

test('ms homepage loads, no horizontal overflow', async ({ page }) => {
  await page.goto('/ms/index.html');
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  expect(hasOverflow).toBe(false);
});
