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

import { HttpContext, HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TimeoutError, catchError, throwError, timeout } from 'rxjs';
import { CANVAS_HTTP_CONFIG } from '../tokens/http-config.token';
import { CanvasHttpError } from '../types/canvas-http-error';

/**
 * Per-request timeout override (ms).
 * Pass via `HttpContext`; use {@link withTimeout} for a convenient builder.
 *
 * @example
 * http.get('/slow', { context: withTimeout(60_000) })
 */
export const REQUEST_TIMEOUT = new HttpContextToken<number>(() => 0);

/** Creates an `HttpContext` that overrides the timeout for a single request. */
export function withTimeout(ms: number): HttpContext {
  return new HttpContext().set(REQUEST_TIMEOUT, ms);
}

/**
 * Aborts requests that exceed the configured timeout and throws a structured
 * {@link CanvasHttpError} with `code: 'TIMEOUT'`.
 */
export const timeoutInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(CANVAS_HTTP_CONFIG);
  const ms = req.context.get(REQUEST_TIMEOUT) || config.timeoutMs;

  return next(req).pipe(
    timeout(ms),
    catchError((err: unknown) => {
      if (err instanceof TimeoutError) {
        const timeoutError: CanvasHttpError = {
          status: 0,
          code: 'TIMEOUT',
          message: `Request timed out after ${ms}ms`,
          correlationId: req.headers.get('X-Correlation-Id') ?? undefined,
          timestamp: Date.now(),
          details: null,
        };
        return throwError(() => timeoutError);
      }
      return throwError(() => err);
    })
  );
};
