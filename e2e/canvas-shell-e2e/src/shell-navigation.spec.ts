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
 * Shell → MFE navigation E2E suite.
 *
 * Requires:
 *  - canvas-shell-ref running at http://localhost:4200
 *  - canvas-mfe-ref running at http://localhost:4201
 *  - A valid dev user authenticated (or auth bypassed in dev mode)
 */

async function loginAsDevUser(page: Page): Promise<void> {
  await page.goto('/login');
  await page.getByRole('button', { name: /sign in/i }).click();
  // OIDC redirects to Keycloak; fill credentials in the IDP login form.
  await page.fill('#username', 'dev@canvas.local');
  await page.fill('#password', 'dev-password');
  await page.getByRole('button', { name: /log in/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe('Shell navigation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDevUser(page);
  });

  test('redirects from / to /dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('renders shell layout with sidebar and header', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('canvas-shell-layout')).toBeVisible();
    await expect(page.locator('canvas-sidebar')).toBeVisible();
    await expect(page.locator('canvas-header')).toBeVisible();
  });

  test('navigates to Settings via sidebar link', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('link', { name: /settings/i }).click();
    await expect(page).toHaveURL(/\/settings/);
    await expect(page.locator('canvas-page')).toContainText('Settings');
  });

  test('sidebar collapse toggle hides nav labels', async ({ page }) => {
    await page.goto('/dashboard');
    const toggleBtn = page.getByRole('button', { name: /toggle sidebar/i });
    await toggleBtn.click();
    await expect(page.locator('canvas-sidebar')).toHaveClass(/collapsed/);
    await toggleBtn.click();
    await expect(page.locator('canvas-sidebar')).not.toHaveClass(/collapsed/);
  });

  test('breadcrumb reflects current route', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.locator('canvas-header')).toContainText('Settings');
  });
});

test.describe('MFE route loading', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDevUser(page);
  });

  test('navigates into products MFE', async ({ page }) => {
    await page.goto('/products');
    // Give the remote module time to load
    await expect(page.locator('app-product-list')).toBeVisible({ timeout: 10_000 });
  });

  test('renders product list grid', async ({ page }) => {
    await page.goto('/products');
    await expect(page.locator('.ag-root')).toBeVisible({ timeout: 10_000 });
  });

  test('navigates into product detail from grid link', async ({ page }) => {
    await page.goto('/products');
    await page.locator('.grid-link').first().click();
    await expect(page).toHaveURL(/\/products\/\w+/);
    await expect(page.locator('canvas-page')).toContainText('Product:');
  });
});

test.describe('404 handling', () => {
  test('renders CanvasNotFoundComponent for unknown routes', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.locator('canvas-not-found')).toBeVisible();
  });
});
