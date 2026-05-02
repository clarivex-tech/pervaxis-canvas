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

import { APP_INITIALIZER, EnvironmentProviders, Provider, inject, makeEnvironmentProviders } from '@angular/core';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { CANVAS_AUTH_CONFIG, CanvasAuthConfig } from './config/canvas-auth-config';
import { ShellAuthService } from './services/shell-auth.service';

/**
 * Registers all Canvas Shell Auth providers:
 * - `OAuthService` via `provideOAuthClient()`
 * - `ShellAuthService` — OIDC lifecycle, login/logout, context sync
 * - `APP_INITIALIZER` — configures OIDC and processes the auth callback on boot
 *
 * **JWT interceptor is NOT auto-registered** — add `jwtInterceptor` to your
 * `provideHttpClient(withInterceptors([jwtInterceptor]))` call so the interceptor
 * order relative to `canvas-platform-http` interceptors is explicit.
 *
 * @example
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideCanvasCore(),
 *     provideCanvasAuth({
 *       issuer: 'https://auth.example.com',
 *       clientId: 'shell-client',
 *     }),
 *     provideHttpClient(withFetch(), withInterceptors([jwtInterceptor])),
 *   ],
 * };
 */
export function provideCanvasAuth(config: CanvasAuthConfig): EnvironmentProviders {
  const providers: (Provider | EnvironmentProviders)[] = [
    provideOAuthClient(),
    ShellAuthService,
    { provide: CANVAS_AUTH_CONFIG, useValue: config },
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const authService = inject(ShellAuthService);
        return () => authService.initialize();
      },
      multi: true,
    },
  ];

  return makeEnvironmentProviders(providers);
}
