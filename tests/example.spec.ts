import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/ArabicBase/);
});

test('shows explore pills', async ({ page }) => {
    await page.goto('/');

    // Check for the main heading
    await expect(page.getByRole('heading', { name: 'Global Database' })).toBeVisible();

    // Check for the search input
    await expect(page.getByPlaceholder('Search words, meanings...')).toBeVisible();
});
