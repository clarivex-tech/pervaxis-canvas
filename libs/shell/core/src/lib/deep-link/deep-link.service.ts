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

import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { MobilePlatformService } from '../platform/mobile-platform.service';

/**
 * Handles universal links and custom URL scheme deep links on native platforms
 * via the `@capacitor/app` plugin.
 *
 * Call `initialize()` once during app bootstrap (e.g. inside an `APP_INITIALIZER`
 * or in `AppComponent.ngOnInit()`). On web, `initialize()` is a no-op.
 *
 * @example
 * // app.component.ts
 * readonly #deepLink = inject(DeepLinkService);
 * ngOnInit() { this.#deepLink.initialize(); }
 */
@Injectable({ providedIn: 'root' })
export class DeepLinkService {
  readonly #router = inject(Router);
  readonly #platform = inject(MobilePlatformService);

  readonly #lastDeepLink = signal<string | null>(null);

  /** The URL of the most recently received deep link, or `null`. */
  readonly lastDeepLink = this.#lastDeepLink.asReadonly();

  /**
   * Registers the `appUrlOpen` listener.
   * Must be called once — subsequent calls are harmless but redundant.
   * No-op on web.
   */
  initialize(): void {
    if (!this.#platform.isNative()) return;

    void App.addListener('appUrlOpen', ({ url }) => {
      this.#lastDeepLink.set(url);
      const path = this.#extractPath(url);
      if (path) {
        void this.#router.navigateByUrl(path);
      }
    });
  }

  #extractPath(url: string): string | null {
    try {
      const parsed = new URL(url);
      return parsed.pathname + (parsed.search ?? '');
    } catch {
      return null;
    }
  }
}
