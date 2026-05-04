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

/**
 * Runtime environment configuration loaded from `/assets/config.json`
 * (or a custom URL) before the Angular application bootstraps.
 *
 * All properties are read-only after load. Extend this interface in
 * print-specific code to add customer-specific config keys.
 */
export interface CanvasRuntimeConfig {
  /** Base URL prepended to all API requests. */
  apiBaseUrl: string;
  /** URL of the MFE registry endpoint. When omitted, manifest loading is skipped. */
  registryUrl?: string;
  /**
   * Base URL of the Canvas Registry REST API, e.g. `https://registry.pervaxis.io`.
   * Required alongside `registryCustomerId` to enable `RegistryClientService`.
   */
  registryApiUrl?: string;
  /**
   * Customer identifier used as the `{customerId}` path parameter in
   * `GET /api/registry/{customerId}/remotes`. Required when `registryApiUrl` is set.
   */
  registryCustomerId?: string;
  /** OIDC authority/issuer URL (e.g. `https://auth.example.com`). */
  oidcIssuer?: string;
  /** OIDC client ID registered with the identity provider. */
  oidcClientId?: string;
}

/**
 * Injection token for the URL of the runtime config JSON file.
 * Defaults to `/assets/config.json` when not explicitly provided.
 */
export const CANVAS_CONFIG_URL = new InjectionToken<string>('CANVAS_CONFIG_URL', {
  factory: () => '/assets/config.json',
});
