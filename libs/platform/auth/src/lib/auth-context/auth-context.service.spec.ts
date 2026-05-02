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
import { AuthContext } from '@pervaxis/canvas-mfe-contracts';
import { AuthContextService } from './auth-context.service';

const MOCK_CONTEXT: AuthContext = {
  userId: 'user-001',
  email: 'user@example.com',
  roles: ['admin', 'viewer'],
  permissions: ['invoices:read', 'invoices:write'],
  token: 'mock-jwt-token',
};

describe('AuthContextService', () => {
  let service: AuthContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthContextService);
  });

  describe('initial state', () => {
    it('context signal is null', () => {
      expect(service.context()).toBeNull();
    });

    it('isAuthenticated is false', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('roles is empty array', () => {
      expect(service.roles()).toEqual([]);
    });

    it('permissions is empty array', () => {
      expect(service.permissions()).toEqual([]);
    });
  });

  describe('setContext()', () => {
    it('sets the auth context', () => {
      service.setContext(MOCK_CONTEXT);
      expect(service.context()).toEqual(MOCK_CONTEXT);
    });

    it('isAuthenticated becomes true', () => {
      service.setContext(MOCK_CONTEXT);
      expect(service.isAuthenticated()).toBe(true);
    });

    it('roles signal reflects context roles', () => {
      service.setContext(MOCK_CONTEXT);
      expect(service.roles()).toEqual(['admin', 'viewer']);
    });

    it('permissions signal reflects context permissions', () => {
      service.setContext(MOCK_CONTEXT);
      expect(service.permissions()).toEqual(['invoices:read', 'invoices:write']);
    });
  });

  describe('clearContext()', () => {
    it('resets context to null', () => {
      service.setContext(MOCK_CONTEXT);
      service.clearContext();
      expect(service.context()).toBeNull();
    });

    it('isAuthenticated becomes false after clear', () => {
      service.setContext(MOCK_CONTEXT);
      service.clearContext();
      expect(service.isAuthenticated()).toBe(false);
    });

    it('roles returns empty array after clear', () => {
      service.setContext(MOCK_CONTEXT);
      service.clearContext();
      expect(service.roles()).toEqual([]);
    });
  });

  describe('hasRole()', () => {
    it('returns false when not authenticated', () => {
      expect(service.hasRole('admin')).toBe(false);
    });

    it('returns true for a role the user has', () => {
      service.setContext(MOCK_CONTEXT);
      expect(service.hasRole('admin')).toBe(true);
    });

    it('returns false for a role the user does not have', () => {
      service.setContext(MOCK_CONTEXT);
      expect(service.hasRole('superuser')).toBe(false);
    });

    it('returns true when the user has all specified roles', () => {
      service.setContext(MOCK_CONTEXT);
      expect(service.hasRole('admin', 'viewer')).toBe(true);
    });

    it('returns false when the user is missing one of multiple roles', () => {
      service.setContext(MOCK_CONTEXT);
      expect(service.hasRole('admin', 'superuser')).toBe(false);
    });
  });

  describe('hasPermission()', () => {
    it('returns false when not authenticated', () => {
      expect(service.hasPermission('invoices:read')).toBe(false);
    });

    it('returns true for a permission the user has', () => {
      service.setContext(MOCK_CONTEXT);
      expect(service.hasPermission('invoices:read')).toBe(true);
    });

    it('returns false for a permission the user does not have', () => {
      service.setContext(MOCK_CONTEXT);
      expect(service.hasPermission('invoices:delete')).toBe(false);
    });

    it('returns true when the user has all specified permissions', () => {
      service.setContext(MOCK_CONTEXT);
      expect(service.hasPermission('invoices:read', 'invoices:write')).toBe(true);
    });

    it('returns false when the user is missing one of multiple permissions', () => {
      service.setContext(MOCK_CONTEXT);
      expect(service.hasPermission('invoices:read', 'invoices:delete')).toBe(false);
    });
  });
});
