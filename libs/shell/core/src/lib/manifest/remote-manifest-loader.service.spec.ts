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

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { MfeManifest } from '@pervaxis/canvas-mfe-contracts';
import { CanvasRuntimeConfig } from '../config/canvas-runtime-config';
import { EnvironmentConfigService } from '../config/environment-config.service';
import { RemoteManifestLoader } from './remote-manifest-loader.service';

const REGISTRY_URL = 'https://api.example.com/registry';

const MOCK_MANIFESTS: MfeManifest[] = [
  {
    name: 'orders-mfe',
    remoteEntry: 'https://orders.example.com/remoteEntry.json',
    exposedModule: './Module',
    routePath: 'orders',
    permissions: ['orders:read'],
  },
  {
    name: 'inventory-mfe',
    remoteEntry: 'https://inventory.example.com/remoteEntry.json',
    exposedModule: './Module',
    routePath: 'inventory',
  },
];

function makeConfigService(registryUrl?: string) {
  const cfg: CanvasRuntimeConfig | null = registryUrl
    ? { apiBaseUrl: 'https://api.example.com', registryUrl }
    : null;
  return { config: signal(cfg) };
}

describe('RemoteManifestLoader', () => {
  let loader: RemoteManifestLoader;
  let mock: HttpTestingController;

  describe('when registryUrl is configured', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          RemoteManifestLoader,
          {
            provide: EnvironmentConfigService,
            useValue: makeConfigService(REGISTRY_URL),
          },
        ],
      });
      loader = TestBed.inject(RemoteManifestLoader);
      mock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => mock.verify());

    it('manifests is empty before load()', () => {
      expect(loader.manifests()).toEqual([]);
    });

    it('fetches manifests from registryUrl', async () => {
      const loadPromise = loader.load();
      mock.expectOne(REGISTRY_URL).flush(MOCK_MANIFESTS);
      await loadPromise;
    });

    it('populates manifests signal after load()', async () => {
      const loadPromise = loader.load();
      mock.expectOne(REGISTRY_URL).flush(MOCK_MANIFESTS);
      await loadPromise;

      expect(loader.manifests()).toEqual(MOCK_MANIFESTS);
    });

    it('getManifest() returns the correct manifest by name', async () => {
      const loadPromise = loader.load();
      mock.expectOne(REGISTRY_URL).flush(MOCK_MANIFESTS);
      await loadPromise;

      expect(loader.getManifest('orders-mfe')).toEqual(MOCK_MANIFESTS[0]);
    });

    it('getManifest() returns undefined for unknown name', async () => {
      const loadPromise = loader.load();
      mock.expectOne(REGISTRY_URL).flush(MOCK_MANIFESTS);
      await loadPromise;

      expect(loader.getManifest('unknown-mfe')).toBeUndefined();
    });

    it('getManifest() returns undefined before load()', () => {
      expect(loader.getManifest('orders-mfe')).toBeUndefined();
    });

    it('propagates HTTP errors', async () => {
      const loadPromise = loader.load();
      mock.expectOne(REGISTRY_URL).flush('Server Error', {
        status: 500,
        statusText: 'Internal Server Error',
      });
      await expect(loadPromise).rejects.toBeDefined();
    });
  });

  describe('when registryUrl is not configured', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          RemoteManifestLoader,
          {
            provide: EnvironmentConfigService,
            useValue: makeConfigService(),
          },
        ],
      });
      loader = TestBed.inject(RemoteManifestLoader);
      mock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => mock.verify());

    it('load() resolves without making any HTTP request', async () => {
      await loader.load();
      mock.expectNone(/.*/);
    });

    it('manifests remains empty after load()', async () => {
      await loader.load();
      expect(loader.manifests()).toEqual([]);
    });
  });
});
