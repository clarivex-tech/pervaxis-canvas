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
import { CanActivateFn, Router } from '@angular/router';
import { AuthContextService } from '../auth-context/auth-context.service';

/**
 * Route guard that blocks navigation to authenticated-only routes.
 *
 * Redirects unauthenticated users to `/login`. Use in conjunction with
 * `PermissionGuard` for permission-gated routes.
 *
 * @example
 * ```typescript
 * { path: 'dashboard', canActivate: [authGuard], component: DashboardComponent }
 * ```
 */
export const authGuard: CanActivateFn = () => {
  const authContext = inject(AuthContextService);
  const router = inject(Router);

  if (authContext.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
