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

import { inject } from '@angular/core';
import { EnvironmentConfigService } from '../config/environment-config.service';
import { RemoteManifestLoader } from '../manifest/remote-manifest-loader.service';
import { RegistryClientService } from '../registry/registry-client.service';

/**
 * Factory function for the Canvas `APP_INITIALIZER`.
 *
 * Execution order:
 * 1. `EnvironmentConfigService.load()` — fetches `/assets/config.json`
 * 2. In parallel:
 *    - `RemoteManifestLoader.load()` — raw URL manifest fetch (legacy/simple)
 *    - `RegistryClientService.loadRemotes()` — full registry API with caching + retry
 *
 * Registered automatically by `provideCanvasCore()`.
 */
export function appInitializerFactory(): () => Promise<void> {
  const configService = inject(EnvironmentConfigService);
  const manifestLoader = inject(RemoteManifestLoader);
  const registryClient = inject(RegistryClientService);

  return async () => {
    await configService.load();
    await Promise.all([manifestLoader.load(), registryClient.loadRemotes()]);
  };
}
