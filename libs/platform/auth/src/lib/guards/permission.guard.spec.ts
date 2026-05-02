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
import { ActivatedRouteSnapshot, provideRouter, Router, UrlTree } from '@angular/router';
import { AuthContext } from '@pervaxis/canvas-mfe-contracts';
import { AuthContextService } from '../auth-context/auth-context.service';
import { permissionGuard } from './permission.guard';

const MOCK_CONTEXT: AuthContext = {
  userId: 'user-001',
  email: 'user@example.com',
  roles: ['admin'],
  permissions: ['invoices:read', 'invoices:write'],
  token: 'mock-jwt',
};

function makeRoute(permissions: string[]): ActivatedRouteSnapshot {
  return { data: { permissions } } as unknown as ActivatedRouteSnapshot;
}

describe('permissionGuard', () => {
  let authContextService: AuthContextService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    authContextService = TestBed.inject(AuthContextService);
    router = TestBed.inject(Router);
    authContextService.setContext(MOCK_CONTEXT);
  });

  it('returns true when route requires no permissions', () => {
    const result = TestBed.runInInjectionContext(() =>
      permissionGuard(makeRoute([]), {} as never)
    );
    expect(result).toBe(true);
  });

  it('returns true when route data has no permissions key', () => {
    const routeWithoutPermissions = { data: {} } as unknown as ActivatedRouteSnapshot;
    const result = TestBed.runInInjectionContext(() =>
      permissionGuard(routeWithoutPermissions, {} as never)
    );
    expect(result).toBe(true);
  });

  it('returns true when user has all required permissions', () => {
    const result = TestBed.runInInjectionContext(() =>
      permissionGuard(makeRoute(['invoices:read']), {} as never)
    );
    expect(result).toBe(true);
  });

  it('returns true when user has multiple required permissions', () => {
    const result = TestBed.runInInjectionContext(() =>
      permissionGuard(makeRoute(['invoices:read', 'invoices:write']), {} as never)
    );
    expect(result).toBe(true);
  });

  it('redirects to /forbidden when user is missing a required permission', () => {
    const result = TestBed.runInInjectionContext(() =>
      permissionGuard(makeRoute(['invoices:delete']), {} as never)
    ) as UrlTree;
    expect(result).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(result)).toBe('/forbidden');
  });

  it('redirects to /forbidden when user is missing one of multiple permissions', () => {
    const result = TestBed.runInInjectionContext(() =>
      permissionGuard(makeRoute(['invoices:read', 'invoices:delete']), {} as never)
    ) as UrlTree;
    expect(result).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(result)).toBe('/forbidden');
  });
});
