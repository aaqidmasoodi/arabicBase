import { test, expect } from '@playwright/test';

test.describe('Public Browsing Experience', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load the home page correctly', async ({ page }) => {
        // Verify Header
        await expect(page.getByRole('heading', { name: 'Global Database' })).toBeVisible();

        // Verify Search & Filters
        await expect(page.getByPlaceholder('Search words, meanings...')).toBeVisible();
        // Check for select elements instead of hidden options
        await expect(page.locator('select').first()).toBeVisible(); // Dialects
        await expect(page.locator('select').nth(1)).toBeVisible(); // Categories

        // Verify Concept Pills
        await expect(page.getByText('Concepts:')).toBeVisible();
        await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
    });

    test('should filter entries by search term', async ({ page }) => {
        // 1. Wait for at least one entry to load
        const firstEntry = page.locator('button.group').first();
        await expect(firstEntry).toBeVisible({ timeout: 10000 });

        // 2. Get the term of the first entry
        // The term is in a span with class "font-arabic"
        const term = await firstEntry.locator('.font-arabic').first().innerText();
        console.log(`Searching for term: ${term}`);

        // 3. Search for it
        const searchInput = page.getByPlaceholder('Search words, meanings...');
        await searchInput.fill(term);

        // 4. Verify it is still visible
        await expect(page.getByText(term).first()).toBeVisible();

        // 5. Verify non-matching entries are gone (optional, hard to test without knowing data)
    });

    test('should show "No entries found" for invalid search', async ({ page }) => {
        const searchInput = page.getByPlaceholder('Search words, meanings...');
        await searchInput.fill('xyz_non_existent_term_123');

        await expect(page.getByRole('heading', { name: 'No entries found' })).toBeVisible();
        await expect(page.getByText('Try adjusting your search or filters.')).toBeVisible();
    });

    test('should expand an entry and update URL (Deep Linking)', async ({ page }) => {
        // Find the first entry card (assuming there is at least one)
        // We target the button that acts as the card
        const firstEntry = page.locator('button.group').first();
        await expect(firstEntry).toBeVisible();

        // Click it
        await firstEntry.click();

        // Verify URL updates
        await expect(page).toHaveURL(/dictionary\/.*\/.*\?entry=.*/);

        // Verify Expanded View (Modal-like)
        // Look for the close button or specific expanded content
        await expect(page.locator('button > svg.lucide-x')).toBeVisible(); // Close button X icon

        // Verify "Add to Knowledge Base" button is visible (for public user)
        // Note: It might be "Add to Knowledge Base" or "In Knowledge Base" depending on state, 
        // but for a fresh public session it should be "Add to Knowledge Base" or just the button itself.
        // Actually, for public user, the button is visible but redirects to login.
        // Let's just check the expanded content is there.
        await expect(page.getByText('Example')).toBeVisible(); // AI Insights Example
    });

    test('should persist expanded state on reload', async ({ page }) => {
        // 1. Open an entry
        const firstEntry = page.locator('button.group').first();
        await firstEntry.click();

        // 2. Get the current URL
        const url = page.url();

        // 3. Reload
        await page.reload();

        // 4. Verify we are still on the same URL
        expect(page.url()).toBe(url);

        // 5. Verify the entry is still expanded
        await expect(page.locator('button > svg.lucide-x')).toBeVisible();
    });

});
