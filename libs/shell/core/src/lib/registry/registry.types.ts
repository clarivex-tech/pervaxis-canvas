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

import { InjectionToken } from '@angular/core';
import { MfeManifest } from '@pervaxis/canvas-mfe-contracts';

/**
 * Shape of the JSON body returned by
 * `GET /api/registry/{customerId}/remotes`.
 */
export interface RegistryResponse {
  /** Customer this registry belongs to. */
  customerId: string;
  /** All registered MFE remotes for this customer. */
  remotes: MfeManifest[];
}

/**
 * Configuration for the `RegistryClientService`.
 * Provided via `provideCanvasCore()` or read from `CanvasRuntimeConfig`
 * when `registryApiUrl` and `registryCustomerId` are present in the runtime JSON.
 */
export interface RegistryConfig {
  /** Base URL of the Canvas Registry API, e.g. `https://registry.pervaxis.io`. */
  apiUrl: string;
  /** Customer identifier that scopes the remote registry (path param). */
  customerId: string;
  /**
   * URL of the static fallback file served when the registry API is unavailable.
   * Defaults to `/assets/registry.json`.
   */
  fallbackUrl?: string;
}

/**
 * Optional injection token for supplying `RegistryConfig` directly.
 * When absent, `RegistryClientService` reads config from `CanvasRuntimeConfig`
 * (`registryApiUrl` + `registryCustomerId` fields).
 */
export const CANVAS_REGISTRY_CONFIG = new InjectionToken<RegistryConfig>(
  'CANVAS_REGISTRY_CONFIG'
);
