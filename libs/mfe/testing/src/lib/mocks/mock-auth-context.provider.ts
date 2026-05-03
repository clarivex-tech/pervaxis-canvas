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

import { Provider } from '@angular/core';
import { signal } from '@angular/core';
import { AuthContext, CANVAS_AUTH_CONTEXT } from '@pervaxis/canvas-mfe-contracts';

/**
 * A fully-populated `AuthContext` fixture for use in MFE unit tests.
 * Override individual fields via the `overrides` parameter.
 */
export function createMockAuthContext(overrides?: Partial<AuthContext>): AuthContext {
  return {
    userId: 'test-user-id',
    email: 'test@example.com',
    roles: ['viewer'],
    permissions: [],
    token: 'mock-jwt-token',
    ...overrides,
  };
}

/**
 * Provides a mock `CANVAS_AUTH_CONTEXT` signal for use in `TestBed`.
 *
 * Pass `null` to simulate an unauthenticated shell (default).
 * Pass a partial `AuthContext` to simulate an authenticated user —
 * unspecified fields are filled from `createMockAuthContext` defaults.
 *
 * @example
 * TestBed.configureTestingModule({
 *   providers: [
 *     mockCanvasAuthContext({ roles: ['admin'], permissions: ['orders:write'] }),
 *   ],
 * });
 *
 * @param context - Auth context to expose, or `null` for unauthenticated.
 */
export function mockCanvasAuthContext(context: Partial<AuthContext> | null = null): Provider {
  const value = context === null ? null : createMockAuthContext(context);
  return {
    provide: CANVAS_AUTH_CONTEXT,
    useValue: signal(value),
  };
}
