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

import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { BreadcrumbService } from './breadcrumb.service';

@Component({ standalone: true, template: '' })
class StubComponent {}

describe('BreadcrumbService', () => {
  let service: BreadcrumbService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        BreadcrumbService,
        provideRouter([
          {
            path: 'dashboard',
            component: StubComponent,
            data: { breadcrumb: 'Dashboard' },
          },
          {
            path: 'settings',
            component: StubComponent,
            data: { breadcrumb: 'Settings' },
            children: [
              {
                path: 'profile',
                component: StubComponent,
                data: { breadcrumb: 'Profile' },
              },
            ],
          },
          { path: '', component: StubComponent },
        ]),
      ],
    });
    service = TestBed.inject(BreadcrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose a readonly breadcrumbs signal', () => {
    expect(Array.isArray(service.breadcrumbs())).toBe(true);
  });

  it('should start with an empty breadcrumb trail on root route', async () => {
    const router = TestBed.inject(Router);
    await router.navigate(['']);
    expect(service.breadcrumbs()).toHaveLength(0);
  });

  it('should build a single crumb for a top-level route with breadcrumb data', async () => {
    const router = TestBed.inject(Router);
    await router.navigate(['dashboard']);
    const crumbs = service.breadcrumbs();
    expect(crumbs).toHaveLength(1);
    expect(crumbs[0].label).toBe('Dashboard');
    expect(crumbs[0].path).toBe('/dashboard');
  });

  it('should build a nested breadcrumb trail for child routes', async () => {
    const router = TestBed.inject(Router);
    await router.navigate(['settings', 'profile']);
    const crumbs = service.breadcrumbs();
    expect(crumbs).toHaveLength(2);
    expect(crumbs[0].label).toBe('Settings');
    expect(crumbs[1].label).toBe('Profile');
  });

  it('should update the trail on subsequent navigation', async () => {
    const router = TestBed.inject(Router);
    await router.navigate(['dashboard']);
    expect(service.breadcrumbs()[0].label).toBe('Dashboard');

    await router.navigate(['settings']);
    expect(service.breadcrumbs()[0].label).toBe('Settings');
  });

  it('should produce a path of "/" for a root segment with breadcrumb data', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      providers: [
        BreadcrumbService,
        provideRouter([
          { path: '', component: StubComponent, data: { breadcrumb: 'Root' } },
        ]),
      ],
    }).compileComponents();
    const rootService = TestBed.inject(BreadcrumbService);
    const router = TestBed.inject(Router);
    await router.navigate(['']);
    const crumbs = rootService.breadcrumbs();
    expect(crumbs[0].path).toBe('/');
  });
});
