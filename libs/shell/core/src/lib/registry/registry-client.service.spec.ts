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
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { MfeManifest } from '@pervaxis/canvas-mfe-contracts';
import { EnvironmentConfigService } from '../config/environment-config.service';
import { CANVAS_REGISTRY_CONFIG } from './registry.types';
import { RegistryClientService } from './registry-client.service';

const API_URL = 'https://registry.pervaxis.io';
const CUSTOMER_ID = 'acme-corp';
const REMOTES_URL = `${API_URL}/api/registry/${CUSTOMER_ID}/remotes`;
const FALLBACK_URL = '/assets/registry.json';

const mockManifest: MfeManifest = {
  name: 'orders-mfe',
  remoteEntry: 'https://cdn.acme.io/orders/remoteEntry.json',
  exposedModule: './Module',
  routePath: 'orders',
  permissions: ['orders:read'],
};

/** Flush an HTTP request with a 500 error. */
function flushError(httpMock: HttpTestingController, url: string): void {
  httpMock
    .expectOne(url)
    .flush({}, { status: 500, statusText: 'Server Error' });
}

/** Drain all pending microtasks so async catch-blocks can queue their HTTP requests. */
function drainMicrotasks(): Promise<void> {
  return Promise.resolve();
}

// ---------------------------------------------------------------------------
// Suite: explicit CANVAS_REGISTRY_CONFIG token provided
// ---------------------------------------------------------------------------

describe('RegistryClientService — with explicit config', () => {
  let service: RegistryClientService;
  let httpMock: HttpTestingController;
  let mockConfigService: { config: ReturnType<typeof signal<null>> };

  beforeEach(() => {
    mockConfigService = { config: signal(null) };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        RegistryClientService,
        { provide: EnvironmentConfigService, useValue: mockConfigService },
        {
          provide: CANVAS_REGISTRY_CONFIG,
          useValue: { apiUrl: API_URL, customerId: CUSTOMER_ID },
        },
      ],
    });
    service = TestBed.inject(RegistryClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  // --- loadRemotes success ---

  it('sets remotes from API response on success', async () => {
    const promise = service.loadRemotes();
    httpMock
      .expectOne(REMOTES_URL)
      .flush({ customerId: CUSTOMER_ID, remotes: [mockManifest] });
    await promise;
    expect(service.remotes()).toEqual([mockManifest]);
  });

  // --- loadRemotes fallback ---

  it('falls back to registry.json after 3 failed API attempts', async () => {
    const promise = service.loadRemotes();
    // retry(2) = 3 total attempts; each flush triggers the next retry synchronously
    flushError(httpMock, REMOTES_URL);
    flushError(httpMock, REMOTES_URL);
    flushError(httpMock, REMOTES_URL);
    // Allow the catch-block microtask to run and queue the fallback request
    await drainMicrotasks();
    httpMock.expectOne(FALLBACK_URL).flush([mockManifest]);
    await promise;
    expect(service.remotes()).toEqual([mockManifest]);
  });

  it('leaves remotes empty when both API and fallback fail', async () => {
    const promise = service.loadRemotes();
    flushError(httpMock, REMOTES_URL);
    flushError(httpMock, REMOTES_URL);
    flushError(httpMock, REMOTES_URL);
    await drainMicrotasks();
    flushError(httpMock, FALLBACK_URL);
    await promise;
    expect(service.remotes()).toEqual([]);
  });

  // --- getRemote ---

  it('getRemote() returns manifest by name after loading', async () => {
    const promise = service.loadRemotes();
    httpMock
      .expectOne(REMOTES_URL)
      .flush({ customerId: CUSTOMER_ID, remotes: [mockManifest] });
    await promise;
    expect(service.getRemote('orders-mfe')).toEqual(mockManifest);
  });

  it('getRemote() returns undefined for an unknown name', async () => {
    const promise = service.loadRemotes();
    httpMock
      .expectOne(REMOTES_URL)
      .flush({ customerId: CUSTOMER_ID, remotes: [mockManifest] });
    await promise;
    expect(service.getRemote('unknown-mfe')).toBeUndefined();
  });

  it('getRemote() returns undefined before any remotes are loaded', () => {
    expect(service.getRemote('orders-mfe')).toBeUndefined();
  });

  // --- registerRemote ---

  it('registerRemote() sends POST to correct URL and returns created manifest', () => {
    let result: MfeManifest | undefined;
    service.registerRemote(mockManifest).subscribe((m) => (result = m));
    const req = httpMock.expectOne(REMOTES_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockManifest);
    req.flush(mockManifest);
    expect(result).toEqual(mockManifest);
  });

  // --- unregisterRemote ---

  it('unregisterRemote() sends DELETE to correct URL', () => {
    let completed = false;
    service
      .unregisterRemote('orders-mfe')
      .subscribe({ complete: () => (completed = true) });
    const req = httpMock.expectOne(`${REMOTES_URL}/orders-mfe`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    expect(completed).toBe(true);
  });

  it('unregisterRemote() URL-encodes remote names with special characters', () => {
    service.unregisterRemote('my mfe/v2').subscribe();
    const req = httpMock.expectOne(`${REMOTES_URL}/my%20mfe%2Fv2`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});

// ---------------------------------------------------------------------------
// Suite: custom fallback URL via explicit config
// ---------------------------------------------------------------------------

describe('RegistryClientService — with custom fallbackUrl', () => {
  let service: RegistryClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        RegistryClientService,
        {
          provide: EnvironmentConfigService,
          useValue: { config: signal(null) },
        },
        {
          provide: CANVAS_REGISTRY_CONFIG,
          useValue: {
            apiUrl: API_URL,
            customerId: CUSTOMER_ID,
            fallbackUrl: '/assets/custom-registry.json',
          },
        },
      ],
    });
    service = TestBed.inject(RegistryClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('uses custom fallbackUrl when API fails', async () => {
    const promise = service.loadRemotes();
    flushError(httpMock, REMOTES_URL);
    flushError(httpMock, REMOTES_URL);
    flushError(httpMock, REMOTES_URL);
    await drainMicrotasks();
    httpMock.expectOne('/assets/custom-registry.json').flush([mockManifest]);
    await promise;
    expect(service.remotes()).toEqual([mockManifest]);
  });
});

// ---------------------------------------------------------------------------
// Suite: no config — reads from CanvasRuntimeConfig
// ---------------------------------------------------------------------------

describe('RegistryClientService — runtime config fallback', () => {
  let service: RegistryClientService;
  let httpMock: HttpTestingController;
  let runtimeConfig: ReturnType<typeof signal<unknown>>;

  beforeEach(() => {
    runtimeConfig = signal(null);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        RegistryClientService,
        { provide: EnvironmentConfigService, useValue: { config: runtimeConfig } },
      ],
    });
    service = TestBed.inject(RegistryClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('is a no-op when no config is present', async () => {
    await service.loadRemotes();
    httpMock.expectNone(REMOTES_URL);
    expect(service.remotes()).toEqual([]);
  });

  it('is a no-op when runtime config lacks registryApiUrl', async () => {
    runtimeConfig.set({ apiBaseUrl: 'https://api.acme.io' });
    await service.loadRemotes();
    httpMock.expectNone(REMOTES_URL);
    expect(service.remotes()).toEqual([]);
  });

  it('reads API config from CanvasRuntimeConfig', async () => {
    runtimeConfig.set({
      apiBaseUrl: 'https://api.acme.io',
      registryApiUrl: API_URL,
      registryCustomerId: CUSTOMER_ID,
    });
    const promise = service.loadRemotes();
    httpMock
      .expectOne(REMOTES_URL)
      .flush({ customerId: CUSTOMER_ID, remotes: [mockManifest] });
    await promise;
    expect(service.remotes()).toEqual([mockManifest]);
  });

  it('registerRemote() throws when no config is provided', () => {
    expect(() => service.registerRemote(mockManifest)).toThrow(
      /registry config is required/
    );
  });

  it('unregisterRemote() throws when no config is provided', () => {
    expect(() => service.unregisterRemote('orders-mfe')).toThrow(
      /registry config is required/
    );
  });
});
