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

import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CANVAS_CONFIG_URL, CanvasRuntimeConfig } from './canvas-runtime-config';

/**
 * Loads and caches the runtime environment configuration from a JSON
 * file before the application renders any routes.
 *
 * Consumed via `APP_INITIALIZER` — do not call `load()` manually.
 *
 * @example
 * const cfg = inject(EnvironmentConfigService);
 * const apiBase = cfg.config()?.apiBaseUrl;
 */
@Injectable({ providedIn: null })
export class EnvironmentConfigService {
  readonly #http = inject(HttpClient);
  readonly #configUrl = inject(CANVAS_CONFIG_URL);

  readonly #config = signal<CanvasRuntimeConfig | null>(null);
  readonly #loaded = signal(false);

  /** The loaded runtime configuration. `null` until `load()` resolves. */
  readonly config: Signal<CanvasRuntimeConfig | null> = this.#config.asReadonly();

  /** `true` once `load()` has completed successfully. */
  readonly isLoaded: Signal<boolean> = this.#loaded.asReadonly();

  /**
   * Fetches the config JSON and populates the `config` signal.
   * Called automatically by the `APP_INITIALIZER` registered in `provideCanvasCore()`.
   */
  async load(): Promise<void> {
    const config = await firstValueFrom(
      this.#http.get<CanvasRuntimeConfig>(this.#configUrl)
    );
    this.#config.set(config);
    this.#loaded.set(true);
  }
}
