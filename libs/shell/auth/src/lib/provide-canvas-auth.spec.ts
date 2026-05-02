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

import { APP_INITIALIZER } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthContextService } from '@pervaxis/canvas-platform-auth';
import { CANVAS_AUTH_CONFIG } from './config/canvas-auth-config';
import { ShellAuthService } from './services/shell-auth.service';
import { provideCanvasAuth } from './provide-canvas-auth';

const MOCK_OAUTH = {
  configure: vi.fn(),
  loadDiscoveryDocumentAndTryLogin: vi.fn().mockResolvedValue(true),
  setupAutomaticSilentRefresh: vi.fn(),
  hasValidAccessToken: vi.fn().mockReturnValue(false),
  getIdentityClaims: vi.fn().mockReturnValue({}),
  getAccessToken: vi.fn().mockReturnValue(''),
  initCodeFlow: vi.fn(),
  logOut: vi.fn(),
};

describe('provideCanvasAuth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideCanvasAuth({ issuer: 'https://auth.example.com', clientId: 'test' }),
        { provide: OAuthService, useValue: MOCK_OAUTH },
        { provide: AuthContextService, useValue: { setContext: vi.fn(), clearContext: vi.fn() } },
      ],
    });
  });

  it('provides ShellAuthService', () => {
    expect(TestBed.inject(ShellAuthService)).toBeTruthy();
  });

  it('provides CANVAS_AUTH_CONFIG with the given values', () => {
    const cfg = TestBed.inject(CANVAS_AUTH_CONFIG);
    expect(cfg.issuer).toBe('https://auth.example.com');
    expect(cfg.clientId).toBe('test');
  });

  it('registers an APP_INITIALIZER', () => {
    const initializers = TestBed.inject(APP_INITIALIZER, null, { optional: true });
    expect(initializers).toBeTruthy();
  });
});
