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

import { Injectable, InjectionToken, inject } from '@angular/core';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { OAuthService } from 'angular-oauth2-oidc';
import { MobilePlatformService } from '@pervaxis/canvas-shell-core';

/** Function type that opens a URL in the Capacitor in-app browser. */
export type BrowserOpenFn = (options: { url: string }) => Promise<void>;

/**
 * DI token for the in-app browser opener. Defaults to `Browser.open()` from
 * `@capacitor/browser`. Override in tests or to customise browser options.
 */
export const CANVAS_BROWSER_OPEN = new InjectionToken<BrowserOpenFn>(
  'CANVAS_BROWSER_OPEN',
  {
    providedIn: 'root',
    factory: (): BrowserOpenFn => (options) => Browser.open(options),
  }
);

/**
 * Handles the OIDC Authorization Code flow on Capacitor native platforms.
 *
 * On **web**, `login()` delegates to `OAuthService.initCodeFlow()` (standard redirect).
 * On **native**, the OIDC provider URL is opened in a Capacitor in-app browser window;
 * the redirect callback is captured via `App.addListener('appUrlOpen', …)`, which
 * closes the browser and lets `OAuthService.tryLoginCodeFlow()` exchange the code.
 *
 * Register the app's custom URL scheme (e.g. `mycapp://`) in `capacitor.config.ts`
 * and add it as a valid `redirectUri` in the OIDC provider configuration.
 *
 * @example
 * // app.component.ts
 * readonly #oidc = inject(CapacitorOidcService);
 * ngOnInit() { this.#oidc.initialize(); }
 *
 * // login button handler
 * login() { void this.#oidc.login(); }
 */
@Injectable({ providedIn: null })
export class CapacitorOidcService {
  readonly #oauthService = inject(OAuthService);
  readonly #platform = inject(MobilePlatformService);
  readonly #browserOpen = inject(CANVAS_BROWSER_OPEN);

  /**
   * Registers the `appUrlOpen` deep-link listener that handles the OIDC redirect.
   * Must be called once at app startup on native platforms; no-op on web.
   */
  initialize(): void {
    if (!this.#platform.isNative()) return;

    void App.addListener('appUrlOpen', async ({ url }) => {
      if (url.includes('code=') || url.includes('error=')) {
        await Browser.close();
        // Redirect the window hash/search so OAuthService can parse the code.
        const urlObj = new URL(url);
        history.replaceState(null, '', urlObj.pathname + urlObj.search + urlObj.hash);
        await this.#oauthService.tryLoginCodeFlow();
      }
    });
  }

  /**
   * Initiates the OIDC Authorization Code flow.
   * On web: standard browser redirect via `OAuthService.initCodeFlow()`.
   * On native: opens the authorization URL in the Capacitor in-app browser.
   */
  async login(): Promise<void> {
    if (!this.#platform.isNative()) {
      this.#oauthService.initCodeFlow();
      return;
    }

    const authorizationUrl = (this.#oauthService as unknown as { loginUrl: string })
      .loginUrl;
    if (authorizationUrl) {
      await this.#browserOpen({ url: authorizationUrl });
    }
  }
}
