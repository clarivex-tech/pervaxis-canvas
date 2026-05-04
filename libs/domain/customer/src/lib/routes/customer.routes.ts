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

import { Routes } from '@angular/router';
import { authGuard, permissionGuard } from '@pervaxis/canvas-platform-auth';

/**
 * Routes for the Customer domain module.
 *
 * Usage — register lazily from your shell or MFE routing module:
 *
 * ```typescript
 * {
 *   path: 'customers',
 *   canActivate: [authGuard],
 *   loadChildren: () =>
 *     import('@pervaxis/canvas-domain-customer').then(m => m.CUSTOMER_ROUTES),
 * }
 * ```
 *
 * Permissions:
 * - List + Detail: `customers:read`
 * - Create + Edit: `customers:write`
 */
export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['customers:read'] },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../pages/customer-list/customer-list.page').then(m => m.CustomerListPage),
      },
      {
        path: 'create',
        canActivate: [permissionGuard],
        data: { permissions: ['customers:write'] },
        loadComponent: () =>
          import('../pages/customer-form/customer-form.page').then(m => m.CustomerFormPage),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('../pages/customer-detail/customer-detail.page').then(m => m.CustomerDetailPage),
      },
      {
        path: ':id/edit',
        canActivate: [permissionGuard],
        data: { permissions: ['customers:write'] },
        loadComponent: () =>
          import('../pages/customer-form/customer-form.page').then(m => m.CustomerFormPage),
      },
    ],
  },
];
