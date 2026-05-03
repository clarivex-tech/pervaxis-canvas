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
import { vi, describe, it, expect, beforeEach } from 'vitest';
import {
  CANVAS_BROWSER_OPEN,
  CapacitorOidcService,
} from './capacitor-oidc.service';
import { MobilePlatformService } from '@pervaxis/canvas-shell-core';
import { OAuthService } from 'angular-oauth2-oidc';

const mockAppAddListener = vi.fn();
const mockBrowserClose = vi.fn().mockResolvedValue(undefined);

vi.mock('@capacitor/core', () => ({
  Capacitor: { getPlatform: vi.fn().mockReturnValue('ios') },
}));
vi.mock('@capacitor/app', () => ({
  App: { addListener: (e: string, cb: unknown) => mockAppAddListener(e, cb) },
}));
vi.mock('@capacitor/browser', () => ({
  Browser: { close: () => mockBrowserClose(), open: vi.fn() },
}));

const nativeMock = (): Partial<MobilePlatformService> => ({
  isNative: signal(true).asReadonly(),
});
const webMock = (): Partial<MobilePlatformService> => ({
  isNative: signal(false).asReadonly(),
});

describe('CapacitorOidcService', () => {
  let mockOAuth: Partial<OAuthService> & { loginUrl?: string };
  let mockBrowserOpen: ReturnType<typeof vi.fn>;

  const setup = (native: boolean) => {
    mockOAuth = {
      initCodeFlow: vi.fn(),
      tryLoginCodeFlow: vi.fn().mockResolvedValue(undefined),
      loginUrl: 'https://auth.example.com/authorize',
    };
    mockBrowserOpen = vi.fn().mockResolvedValue(undefined);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        CapacitorOidcService,
        { provide: OAuthService, useValue: mockOAuth },
        {
          provide: MobilePlatformService,
          useValue: native ? nativeMock() : webMock(),
        },
        { provide: CANVAS_BROWSER_OPEN, useValue: mockBrowserOpen },
      ],
    });
    return TestBed.inject(CapacitorOidcService);
  };

  beforeEach(() => vi.clearAllMocks());

  describe('initialize()', () => {
    it('does not register listener on web', () => {
      setup(false).initialize();
      expect(mockAppAddListener).not.toHaveBeenCalled();
    });

    it('registers appUrlOpen listener on native', () => {
      setup(true).initialize();
      expect(mockAppAddListener).toHaveBeenCalledWith(
        'appUrlOpen',
        expect.any(Function)
      );
    });

    it('calls tryLoginCodeFlow when redirect URL contains code', async () => {
      const svc = setup(true);
      svc.initialize();
      const [[, callback]] = mockAppAddListener.mock.calls;
      await (callback as (e: { url: string }) => Promise<void>)({
        url: 'myapp://callback?code=auth_code_123&state=xyz',
      });
      expect(mockBrowserClose).toHaveBeenCalled();
      expect(mockOAuth.tryLoginCodeFlow).toHaveBeenCalled();
    });

    it('ignores URLs without code or error', async () => {
      const svc = setup(true);
      svc.initialize();
      const [[, callback]] = mockAppAddListener.mock.calls;
      await (callback as (e: { url: string }) => Promise<void>)({
        url: 'myapp://home',
      });
      expect(mockBrowserClose).not.toHaveBeenCalled();
      expect(mockOAuth.tryLoginCodeFlow).not.toHaveBeenCalled();
    });
  });

  describe('login()', () => {
    it('calls initCodeFlow on web', async () => {
      const svc = setup(false);
      await svc.login();
      expect(mockOAuth.initCodeFlow).toHaveBeenCalled();
      expect(mockBrowserOpen).not.toHaveBeenCalled();
    });

    it('opens Capacitor Browser with loginUrl on native', async () => {
      const svc = setup(true);
      await svc.login();
      expect(mockBrowserOpen).toHaveBeenCalledWith({
        url: 'https://auth.example.com/authorize',
      });
      expect(mockOAuth.initCodeFlow).not.toHaveBeenCalled();
    });
  });
});
