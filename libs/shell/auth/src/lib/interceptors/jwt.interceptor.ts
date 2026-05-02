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
import { OAuthService } from 'angular-oauth2-oidc';

/**
 * Functional HTTP interceptor that injects the OIDC access token as a
 * `Authorization: Bearer <token>` header on every outbound request.
 *
 * Skips requests that already carry an `Authorization` header, and
 * passes through unauthenticated requests unchanged.
 *
 * Register via `provideHttpClient(withInterceptors([jwtInterceptor]))`.
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const oauthService = inject(OAuthService);

  if (req.headers.has('Authorization')) return next(req);

  const token = oauthService.getAccessToken();
  if (!token) return next(req);

  return next(
    req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
  );
};
