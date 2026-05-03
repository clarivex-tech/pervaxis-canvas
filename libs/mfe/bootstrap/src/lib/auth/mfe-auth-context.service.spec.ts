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
import { signal } from '@angular/core';
import { AuthContext, CANVAS_AUTH_CONTEXT } from '@pervaxis/canvas-mfe-contracts';
import { MfeAuthContextService } from './mfe-auth-context.service';

const MOCK_CONTEXT: AuthContext = {
  userId: 'user-1',
  email: 'user@example.com',
  roles: ['admin', 'viewer'],
  permissions: ['invoices:read', 'invoices:write'],
  token: 'jwt.token.here',
};

describe('MfeAuthContextService', () => {
  describe('without CANVAS_AUTH_CONTEXT provided', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({ providers: [MfeAuthContextService] });
    });

    it('context() is null', () => {
      expect(TestBed.inject(MfeAuthContextService).context()).toBeNull();
    });

    it('isAuthenticated() is false', () => {
      expect(TestBed.inject(MfeAuthContextService).isAuthenticated()).toBe(false);
    });

    it('userId() is empty string', () => {
      expect(TestBed.inject(MfeAuthContextService).userId()).toBe('');
    });

    it('email() is empty string', () => {
      expect(TestBed.inject(MfeAuthContextService).email()).toBe('');
    });

    it('roles() is empty array', () => {
      expect(TestBed.inject(MfeAuthContextService).roles()).toEqual([]);
    });

    it('permissions() is empty array', () => {
      expect(TestBed.inject(MfeAuthContextService).permissions()).toEqual([]);
    });

    it('token() is empty string', () => {
      expect(TestBed.inject(MfeAuthContextService).token()).toBe('');
    });

    it('hasPermission() returns false', () => {
      expect(TestBed.inject(MfeAuthContextService).hasPermission('invoices:read')).toBe(false);
    });

    it('hasRole() returns false', () => {
      expect(TestBed.inject(MfeAuthContextService).hasRole('admin')).toBe(false);
    });
  });

  describe('with CANVAS_AUTH_CONTEXT provided (authenticated)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          MfeAuthContextService,
          { provide: CANVAS_AUTH_CONTEXT, useValue: signal(MOCK_CONTEXT) },
        ],
      });
    });

    it('context() returns the full auth context', () => {
      expect(TestBed.inject(MfeAuthContextService).context()).toEqual(MOCK_CONTEXT);
    });

    it('isAuthenticated() is true', () => {
      expect(TestBed.inject(MfeAuthContextService).isAuthenticated()).toBe(true);
    });

    it('userId() returns the user id', () => {
      expect(TestBed.inject(MfeAuthContextService).userId()).toBe('user-1');
    });

    it('email() returns the email address', () => {
      expect(TestBed.inject(MfeAuthContextService).email()).toBe('user@example.com');
    });

    it('roles() returns the roles array', () => {
      expect(TestBed.inject(MfeAuthContextService).roles()).toEqual(['admin', 'viewer']);
    });

    it('permissions() returns the permissions array', () => {
      expect(TestBed.inject(MfeAuthContextService).permissions()).toEqual([
        'invoices:read',
        'invoices:write',
      ]);
    });

    it('token() returns the access token', () => {
      expect(TestBed.inject(MfeAuthContextService).token()).toBe('jwt.token.here');
    });

    it('hasPermission() returns true when user holds all codes', () => {
      expect(
        TestBed.inject(MfeAuthContextService).hasPermission('invoices:read', 'invoices:write')
      ).toBe(true);
    });

    it('hasPermission() returns false when user lacks any code', () => {
      expect(
        TestBed.inject(MfeAuthContextService).hasPermission('invoices:read', 'invoices:delete')
      ).toBe(false);
    });

    it('hasRole() returns true when user holds the role', () => {
      expect(TestBed.inject(MfeAuthContextService).hasRole('admin')).toBe(true);
    });

    it('hasRole() returns true when user holds one of multiple roles', () => {
      expect(TestBed.inject(MfeAuthContextService).hasRole('superadmin', 'viewer')).toBe(true);
    });

    it('hasRole() returns false when user holds none of the roles', () => {
      expect(TestBed.inject(MfeAuthContextService).hasRole('superadmin')).toBe(false);
    });
  });

  describe('with CANVAS_AUTH_CONTEXT provided but null (unauthenticated)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          MfeAuthContextService,
          { provide: CANVAS_AUTH_CONTEXT, useValue: signal(null) },
        ],
      });
    });

    it('context() is null', () => {
      expect(TestBed.inject(MfeAuthContextService).context()).toBeNull();
    });

    it('isAuthenticated() is false', () => {
      expect(TestBed.inject(MfeAuthContextService).isAuthenticated()).toBe(false);
    });

    it('permissions() is empty array', () => {
      expect(TestBed.inject(MfeAuthContextService).permissions()).toEqual([]);
    });
  });
});
