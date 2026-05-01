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

import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, switchMap, throwError, timer } from 'rxjs';
import { CANVAS_HTTP_CONFIG } from '../tokens/http-config.token';

/** HTTP status codes that are safe to retry. */
const RETRYABLE_STATUSES = new Set([0, 429, 500, 502, 503, 504]);

/**
 * Retries failed requests with exponential backoff.
 *
 * Retryable statuses: network errors (0), 429, 5xx.
 * Client errors (4xx) are never retried.
 * Delay formula: `retryDelayMs × 2^attempt`.
 */
export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  const { retryAttempts, retryDelayMs } = inject(CANVAS_HTTP_CONFIG);

  const attempt = (count: number): Observable<HttpEvent<unknown>> =>
    next(req).pipe(
      catchError((err: unknown) => {
        const status = statusOf(err);
        if (count >= retryAttempts || !RETRYABLE_STATUSES.has(status)) {
          return throwError(() => err);
        }
        const backoff = retryDelayMs * Math.pow(2, count);
        return timer(backoff).pipe(switchMap(() => attempt(count + 1)));
      })
    );

  return attempt(0);
};

function statusOf(err: unknown): number {
  if (typeof err === 'object' && err !== null && 'status' in err) {
    const s = (err as { status: unknown }).status;
    if (typeof s === 'number') return s;
  }
  return 0;
}
