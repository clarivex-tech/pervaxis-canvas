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

import { APP_INITIALIZER, EnvironmentProviders, Provider, makeEnvironmentProviders } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { CANVAS_CONFIG_URL } from './config/canvas-runtime-config';
import { EnvironmentConfigService } from './config/environment-config.service';
import { appInitializerFactory } from './initializer/app-initializer.factory';
import { RemoteManifestLoader } from './manifest/remote-manifest-loader.service';

/** Configuration options for `provideCanvasCore()`. */
export interface CanvasCoreConfig {
  /**
   * URL of the runtime environment JSON file.
   * Defaults to `/assets/config.json` when omitted.
   */
  configUrl?: string;
}

/**
 * Registers all Canvas Shell Core providers:
 * - `EnvironmentConfigService` — runtime config loader
 * - `RemoteManifestLoader` — MFE registry client
 * - `APP_INITIALIZER` — sequentially loads config then manifests before first render
 *
 * Include `provideHttpClient()` in the same `providers` array if your
 * app does not already have it — or pass `includeHttpClient: true`.
 *
 * @example
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideCanvasCore({ configUrl: '/assets/env.json' }),
 *   ],
 * };
 */
export function provideCanvasCore(config?: CanvasCoreConfig): EnvironmentProviders {
  const providers: (Provider | EnvironmentProviders)[] = [
    provideHttpClient(withFetch()),
    EnvironmentConfigService,
    RemoteManifestLoader,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      multi: true,
    },
  ];

  if (config?.configUrl) {
    providers.push({ provide: CANVAS_CONFIG_URL, useValue: config.configUrl });
  }

  return makeEnvironmentProviders(providers);
}
