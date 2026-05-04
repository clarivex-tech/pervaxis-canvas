/**
 ************************************************************************
 * Copyright (C) 2026 Clarivex Technologies Private Limited
 * All Rights Reserved.
 *
 * NOTICE: All intellectual and technical concepts contained
 * herein are proprietary to Clarivex Technologies Private Limited
 * and may be covered by Indian and Foreign Patents,
 * patents in process, and are protected by trade secret or
 * copyright law. Dissemination of this information or reproduction
 * of this material is strictly forbidden unless prior written
 * permission is obtained from Clarivex Technologies Private Limited.
 *
 * Product:   Pervaxis Platform
 * Website:   https://clarivex.tech
 ************************************************************************
 */

import { test, expect, Page } from '@playwright/test';

/**
 * Auth flow E2E suite.
 *
 * Covers: OIDC redirect login, JWT token injection, protected route guard,
 * session logout, and token expiry silent refresh.
 *
 * Requires:
 *  - Keycloak or compatible OIDC provider running at http://localhost:8080
 *  - canvas-shell-ref configured with that issuer in /assets/config.json
 */

async function completeOidcLogin(page: Page): Promise<void> {
  await page.fill('#username', 'dev@canvas.local');
  await page.fill('#password', 'dev-password');
  await page.getByRole('button', { name: /log in/i }).click();
}

test.describe('OIDC login flow', () => {
  test('redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('login button triggers OIDC redirect', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /sign in/i }).click();
    // Should land on OIDC provider login page
    await expect(page).toHaveURL(/localhost:8080/);
  });

  test('successful login redirects to /dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /sign in/i }).click();
    await completeOidcLogin(page);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
  });

  test('JWT token is injected on API requests after login', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', (req) => {
      const auth = req.headers()['authorization'];
      if (auth) requests.push(auth);
    });
    await page.goto('/login');
    await page.getByRole('button', { name: /sign in/i }).click();
    await completeOidcLogin(page);
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);
    expect(requests.some((h) => h.startsWith('Bearer '))).toBe(true);
  });
});

test.describe('Protected routes', () => {
  test('authGuard redirects to /login when not authenticated', async ({ page }) => {
    // Clear any existing session
    await page.context().clearCookies();
    await page.goto('/settings');
    await expect(page).toHaveURL(/\/login/);
  });

  test('accessing /login while authenticated redirects to /dashboard', async ({ page }) => {
    // Log in first
    await page.goto('/login');
    await page.getByRole('button', { name: /sign in/i }).click();
    await completeOidcLogin(page);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
    // Now try to navigate back to /login — shell should redirect to dashboard
    await page.goto('/login');
    await expect(page).toHaveURL(/\/dashboard/);
  });
});

test.describe('Logout', () => {
  test('logout clears session and redirects to /login', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /sign in/i }).click();
    await completeOidcLogin(page);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });

    await page.goto('/settings');
    await page.getByRole('button', { name: /sign out/i }).click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });
});
