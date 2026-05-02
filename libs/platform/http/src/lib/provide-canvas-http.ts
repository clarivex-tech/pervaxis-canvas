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

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders, Provider, makeEnvironmentProviders } from '@angular/core';
import { correlationIdInterceptor } from './interceptors/correlation-id.interceptor';
import { errorNormalizerInterceptor } from './interceptors/error-normalizer.interceptor';
import { retryInterceptor } from './interceptors/retry.interceptor';
import { timeoutInterceptor } from './interceptors/timeout.interceptor';
import { CANVAS_HTTP_CONFIG, CanvasHttpConfig, DEFAULT_HTTP_CONFIG } from './tokens/http-config.token';

/**
 * Registers the Canvas HTTP interceptor stack.
 *
 * Interceptor order (outermost → innermost):
 * 1. `correlationIdInterceptor` — stamps `X-Correlation-Id` on every request
 * 2. `retryInterceptor` — retries with exponential backoff
 * 3. `timeoutInterceptor` — per-request/global timeout
 * 4. `errorNormalizerInterceptor` — maps `HttpErrorResponse` → `CanvasHttpError`
 *
 * @example
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [provideCanvasHttp({ retryAttempts: 2, timeoutMs: 15_000 })],
 * };
 */
export function provideCanvasHttp(config?: Partial<CanvasHttpConfig>): EnvironmentProviders {
  const providers: (Provider | EnvironmentProviders)[] = [
    provideHttpClient(
      withFetch(),
      withInterceptors([
        correlationIdInterceptor,
        retryInterceptor,
        timeoutInterceptor,
        errorNormalizerInterceptor,
      ])
    ),
  ];

  if (config) {
    providers.push({
      provide: CANVAS_HTTP_CONFIG,
      useValue: { ...DEFAULT_HTTP_CONFIG, ...config },
    });
  }

  return makeEnvironmentProviders(providers);
}
