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
import { PushNotificationService } from './push-notification.service';
import { MobilePlatformService } from '../platform/mobile-platform.service';

const mockCheckPermissions = vi.fn();
const mockRequestPermissions = vi.fn();
const mockRegister = vi.fn().mockResolvedValue(undefined);
const mockAddListener = vi.fn();

vi.mock('@capacitor/core', () => ({
  Capacitor: { getPlatform: vi.fn().mockReturnValue('ios') },
}));
vi.mock('@capacitor/push-notifications', () => ({
  PushNotifications: {
    checkPermissions: () => mockCheckPermissions(),
    requestPermissions: () => mockRequestPermissions(),
    register: () => mockRegister(),
    addListener: (event: string, cb: unknown) => mockAddListener(event, cb),
  },
}));

const nativeMock = (): Partial<MobilePlatformService> => ({
  isNative: signal(true).asReadonly(),
});
const webMock = (): Partial<MobilePlatformService> => ({
  isNative: signal(false).asReadonly(),
});

describe('PushNotificationService', () => {
  const setup = (native: boolean) => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MobilePlatformService,
          useValue: native ? nativeMock() : webMock(),
        },
      ],
    });
    return TestBed.inject(PushNotificationService);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockRegister.mockResolvedValue(undefined);
  });

  it('is a no-op on web', async () => {
    const svc = setup(false);
    await svc.register();
    expect(mockCheckPermissions).not.toHaveBeenCalled();
    expect(svc.isGranted()).toBe(false);
  });

  it('sets permissionStatus to "granted" when user approves', async () => {
    mockCheckPermissions.mockResolvedValue({ receive: 'prompt' });
    mockRequestPermissions.mockResolvedValue({ receive: 'granted' });
    const svc = setup(true);
    await svc.register();
    expect(svc.permissionStatus()).toBe('granted');
    expect(svc.isGranted()).toBe(true);
    expect(mockRegister).toHaveBeenCalled();
  });

  it('sets permissionStatus to "denied" when user rejects', async () => {
    mockCheckPermissions.mockResolvedValue({ receive: 'prompt' });
    mockRequestPermissions.mockResolvedValue({ receive: 'denied' });
    const svc = setup(true);
    await svc.register();
    expect(svc.permissionStatus()).toBe('denied');
    expect(svc.isGranted()).toBe(false);
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('skips requestPermissions when already granted', async () => {
    mockCheckPermissions.mockResolvedValue({ receive: 'granted' });
    const svc = setup(true);
    await svc.register();
    expect(mockRequestPermissions).not.toHaveBeenCalled();
    expect(mockRegister).toHaveBeenCalled();
  });

  it('updates registrationToken when registration listener fires', async () => {
    mockCheckPermissions.mockResolvedValue({ receive: 'granted' });
    const svc = setup(true);
    await svc.register();
    const [[, regCallback]] = mockAddListener.mock.calls.filter(
      ([e]: [string]) => e === 'registration'
    );
    (regCallback as (t: { value: string }) => void)({ value: 'fcm-token-xyz' });
    expect(svc.registrationToken()).toBe('fcm-token-xyz');
  });

  it('updates lastNotification when pushNotificationReceived fires', async () => {
    mockCheckPermissions.mockResolvedValue({ receive: 'granted' });
    const svc = setup(true);
    await svc.register();
    const [[, notifCallback]] = mockAddListener.mock.calls.filter(
      ([e]: [string]) => e === 'pushNotificationReceived'
    );
    (notifCallback as (n: unknown) => void)({
      title: 'Hello',
      body: 'World',
      data: { orderId: 42 },
    });
    expect(svc.lastNotification()).toEqual({
      title: 'Hello',
      body: 'World',
      data: { orderId: 42 },
    });
  });
});
