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
import { authGuard } from '@pervaxis/canvas-platform-auth';
import { CanvasNotFoundComponent } from '@pervaxis/canvas-shell-routing';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
    data: { breadcrumb: 'Login' },
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
    canActivate: [authGuard],
    data: { breadcrumb: 'Dashboard' },
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.page').then((m) => m.SettingsPage),
    canActivate: [authGuard],
    data: { breadcrumb: 'Settings' },
  },
  // Dynamic MFE routes are registered at runtime by ShellRoutingService.
  // The catch-all must remain last so registered routes take priority.
  {
    path: '**',
    component: CanvasNotFoundComponent,
  },
];
