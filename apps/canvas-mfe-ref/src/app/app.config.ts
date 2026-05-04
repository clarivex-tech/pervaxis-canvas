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
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideMfeBootstrap } from '@pervaxis/canvas-mfe-bootstrap';
import { provideCanvasHttp } from '@pervaxis/canvas-platform-http';
import { provideCanvasI18n } from '@pervaxis/canvas-platform-i18n';
import { routes } from './app.routes';

/**
 * Root application providers for canvas-mfe-ref.
 *
 * When loaded as a native federation remote, the shell host injects shared
 * providers (auth context, event bus, shared state) via `CANVAS_AUTH_CONTEXT`
 * and `CANVAS_EVENT_BUS` tokens. This config is used for standalone development.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideRouter(routes, withComponentInputBinding()),
    provideCanvasHttp({ retryAttempts: 2, timeoutMs: 20_000 }),
    provideCanvasI18n({
      availableLangs: ['en'],
      defaultLang: 'en',
      fallbackLang: 'en',
      assetsPath: '/assets/i18n/',
    }),
    provideMfeBootstrap({ mfeName: 'products-mfe' }),
  ],
};
