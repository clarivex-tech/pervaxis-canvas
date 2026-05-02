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
import { firstValueFrom } from 'rxjs';
import { MfeManifest } from '@pervaxis/canvas-mfe-contracts';
import { EnvironmentConfigService } from '../config/environment-config.service';

/**
 * Fetches and caches the list of registered MFE remotes from the
 * Canvas registry endpoint configured in `CanvasRuntimeConfig.registryUrl`.
 *
 * When `registryUrl` is absent, `load()` is a no-op and `manifests`
 * remains an empty array — the shell simply has no dynamic remotes.
 *
 * @example
 * const loader = inject(RemoteManifestLoader);
 * const all = loader.manifests();
 * const orders = loader.getManifest('orders-mfe');
 */
@Injectable({ providedIn: null })
export class RemoteManifestLoader {
  readonly #http = inject(HttpClient);
  readonly #configService = inject(EnvironmentConfigService);

  readonly #manifests = signal<MfeManifest[]>([]);

  /** All loaded MFE manifests. Empty array until `load()` resolves. */
  readonly manifests: Signal<MfeManifest[]> = this.#manifests.asReadonly();

  /** Lookup table keyed by manifest `name` for O(1) access. */
  readonly #manifestMap = computed(() =>
    new Map(this.#manifests().map((m) => [m.name, m]))
  );

  /**
   * Fetches the MFE manifest list from the registry URL.
   * No-op when `CanvasRuntimeConfig.registryUrl` is not set.
   * Called automatically by `APP_INITIALIZER` after config is loaded.
   */
  async load(): Promise<void> {
    const registryUrl = this.#configService.config()?.registryUrl;
    if (!registryUrl) return;

    const manifests = await firstValueFrom(
      this.#http.get<MfeManifest[]>(registryUrl)
    );
    this.#manifests.set(manifests);
  }

  /**
   * Returns the manifest for the given remote name, or `undefined`
   * if no manifest with that name was loaded.
   *
   * @param name - The logical remote name (matches `MfeManifest.name`).
   */
  getManifest(name: string): MfeManifest | undefined {
    return this.#manifestMap().get(name);
  }
}
