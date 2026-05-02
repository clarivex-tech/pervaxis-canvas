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

import { Component, Type, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { MfeManifest } from '@pervaxis/canvas-mfe-contracts';
import { RemoteManifestLoader } from '@pervaxis/canvas-shell-core';
import { CanvasNotFoundComponent } from './components/not-found/canvas-not-found.component';
import { ShellRoutingService } from './shell-routing.service';
import { CANVAS_MFE_MODULE_LOADER, CANVAS_NOT_FOUND_REDIRECT } from './tokens/routing-tokens';

@Component({ standalone: true, template: '' })
class FakeRemoteComponent {}

const MOCK_MANIFESTS: MfeManifest[] = [
  {
    name: 'orders-mfe',
    remoteEntry: 'https://orders.example.com/remoteEntry.json',
    exposedModule: './Module',
    routePath: 'orders',
  },
  {
    name: 'inventory-mfe',
    remoteEntry: 'https://inventory.example.com/remoteEntry.json',
    exposedModule: './Module',
    routePath: 'inventory',
  },
];

const mockLoader = vi.fn(
  (_manifest: MfeManifest): Promise<Type<unknown>> => Promise.resolve(FakeRemoteComponent)
);

function makeManifestLoader(manifests: MfeManifest[]) {
  return { manifests: signal(manifests) };
}

describe('ShellRoutingService', () => {
  let service: ShellRoutingService;
  let router: Router;

  describe('without CANVAS_NOT_FOUND_REDIRECT (default not-found component)', () => {
    beforeEach(() => {
      mockLoader.mockClear();
      TestBed.configureTestingModule({
        providers: [
          provideRouter([{ path: 'home', component: FakeRemoteComponent }]),
          ShellRoutingService,
          { provide: RemoteManifestLoader, useValue: makeManifestLoader(MOCK_MANIFESTS) },
          { provide: CANVAS_MFE_MODULE_LOADER, useValue: mockLoader },
        ],
      });
      service = TestBed.inject(ShellRoutingService);
      router = TestBed.inject(Router);
    });

    it('adds one route per manifest', () => {
      service.registerMfeRoutes();
      const paths = router.config.map((r) => r.path);
      expect(paths).toContain('orders');
      expect(paths).toContain('inventory');
    });

    it('preserves existing non-wildcard routes', () => {
      service.registerMfeRoutes();
      expect(router.config.some((r) => r.path === 'home')).toBe(true);
    });

    it('appends a ** catch-all with CanvasNotFoundComponent', () => {
      service.registerMfeRoutes();
      const catchAll = router.config.find((r) => r.path === '**');
      expect(catchAll).toBeDefined();
      expect(catchAll?.component).toBe(CanvasNotFoundComponent);
    });

    it('catch-all is the last route', () => {
      service.registerMfeRoutes();
      const last = router.config[router.config.length - 1];
      expect(last.path).toBe('**');
    });

    it('routes use loadComponent pointing to the module loader', async () => {
      service.registerMfeRoutes();
      const ordersRoute = router.config.find((r) => r.path === 'orders');
      expect(ordersRoute?.loadComponent).toBeDefined();
      const loadFn = ordersRoute?.loadComponent as () => Promise<Type<unknown>>;
      const component = await loadFn();
      expect(component).toBe(FakeRemoteComponent);
    });

    it('loader receives the correct manifest', async () => {
      service.registerMfeRoutes();
      const ordersRoute = router.config.find((r) => r.path === 'orders');
      const loadFn = ordersRoute?.loadComponent as () => Promise<Type<unknown>>;
      await loadFn();
      expect(mockLoader).toHaveBeenCalledWith(MOCK_MANIFESTS[0]);
    });

    it('does not duplicate ** route on repeated calls', () => {
      service.registerMfeRoutes();
      service.registerMfeRoutes();
      const catchAlls = router.config.filter((r) => r.path === '**');
      expect(catchAlls).toHaveLength(1);
    });

  });

  describe('when manifests are empty', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideRouter([{ path: 'home', component: FakeRemoteComponent }]),
          ShellRoutingService,
          { provide: RemoteManifestLoader, useValue: makeManifestLoader([]) },
          { provide: CANVAS_MFE_MODULE_LOADER, useValue: mockLoader },
        ],
      });
      service = TestBed.inject(ShellRoutingService);
      router = TestBed.inject(Router);
    });

    it('registers no MFE routes', () => {
      service.registerMfeRoutes();
      const mfeRoutes = router.config.filter(
        (r) => r.path !== 'home' && r.path !== '**'
      );
      expect(mfeRoutes).toHaveLength(0);
    });

    it('still appends the catch-all route', () => {
      service.registerMfeRoutes();
      expect(router.config.some((r) => r.path === '**')).toBe(true);
    });
  });

  describe('with CANVAS_NOT_FOUND_REDIRECT', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideRouter([]),
          ShellRoutingService,
          { provide: RemoteManifestLoader, useValue: makeManifestLoader(MOCK_MANIFESTS) },
          { provide: CANVAS_MFE_MODULE_LOADER, useValue: mockLoader },
          { provide: CANVAS_NOT_FOUND_REDIRECT, useValue: '/not-found' },
        ],
      });
      service = TestBed.inject(ShellRoutingService);
      router = TestBed.inject(Router);
    });

    it('catch-all uses redirectTo instead of component', () => {
      service.registerMfeRoutes();
      const catchAll = router.config.find((r) => r.path === '**');
      expect(catchAll?.redirectTo).toBe('/not-found');
      expect(catchAll?.component).toBeUndefined();
    });
  });
});
