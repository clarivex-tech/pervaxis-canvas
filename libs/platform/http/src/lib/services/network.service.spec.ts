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
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NetworkService } from './network.service';

const mockIsNative = vi.fn().mockReturnValue(false);
const mockGetStatus = vi.fn().mockResolvedValue({ connected: true });
const mockAddListener = vi.fn().mockResolvedValue(undefined);
const mockRemoveAll = vi.fn().mockResolvedValue(undefined);

vi.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: () => mockIsNative() },
}));
vi.mock('@capacitor/network', () => ({
  Network: {
    getStatus: () => mockGetStatus(),
    addListener: (event: string, cb: unknown) => mockAddListener(event, cb),
    removeAllListeners: () => mockRemoveAll(),
  },
}));

describe('NetworkService (web)', () => {
  let svc: NetworkService;

  beforeEach(() => {
    mockIsNative.mockReturnValue(false);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    svc = TestBed.inject(NetworkService);
  });

  it('reflects navigator.onLine as initial state', () => {
    expect(typeof svc.isOnline()).toBe('boolean');
    expect(svc.isOffline()).toBe(!svc.isOnline());
  });

  it('goes online when window "online" fires', () => {
    window.dispatchEvent(new Event('offline'));
    expect(svc.isOffline()).toBe(true);
    window.dispatchEvent(new Event('online'));
    expect(svc.isOnline()).toBe(true);
  });

  it('goes offline when window "offline" fires', () => {
    window.dispatchEvent(new Event('online'));
    expect(svc.isOnline()).toBe(true);
    window.dispatchEvent(new Event('offline'));
    expect(svc.isOffline()).toBe(true);
  });

  it('isOffline is the inverse of isOnline', () => {
    window.dispatchEvent(new Event('online'));
    expect(svc.isOnline()).toBe(true);
    expect(svc.isOffline()).toBe(false);
  });
});

describe('NetworkService (native)', () => {
  let svc: NetworkService;

  beforeEach(async () => {
    mockAddListener.mockClear();
    mockIsNative.mockReturnValue(true);
    mockGetStatus.mockResolvedValue({ connected: false });
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    svc = TestBed.inject(NetworkService);
    // Allow the async #initNative to settle
    await new Promise((r) => setTimeout(r, 0));
  });

  it('initialises from Capacitor Network.getStatus()', () => {
    expect(svc.isOnline()).toBe(false);
    expect(svc.isOffline()).toBe(true);
  });

  it('registers a networkStatusChange listener', () => {
    expect(mockAddListener).toHaveBeenCalledWith(
      'networkStatusChange',
      expect.any(Function)
    );
  });

  it('updates signal when networkStatusChange fires', () => {
    const [[, callback]] = mockAddListener.mock.calls;
    (callback as (s: { connected: boolean }) => void)({ connected: true });
    expect(svc.isOnline()).toBe(true);
  });
});
