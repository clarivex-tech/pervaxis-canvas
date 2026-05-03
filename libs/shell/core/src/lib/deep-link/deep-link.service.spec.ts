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
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { DeepLinkService } from './deep-link.service';
import { MobilePlatformService } from '../platform/mobile-platform.service';

const mockAddListener = vi.fn();

vi.mock('@capacitor/core', () => ({
  Capacitor: { getPlatform: vi.fn().mockReturnValue('ios') },
}));
vi.mock('@capacitor/app', () => ({
  App: {
    addListener: (event: string, cb: unknown) => mockAddListener(event, cb),
  },
}));

const nativeMock = (): Partial<MobilePlatformService> => ({
  isNative: signal(true).asReadonly(),
});
const webMock = (): Partial<MobilePlatformService> => ({
  isNative: signal(false).asReadonly(),
});

describe('DeepLinkService', () => {
  let mockRouter: { navigateByUrl: ReturnType<typeof vi.fn> };

  const setup = (native: boolean) => {
    mockRouter = { navigateByUrl: vi.fn().mockResolvedValue(true) };
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: MobilePlatformService,
          useValue: native ? nativeMock() : webMock(),
        },
      ],
    });
    return TestBed.inject(DeepLinkService);
  };

  beforeEach(() => vi.clearAllMocks());

  it('does not register a listener on web', () => {
    const svc = setup(false);
    svc.initialize();
    expect(mockAddListener).not.toHaveBeenCalled();
  });

  it('registers appUrlOpen listener on native', () => {
    const svc = setup(true);
    svc.initialize();
    expect(mockAddListener).toHaveBeenCalledWith('appUrlOpen', expect.any(Function));
  });

  it('navigates to extracted path when a deep link arrives', async () => {
    const svc = setup(true);
    svc.initialize();
    const [[, callback]] = mockAddListener.mock.calls;
    await (callback as (e: { url: string }) => Promise<void>)({
      url: 'myapp://localhost/orders/42?ref=push',
    });
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/orders/42?ref=push');
    expect(svc.lastDeepLink()).toBe('myapp://localhost/orders/42?ref=push');
  });

  it('stores the raw deep-link URL', async () => {
    const svc = setup(true);
    svc.initialize();
    const [[, callback]] = mockAddListener.mock.calls;
    await (callback as (e: { url: string }) => Promise<void>)({
      url: 'myapp://localhost/home',
    });
    expect(svc.lastDeepLink()).toBe('myapp://localhost/home');
  });

  it('does not navigate for unparseable URLs', async () => {
    const svc = setup(true);
    svc.initialize();
    const [[, callback]] = mockAddListener.mock.calls;
    await (callback as (e: { url: string }) => Promise<void>)({
      url: 'not-a-valid-url',
    });
    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
  });
});
