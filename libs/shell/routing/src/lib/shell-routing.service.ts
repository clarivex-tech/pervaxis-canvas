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

import { Injectable, inject } from '@angular/core';
import { Route, Router } from '@angular/router';
import { RemoteManifestLoader } from '@pervaxis/canvas-shell-core';
import { CanvasNotFoundComponent } from './components/not-found/canvas-not-found.component';
import { CANVAS_MFE_MODULE_LOADER, CANVAS_NOT_FOUND_REDIRECT } from './tokens/routing-tokens';

/**
 * Registers lazy MFE routes into the Angular router at runtime,
 * driven by the manifests loaded from the Canvas registry.
 *
 * Call `registerMfeRoutes()` once manifests are loaded — typically
 * as part of an `APP_INITIALIZER` chain after `provideCanvasCore()`.
 *
 * @example
 * // In your APP_INITIALIZER (after canvas core initializes):
 * const routing = inject(ShellRoutingService);
 * routing.registerMfeRoutes();
 */
@Injectable({ providedIn: null })
export class ShellRoutingService {
  readonly #router = inject(Router);
  readonly #manifestLoader = inject(RemoteManifestLoader);
  readonly #moduleLoader = inject(CANVAS_MFE_MODULE_LOADER);
  readonly #notFoundRedirect = inject(CANVAS_NOT_FOUND_REDIRECT, { optional: true });

  /**
   * Reads the current manifest list and inserts a lazy `loadComponent`
   * route for each MFE into the router config.
   *
   * - Preserves all existing non-wildcard routes.
   * - Appends MFE routes after existing routes.
   * - Appends a `**` catch-all that either redirects (when
   *   `CANVAS_NOT_FOUND_REDIRECT` is provided) or renders
   *   `CanvasNotFoundComponent`.
   *
   * Safe to call multiple times — existing MFE routes are replaced,
   * not duplicated, on each call.
   */
  registerMfeRoutes(): void {
    const manifests = this.#manifestLoader.manifests();
    const loader = this.#moduleLoader;

    const mfeRoutes: Route[] = manifests.map((manifest) => ({
      path: manifest.routePath,
      loadComponent: () => loader(manifest),
    }));

    const catchAllRoute: Route =
      this.#notFoundRedirect !== null
        ? { path: '**', redirectTo: this.#notFoundRedirect }
        : { path: '**', component: CanvasNotFoundComponent };

    const baseRoutes = this.#router.config.filter((r) => r.path !== '**');
    this.#router.resetConfig([...baseRoutes, ...mfeRoutes, catchAllRoute]);
  }
}
