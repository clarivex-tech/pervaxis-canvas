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
import { permissionGuard } from '@pervaxis/canvas-platform-auth';

/**
 * Feature routes for the Products MFE.
 * When loaded by the shell, these are mounted under the `routePath`
 * defined in the MFE's registry manifest (e.g. `/products`).
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/product-list/product-list.page').then(
        (m) => m.ProductListPage
      ),
    canActivate: [permissionGuard],
    data: { breadcrumb: 'Products', requiredPermissions: ['products:read'] },
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/product-detail/product-detail.page').then(
        (m) => m.ProductDetailPage
      ),
    data: { breadcrumb: 'Product Detail' },
  },
];
