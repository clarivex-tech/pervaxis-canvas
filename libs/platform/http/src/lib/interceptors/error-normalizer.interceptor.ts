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

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CanvasHttpError } from '../types/canvas-http-error';

/**
 * Maps raw `HttpErrorResponse` objects to typed {@link CanvasHttpError} values.
 * Non-HTTP errors (e.g. timeout errors) pass through unchanged.
 */
export const errorNormalizerInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        const normalized: CanvasHttpError = {
          status: err.status,
          code: codeFor(err.status),
          message: extractMessage(err),
          correlationId: req.headers.get('X-Correlation-Id') ?? undefined,
          timestamp: Date.now(),
          details: err.error,
        };
        return throwError(() => normalized);
      }
      return throwError(() => err);
    })
  );

function codeFor(status: number): string {
  if (status === 0) return 'NETWORK_ERROR';
  if (status === 400) return 'BAD_REQUEST';
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 409) return 'CONFLICT';
  if (status === 422) return 'UNPROCESSABLE';
  if (status === 429) return 'TOO_MANY_REQUESTS';
  if (status >= 500) return 'SERVER_ERROR';
  return 'HTTP_ERROR';
}

function extractMessage(err: HttpErrorResponse): string {
  if (typeof err.error === 'object' && err.error !== null) {
    const body = err.error as Record<string, unknown>;
    if (typeof body['message'] === 'string') return body['message'];
    if (typeof body['error'] === 'string') return body['error'];
  }
  return err.message || `HTTP error ${err.status}`;
}
