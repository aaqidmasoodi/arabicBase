import { test, expect } from '@playwright/test';

test.describe('Authentication UI', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('should display login form correctly', async ({ page }) => {
        // Verify Title
        await expect(page.getByRole('heading', { name: /Welcome Back/i })).toBeVisible();

        // Verify Inputs
        await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
        await expect(page.getByPlaceholder('••••••••')).toBeVisible();

        // Verify Button
        await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();

        // Verify Toggle Link (Split into text and button)
        await expect(page.getByText("Don't have an account?")).toBeVisible();
        await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();
    });

    test('should toggle between sign in and sign up', async ({ page }) => {
        // Click "Sign up"
        await page.getByText("Sign up").click();

        // Verify Title changes
        await expect(page.getByRole('heading', { name: /Join the Community/i })).toBeVisible();

        // Verify Button changes
        await expect(page.getByRole('button', { name: /Create Account/i })).toBeVisible();

        // Click "Sign in"
        await page.getByText("Sign in").click();

        // Verify back to Sign in
        await expect(page.getByRole('heading', { name: /Welcome Back/i })).toBeVisible();
    });

    test('should validate empty form submission', async ({ page }) => {
        // Click Sign in without filling anything
        await page.getByRole('button', { name: 'Sign in' }).click();

        // Browser HTML5 validation prevents submission, but Playwright can check validity
        // Or we check if we are still on the same page (no redirect)
        await expect(page).toHaveURL(/\/login/);

        // Optional: Check for error message if your app displays one
        // await expect(page.getByText('Error')).toBeVisible();
    });

});
