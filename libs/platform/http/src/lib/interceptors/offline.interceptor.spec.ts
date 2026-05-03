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

import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { offlineInterceptor } from './offline.interceptor';
import { NetworkService } from '../services/network.service';
import { isCanvasHttpError } from '../types/canvas-http-error';

vi.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: vi.fn().mockReturnValue(false) },
}));
vi.mock('@capacitor/network', () => ({
  Network: {
    getStatus: vi.fn().mockResolvedValue({ connected: true }),
    addListener: vi.fn(),
    removeAllListeners: vi.fn(),
  },
}));

const buildMockNetwork = (online: boolean): Partial<NetworkService> => {
  const online$ = signal(online);
  return {
    isOnline: online$.asReadonly(),
    isOffline: signal(!online).asReadonly(),
  };
};

describe('offlineInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;

  const setup = (online: boolean) => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([offlineInterceptor])),
        provideHttpClientTesting(),
        { provide: NetworkService, useValue: buildMockNetwork(online) },
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  };

  it('passes through requests when online', () => {
    setup(true);
    http.get('/api/test').subscribe();
    controller.expectOne('/api/test').flush({ ok: true });
    controller.verify();
  });

  it('throws CanvasHttpError with NETWORK_OFFLINE when offline', () => {
    setup(false);
    let caughtError: unknown;
    http.get('/api/test').subscribe({ error: (e) => (caughtError = e) });
    controller.expectNone('/api/test');
    expect(isCanvasHttpError(caughtError)).toBe(true);
    expect((caughtError as { code: string }).code).toBe('NETWORK_OFFLINE');
    expect((caughtError as { status: number }).status).toBe(0);
  });
});
