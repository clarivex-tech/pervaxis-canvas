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

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { NetworkService } from '../services/network.service';
import { CanvasHttpError } from '../types/canvas-http-error';

/**
 * Functional HTTP interceptor that short-circuits requests when the device
 * has no network connectivity (as reported by {@link NetworkService}).
 *
 * Throws a {@link CanvasHttpError} with `status: 0` and `code: 'NETWORK_OFFLINE'`.
 *
 * Add to `provideCanvasHttp()` or your own `withInterceptors()` call:
 *
 * @example
 * provideHttpClient(withInterceptors([offlineInterceptor, jwtInterceptor]))
 */
export const offlineInterceptor: HttpInterceptorFn = (req, next) => {
  const network = inject(NetworkService);

  if (network.isOffline()) {
    const error: CanvasHttpError = {
      status: 0,
      code: 'NETWORK_OFFLINE',
      message: 'No network connection. Please check your internet and try again.',
      correlationId: undefined,
      timestamp: Date.now(),
      details: null,
    };
    return throwError(() => error);
  }

  return next(req);
};
