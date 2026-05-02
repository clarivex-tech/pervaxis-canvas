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
import { CANVAS_CONFIG_URL, CanvasRuntimeConfig } from './canvas-runtime-config';
import { EnvironmentConfigService } from './environment-config.service';

const MOCK_CONFIG: CanvasRuntimeConfig = {
  apiBaseUrl: 'https://api.example.com',
  registryUrl: 'https://api.example.com/registry',
  oidcIssuer: 'https://auth.example.com',
  oidcClientId: 'canvas-client',
};

describe('EnvironmentConfigService', () => {
  let service: EnvironmentConfigService;
  let mock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        EnvironmentConfigService,
      ],
    });
    service = TestBed.inject(EnvironmentConfigService);
    mock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => mock.verify());

  describe('initial state', () => {
    it('config signal is null', () => {
      expect(service.config()).toBeNull();
    });

    it('isLoaded signal is false', () => {
      expect(service.isLoaded()).toBe(false);
    });
  });

  describe('load()', () => {
    it('fetches config from the default URL', async () => {
      const loadPromise = service.load();
      const req = mock.expectOne('/assets/config.json');
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_CONFIG);
      await loadPromise;
    });

    it('sets config signal after successful load', async () => {
      const loadPromise = service.load();
      mock.expectOne('/assets/config.json').flush(MOCK_CONFIG);
      await loadPromise;

      expect(service.config()).toEqual(MOCK_CONFIG);
    });

    it('sets isLoaded to true after successful load', async () => {
      const loadPromise = service.load();
      mock.expectOne('/assets/config.json').flush(MOCK_CONFIG);
      await loadPromise;

      expect(service.isLoaded()).toBe(true);
    });

    it('propagates HTTP errors', async () => {
      const loadPromise = service.load();
      mock.expectOne('/assets/config.json').flush('Not Found', {
        status: 404,
        statusText: 'Not Found',
      });

      await expect(loadPromise).rejects.toBeDefined();
    });
  });

  describe('with custom CANVAS_CONFIG_URL', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          EnvironmentConfigService,
          { provide: CANVAS_CONFIG_URL, useValue: '/env/runtime.json' },
        ],
      });
      service = TestBed.inject(EnvironmentConfigService);
      mock = TestBed.inject(HttpTestingController);
    });

    it('fetches from the custom URL', async () => {
      const loadPromise = service.load();
      const req = mock.expectOne('/env/runtime.json');
      req.flush(MOCK_CONFIG);
      await loadPromise;

      expect(service.config()).toEqual(MOCK_CONFIG);
    });
  });
});
