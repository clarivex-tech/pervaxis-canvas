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
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CANVAS_CONFIG_URL } from './config/canvas-runtime-config';
import { EnvironmentConfigService } from './config/environment-config.service';
import { RemoteManifestLoader } from './manifest/remote-manifest-loader.service';
import { provideCanvasCore } from './provide-canvas-core';

describe('provideCanvasCore', () => {
  describe('default configuration', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideCanvasCore(),
          provideHttpClientTesting(),
        ],
      });
    });

    it('provides EnvironmentConfigService', () => {
      expect(TestBed.inject(EnvironmentConfigService)).toBeTruthy();
    });

    it('provides RemoteManifestLoader', () => {
      expect(TestBed.inject(RemoteManifestLoader)).toBeTruthy();
    });

    it('uses default config URL /assets/config.json', () => {
      expect(TestBed.inject(CANVAS_CONFIG_URL)).toBe('/assets/config.json');
    });

    it('registers an APP_INITIALIZER', () => {
      const initializers = TestBed.inject(APP_INITIALIZER, null, { optional: true });
      expect(initializers).toBeTruthy();
    });
  });

  describe('with custom configUrl', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideCanvasCore({ configUrl: '/env/runtime.json' }),
          provideHttpClientTesting(),
        ],
      });
    });

    it('overrides the config URL', () => {
      expect(TestBed.inject(CANVAS_CONFIG_URL)).toBe('/env/runtime.json');
    });
  });

  describe('without configUrl option', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideCanvasCore({}),
          provideHttpClientTesting(),
        ],
      });
    });

    it('still uses the default config URL', () => {
      expect(TestBed.inject(CANVAS_CONFIG_URL)).toBe('/assets/config.json');
    });
  });
});
