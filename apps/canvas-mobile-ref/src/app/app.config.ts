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
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideCanvasHttp } from '@pervaxis/canvas-platform-http';
import { provideCanvasCore } from '@pervaxis/canvas-shell-core';
import { routes } from './app.routes';

/** Root application providers for canvas-mobile-ref. */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideIonicAngular({ mode: 'ios' }),
    provideCanvasCore({ configUrl: '/assets/config.json' }),
    provideCanvasHttp({ retryAttempts: 1, timeoutMs: 15_000 }),
  ],
};
