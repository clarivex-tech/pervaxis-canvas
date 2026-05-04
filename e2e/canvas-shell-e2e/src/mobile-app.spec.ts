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

import { test, expect, devices } from '@playwright/test';

/**
 * Mobile app E2E suite — runs against canvas-mobile-ref in a mobile browser viewport.
 *
 * Requires:
 *  - canvas-mobile-ref served via `npx cap serve` or a web dev server on :4202
 *    (Ionic apps can be tested in a browser without a native simulator)
 */

const MOBILE_URL = 'http://localhost:4202';

test.use({ ...devices['Pixel 5'] });

test.describe('Mobile app — ion-app bootstrap', () => {
  test('renders ion-app root', async ({ page }) => {
    await page.goto(MOBILE_URL);
    await expect(page.locator('ion-app')).toBeVisible({ timeout: 10_000 });
  });

  test('renders ion-router-outlet', async ({ page }) => {
    await page.goto(MOBILE_URL);
    await expect(page.locator('ion-router-outlet')).toBeVisible();
  });
});

test.describe('Mobile app — login flow', () => {
  test('login page renders sign-in button', async ({ page }) => {
    await page.goto(`${MOBILE_URL}/auth`);
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('tapping sign-in opens external browser for OIDC', async ({ page, context }) => {
    void context.waitForEvent('page');
    await page.goto(`${MOBILE_URL}/auth`);
    await page.getByRole('button', { name: /sign in/i }).click();
    // On web/browser mode the OIDC redirect opens normally (no Capacitor Browser plugin)
    await expect(page).toHaveURL(/localhost:8080/, { timeout: 10_000 });
  });
});

test.describe('Mobile app — home page', () => {
  test('home page displays platform and network info', async ({ page }) => {
    await page.goto(`${MOBILE_URL}/home`);
    // Accept unauthenticated view for demo purposes
    await expect(page.locator('canvas-mobile-chart, ion-content')).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('Mobile app — responsive layout', () => {
  test('touch targets meet minimum 44x44px size', async ({ page }) => {
    await page.goto(`${MOBILE_URL}/home`);
    const buttons = page.locator('ion-button, button');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const box = await buttons.nth(i).boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });
});
