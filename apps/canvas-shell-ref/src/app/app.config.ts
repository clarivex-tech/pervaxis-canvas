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

import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideCanvasCore } from '@pervaxis/canvas-shell-core';
import { provideCanvasAuth, jwtInterceptor } from '@pervaxis/canvas-shell-auth';
import { provideCanvasLayout } from '@pervaxis/canvas-shell-layout';
import { provideCanvasRouting } from '@pervaxis/canvas-shell-routing';
import { provideCanvasHttp } from '@pervaxis/canvas-platform-http';
import { provideCanvasState } from '@pervaxis/canvas-platform-state';
import { provideCanvasError } from '@pervaxis/canvas-platform-error';
import { provideCanvasI18n } from '@pervaxis/canvas-platform-i18n';
import { routes } from './app.routes';

/**
 * Root application providers for canvas-shell-ref.
 *
 * OIDC config is read from `/assets/config.json` at runtime so the same
 * build artifact can point to different identity providers per environment.
 *
 * MFE loader: wire in `loadRemoteModule` from `@angular-architects/native-federation`
 * when native federation build support is added to this app.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),

    // Shell core — loads config.json + registry on bootstrap
    provideCanvasCore({ configUrl: '/assets/config.json' }),

    // OIDC auth — issuer and clientId resolved from runtime config in ShellAuthService
    provideCanvasAuth({ issuer: '', clientId: '' }),

    // HTTP with JWT interceptor + Canvas interceptors (retry, timeout, correlation-id)
    provideHttpClient(
      withFetch(),
      withInterceptors([jwtInterceptor])
    ),
    provideCanvasHttp({ retryAttempts: 3, timeoutMs: 30_000 }),

    // Router
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),

    // MFE dynamic routing
    // Replace the stub loader with loadRemoteModule from @angular-architects/native-federation
    // once NF build support is added:
    //   loader: (m) => loadRemoteModule(m.name, m.exposedModule).then(mod => mod.default)
    provideCanvasRouting({
      loader: async (manifest) => {
        throw new Error(
          `Native federation loader not configured. ` +
          `Install @angular-architects/native-federation and wire loadRemoteModule for: ${manifest.name}`
        );
      },
    }),

    // Shell layout — BreadcrumbService
    provideCanvasLayout(),

    // Platform services
    provideCanvasState(),
    provideCanvasError({ enableConsoleLog: true }),
    provideCanvasI18n({
      availableLangs: ['en', 'fr', 'de'],
      defaultLang: 'en',
      fallbackLang: 'en',
      translationsPath: '/assets/i18n',
    }),
  ],
};
