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
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthContextService } from '@pervaxis/canvas-platform-auth';
import { CANVAS_AUTH_CONFIG, CanvasAuthConfig } from '../config/canvas-auth-config';
import { ShellAuthService } from './shell-auth.service';

const BASE_CONFIG: CanvasAuthConfig = {
  issuer: 'https://auth.example.com',
  clientId: 'test-client',
  redirectUri: 'https://app.example.com',
  scope: 'openid profile email',
  silentRefresh: true,
};

function makeOAuthService(overrides: Partial<{
  hasValidAccessToken: boolean;
  claims: Record<string, unknown>;
  accessToken: string;
}> = {}) {
  return {
    configure: vi.fn(),
    loadDiscoveryDocumentAndTryLogin: vi.fn().mockResolvedValue(true),
    setupAutomaticSilentRefresh: vi.fn(),
    initCodeFlow: vi.fn(),
    logOut: vi.fn(),
    hasValidAccessToken: vi.fn().mockReturnValue(overrides.hasValidAccessToken ?? false),
    getIdentityClaims: vi.fn().mockReturnValue(overrides.claims ?? {}),
    getAccessToken: vi.fn().mockReturnValue(overrides.accessToken ?? 'mock-token'),
  };
}

function makeAuthContext() {
  return {
    setContext: vi.fn(),
    clearContext: vi.fn(),
  };
}

describe('ShellAuthService', () => {
  let service: ShellAuthService;
  let oauthService: ReturnType<typeof makeOAuthService>;
  let authContext: ReturnType<typeof makeAuthContext>;

  function setup(
    configOverrides?: Partial<CanvasAuthConfig>,
    oauthOverrides?: Parameters<typeof makeOAuthService>[0]
  ) {
    oauthService = makeOAuthService(oauthOverrides);
    authContext = makeAuthContext();

    TestBed.configureTestingModule({
      providers: [
        ShellAuthService,
        { provide: OAuthService, useValue: oauthService },
        { provide: AuthContextService, useValue: authContext },
        { provide: CANVAS_AUTH_CONFIG, useValue: { ...BASE_CONFIG, ...configOverrides } },
      ],
    });
    service = TestBed.inject(ShellAuthService);
  }

  describe('initialize()', () => {
    it('calls configure() with resolved options', async () => {
      setup();
      await service.initialize();
      expect(oauthService.configure).toHaveBeenCalledWith(
        expect.objectContaining({
          issuer: 'https://auth.example.com',
          clientId: 'test-client',
          redirectUri: 'https://app.example.com',
          responseType: 'code',
          scope: 'openid profile email',
        })
      );
    });

    it('calls loadDiscoveryDocumentAndTryLogin()', async () => {
      setup();
      await service.initialize();
      expect(oauthService.loadDiscoveryDocumentAndTryLogin).toHaveBeenCalledOnce();
    });

    it('enables silent refresh when silentRefresh is true', async () => {
      setup({ silentRefresh: true });
      await service.initialize();
      expect(oauthService.setupAutomaticSilentRefresh).toHaveBeenCalledOnce();
    });

    it('enables silent refresh when silentRefresh is undefined (default)', async () => {
      setup({ silentRefresh: undefined });
      await service.initialize();
      expect(oauthService.setupAutomaticSilentRefresh).toHaveBeenCalledOnce();
    });

    it('skips silent refresh when silentRefresh is false', async () => {
      setup({ silentRefresh: false });
      await service.initialize();
      expect(oauthService.setupAutomaticSilentRefresh).not.toHaveBeenCalled();
    });

    it('syncs auth context when a valid token exists after login', async () => {
      setup(
        {},
        {
          hasValidAccessToken: true,
          claims: { sub: 'user-1', email: 'user@example.com', roles: ['admin'], permissions: ['read'] },
          accessToken: 'jwt-token',
        }
      );
      await service.initialize();
      expect(authContext.setContext).toHaveBeenCalledWith({
        userId: 'user-1',
        email: 'user@example.com',
        roles: ['admin'],
        permissions: ['read'],
        token: 'jwt-token',
      });
    });

    it('does not sync context when no valid token exists', async () => {
      setup({}, { hasValidAccessToken: false });
      await service.initialize();
      expect(authContext.setContext).not.toHaveBeenCalled();
    });

    it('uses window.location.origin as default redirectUri', async () => {
      setup({ redirectUri: undefined });
      await service.initialize();
      expect(oauthService.configure).toHaveBeenCalledWith(
        expect.objectContaining({ redirectUri: window.location.origin })
      );
    });

    it('uses custom rolesClaim when provided', async () => {
      setup(
        { rolesClaim: 'custom_roles' },
        {
          hasValidAccessToken: true,
          claims: { sub: 'u1', email: 'u@e.com', custom_roles: ['editor'] },
          accessToken: 'tok',
        }
      );
      await service.initialize();
      expect(authContext.setContext).toHaveBeenCalledWith(
        expect.objectContaining({ roles: ['editor'] })
      );
    });

    it('uses custom permissionsClaim when provided', async () => {
      setup(
        { permissionsClaim: 'custom_perms' },
        {
          hasValidAccessToken: true,
          claims: { sub: 'u1', email: 'u@e.com', custom_perms: ['write'] },
          accessToken: 'tok',
        }
      );
      await service.initialize();
      expect(authContext.setContext).toHaveBeenCalledWith(
        expect.objectContaining({ permissions: ['write'] })
      );
    });

    it('sets roles to empty array when claim is missing', async () => {
      setup(
        {},
        {
          hasValidAccessToken: true,
          claims: { sub: 'u1', email: 'u@e.com' },
          accessToken: 'tok',
        }
      );
      await service.initialize();
      expect(authContext.setContext).toHaveBeenCalledWith(
        expect.objectContaining({ roles: [], permissions: [] })
      );
    });
  });

  describe('login()', () => {
    it('calls initCodeFlow()', () => {
      setup();
      service.login();
      expect(oauthService.initCodeFlow).toHaveBeenCalledOnce();
    });
  });

  describe('logout()', () => {
    it('clears the auth context', () => {
      setup();
      service.logout();
      expect(authContext.clearContext).toHaveBeenCalledOnce();
    });

    it('calls OAuthService.logOut()', () => {
      setup();
      service.logout();
      expect(oauthService.logOut).toHaveBeenCalledOnce();
    });
  });

  describe('isAuthenticated', () => {
    it('returns true when a valid token exists', () => {
      setup({}, { hasValidAccessToken: true });
      expect(service.isAuthenticated).toBe(true);
    });

    it('returns false when no valid token exists', () => {
      setup({}, { hasValidAccessToken: false });
      expect(service.isAuthenticated).toBe(false);
    });
  });
});
