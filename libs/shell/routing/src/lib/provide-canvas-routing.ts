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

import { EnvironmentProviders, Provider, makeEnvironmentProviders } from '@angular/core';
import { ShellRoutingService } from './shell-routing.service';
import {
  CANVAS_MFE_MODULE_LOADER,
  CANVAS_NOT_FOUND_REDIRECT,
  MfeModuleLoader,
} from './tokens/routing-tokens';

/** Configuration for `provideCanvasRouting()`. */
export interface CanvasRoutingConfig {
  /**
   * Async loader that resolves a remote Angular component for a given manifest.
   * Wire in `loadRemoteModule` from `@angular-architects/native-federation` here.
   *
   * @example
   * import { loadRemoteModule } from '@angular-architects/native-federation';
   * loader: (m) => loadRemoteModule(m.name, m.exposedModule).then(mod => mod.default)
   */
  loader: MfeModuleLoader;

  /**
   * Route path to redirect to when no route matches (`**` catch-all).
   * When omitted, `CanvasNotFoundComponent` is rendered instead.
   */
  notFoundRedirectTo?: string;
}

/**
 * Registers Canvas Shell Routing providers:
 * - `ShellRoutingService` — dynamic MFE route registration
 * - `CANVAS_MFE_MODULE_LOADER` — the loader function for remote modules
 *
 * Use alongside `provideCanvasCore()` and `provideRouter()`.
 *
 * @example
 * import { loadRemoteModule } from '@angular-architects/native-federation';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideCanvasCore(),
 *     provideRouter(appRoutes),
 *     provideCanvasRouting({
 *       loader: (m) => loadRemoteModule(m.name, m.exposedModule).then(mod => mod.default),
 *       notFoundRedirectTo: '/not-found',
 *     }),
 *   ],
 * };
 */
export function provideCanvasRouting(config: CanvasRoutingConfig): EnvironmentProviders {
  const providers: Provider[] = [
    ShellRoutingService,
    { provide: CANVAS_MFE_MODULE_LOADER, useValue: config.loader },
  ];

  if (config.notFoundRedirectTo !== undefined) {
    providers.push({ provide: CANVAS_NOT_FOUND_REDIRECT, useValue: config.notFoundRedirectTo });
  }

  return makeEnvironmentProviders(providers);
}
