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
import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { Observable, firstValueFrom, retry } from 'rxjs';
import { MfeManifest } from '@pervaxis/canvas-mfe-contracts';
import { EnvironmentConfigService } from '../config/environment-config.service';
import {
  CANVAS_REGISTRY_CONFIG,
  RegistryConfig,
  RegistryResponse,
} from './registry.types';

/**
 * Canvas Registry client — fetches the list of registered MFE remotes
 * from `GET /api/registry/{customerId}/remotes`, caches them in a signal,
 * and falls back to `/assets/registry.json` when the API is unreachable.
 *
 * Config is resolved in priority order:
 * 1. `CANVAS_REGISTRY_CONFIG` injection token (explicit)
 * 2. `CanvasRuntimeConfig.registryApiUrl` + `registryCustomerId` (runtime JSON)
 * 3. No-op — when neither is present, `loadRemotes()` does nothing.
 *
 * @example
 * // In app.config.ts
 * providers: [
 *   provideCanvasCore(),
 *   { provide: CANVAS_REGISTRY_CONFIG, useValue: { apiUrl: 'https://registry.pervaxis.io', customerId: 'acme' } },
 * ]
 *
 * // Or via runtime config.json:
 * { "registryApiUrl": "https://registry.pervaxis.io", "registryCustomerId": "acme" }
 */
@Injectable({ providedIn: null })
export class RegistryClientService {
  readonly #http = inject(HttpClient);
  readonly #configService = inject(EnvironmentConfigService);
  readonly #explicitConfig = inject(CANVAS_REGISTRY_CONFIG, { optional: true });

  readonly #remotes = signal<MfeManifest[]>([]);

  /** All loaded MFE remotes. Empty until `loadRemotes()` resolves. */
  readonly remotes: Signal<MfeManifest[]> = this.#remotes.asReadonly();

  /** O(1) lookup map keyed by remote `name`. */
  readonly #remoteMap = computed(
    () => new Map(this.#remotes().map((m) => [m.name, m]))
  );

  /**
   * Fetches the customer's MFE remote list from the registry API.
   * Retries up to 2 times on transient errors before falling back to
   * the static `registry.json` file. No-op when no config is found.
   *
   * Called automatically by `APP_INITIALIZER` after env config is loaded.
   */
  async loadRemotes(): Promise<void> {
    const config = this.#resolveConfig();
    if (!config) return;

    const url = `${config.apiUrl}/api/registry/${config.customerId}/remotes`;
    const fallbackUrl = config.fallbackUrl ?? '/assets/registry.json';

    try {
      const response = await firstValueFrom(
        this.#http.get<RegistryResponse>(url).pipe(retry(2))
      );
      this.#remotes.set(response.remotes);
    } catch {
      await this.#loadFallback(fallbackUrl);
    }
  }

  /**
   * Registers a new MFE remote in the customer's registry.
   * `POST /api/registry/{customerId}/remotes`
   *
   * @param manifest - The MFE manifest to register.
   * @returns Observable that emits the created manifest.
   */
  registerRemote(manifest: MfeManifest): Observable<MfeManifest> {
    const { apiUrl, customerId } = this.#requireConfig();
    return this.#http.post<MfeManifest>(
      `${apiUrl}/api/registry/${customerId}/remotes`,
      manifest
    );
  }

  /**
   * Removes a registered MFE remote from the customer's registry.
   * `DELETE /api/registry/{customerId}/remotes/{name}`
   *
   * @param name - Logical name of the remote to remove.
   * @returns Observable that completes when the remote is removed.
   */
  unregisterRemote(name: string): Observable<void> {
    const { apiUrl, customerId } = this.#requireConfig();
    return this.#http.delete<void>(
      `${apiUrl}/api/registry/${customerId}/remotes/${encodeURIComponent(name)}`
    );
  }

  /**
   * Returns the manifest for the given remote name, or `undefined`
   * if the remote was not found in the loaded registry.
   *
   * @param name - Logical remote name (matches `MfeManifest.name`).
   */
  getRemote(name: string): MfeManifest | undefined {
    return this.#remoteMap().get(name);
  }

  #resolveConfig(): RegistryConfig | null {
    if (this.#explicitConfig) return this.#explicitConfig;
    const rc = this.#configService.config();
    if (!rc?.registryApiUrl || !rc?.registryCustomerId) return null;
    return { apiUrl: rc.registryApiUrl, customerId: rc.registryCustomerId };
  }

  #requireConfig(): RegistryConfig {
    const config = this.#resolveConfig();
    if (!config) {
      throw new Error(
        'RegistryClientService: registry config is required for write operations. ' +
        'Provide CANVAS_REGISTRY_CONFIG or set registryApiUrl + registryCustomerId in config.json.'
      );
    }
    return config;
  }

  async #loadFallback(url: string): Promise<void> {
    try {
      const manifests = await firstValueFrom(
        this.#http.get<MfeManifest[]>(url)
      );
      this.#remotes.set(manifests);
    } catch {
      // No-op — app continues with an empty remote list.
    }
  }
}
