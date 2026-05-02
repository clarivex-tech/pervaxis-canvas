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
import { provideRouter, Router, UrlTree } from '@angular/router';
import { AuthContext } from '@pervaxis/canvas-mfe-contracts';
import { AuthContextService } from '../auth-context/auth-context.service';
import { authGuard } from './auth.guard';

const MOCK_CONTEXT: AuthContext = {
  userId: 'user-001',
  email: 'user@example.com',
  roles: ['viewer'],
  permissions: [],
  token: 'mock-jwt',
};

describe('authGuard', () => {
  let authContextService: AuthContextService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    authContextService = TestBed.inject(AuthContextService);
    router = TestBed.inject(Router);
  });

  it('returns true when user is authenticated', () => {
    authContextService.setContext(MOCK_CONTEXT);
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, {} as never)
    );
    expect(result).toBe(true);
  });

  it('redirects to /login when not authenticated', () => {
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, {} as never)
    ) as UrlTree;
    expect(result).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(result)).toBe('/login');
  });
});
