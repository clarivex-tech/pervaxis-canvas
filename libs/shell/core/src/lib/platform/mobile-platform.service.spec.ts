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
import { MobilePlatformService } from './mobile-platform.service';

const mockGetPlatform = vi.fn().mockReturnValue('web');

vi.mock('@capacitor/core', () => ({
  Capacitor: { getPlatform: () => mockGetPlatform() },
}));

describe('MobilePlatformService', () => {
  const setup = () => {
    TestBed.configureTestingModule({});
    return TestBed.inject(MobilePlatformService);
  };

  beforeEach(() => {
    mockGetPlatform.mockReturnValue('web');
    TestBed.resetTestingModule();
  });

  it('reports "web" when Capacitor returns "web"', () => {
    mockGetPlatform.mockReturnValue('web');
    const svc = setup();
    expect(svc.platform()).toBe('web');
    expect(svc.isNative()).toBe(false);
    expect(svc.isIos()).toBe(false);
    expect(svc.isAndroid()).toBe(false);
  });

  it('reports "ios" when Capacitor returns "ios"', () => {
    mockGetPlatform.mockReturnValue('ios');
    const svc = setup();
    expect(svc.platform()).toBe('ios');
    expect(svc.isNative()).toBe(true);
    expect(svc.isIos()).toBe(true);
    expect(svc.isAndroid()).toBe(false);
  });

  it('reports "android" when Capacitor returns "android"', () => {
    mockGetPlatform.mockReturnValue('android');
    const svc = setup();
    expect(svc.platform()).toBe('android');
    expect(svc.isNative()).toBe(true);
    expect(svc.isIos()).toBe(false);
    expect(svc.isAndroid()).toBe(true);
  });

  it('falls back to "web" for unknown platform strings', () => {
    mockGetPlatform.mockReturnValue('electron');
    const svc = setup();
    expect(svc.platform()).toBe('web');
    expect(svc.isNative()).toBe(false);
  });
});
