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
import { EnvironmentProviders, ErrorHandler, makeEnvironmentProviders } from '@angular/core';
import { CanvasErrorHandler } from './handlers/canvas-error-handler';
import { CANVAS_ERROR_CONFIG, DEFAULT_ERROR_CONFIG } from './tokens/error-config.token';
import { CanvasErrorConfig } from './types/canvas-error.types';

/**
 * Registers the Canvas error handling infrastructure in the Angular DI tree.
 *
 * Replaces Angular's default `ErrorHandler` with `CanvasErrorHandler`, which
 * normalises all uncaught errors into `StructuredError` and routes them through
 * `CanvasErrorService` for reactive consumption and optional remote logging.
 *
 * @param config Optional runtime configuration (console logging, remote endpoint).
 *
 * @example
 * ```typescript
 * // app.config.ts (shell)
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideCanvasError({ remoteEndpoint: '/api/errors' }),
 *   ],
 * };
 * ```
 */
export function provideCanvasError(config?: CanvasErrorConfig): EnvironmentProviders {
  const resolved: CanvasErrorConfig = { ...DEFAULT_ERROR_CONFIG, ...config };
  return makeEnvironmentProviders([
    CanvasErrorHandler,
    { provide: ErrorHandler, useExisting: CanvasErrorHandler },
    { provide: CANVAS_ERROR_CONFIG, useValue: resolved },
  ]);
}
