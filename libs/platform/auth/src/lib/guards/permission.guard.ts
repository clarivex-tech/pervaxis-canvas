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
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthContextService } from '../auth-context/auth-context.service';

/**
 * Route guard that blocks navigation to permission-gated routes.
 *
 * Required permissions are read from `route.data['permissions']` as a
 * `string[]`. All listed permissions must be present on the current user.
 * Redirects to `/forbidden` when the check fails.
 *
 * @example
 * ```typescript
 * {
 *   path: 'admin',
 *   canActivate: [authGuard, permissionGuard],
 *   data: { permissions: ['admin:access'] },
 *   component: AdminComponent,
 * }
 * ```
 */
export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authContext = inject(AuthContextService);
  const router = inject(Router);

  const required: string[] = route.data['permissions'] ?? [];

  if (required.length === 0 || authContext.hasPermission(...required)) {
    return true;
  }

  return router.createUrlTree(['/forbidden']);
};
