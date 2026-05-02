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

import { HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CANVAS_HTTP_CONFIG, DEFAULT_HTTP_CONFIG } from './tokens/http-config.token';
import { provideCanvasHttp } from './provide-canvas-http';

describe('provideCanvasHttp', () => {
  afterEach(() => TestBed.inject(HttpTestingController).verify());

  describe('default config', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideCanvasHttp(), provideHttpClientTesting()],
      });
    });

    it('registers HttpClient in the DI graph', () => {
      expect(TestBed.inject(HttpClient)).toBeTruthy();
    });

    it('uses the default config values', () => {
      const cfg = TestBed.inject(CANVAS_HTTP_CONFIG);
      expect(cfg.retryAttempts).toBe(DEFAULT_HTTP_CONFIG.retryAttempts);
      expect(cfg.retryDelayMs).toBe(DEFAULT_HTTP_CONFIG.retryDelayMs);
      expect(cfg.timeoutMs).toBe(DEFAULT_HTTP_CONFIG.timeoutMs);
    });

    it('adds X-Correlation-Id via the correlationId interceptor', () => {
      const http = TestBed.inject(HttpClient);
      const mock = TestBed.inject(HttpTestingController);
      http.get('/api/test').subscribe();
      const req = mock.expectOne('/api/test');
      expect(req.request.headers.has('X-Correlation-Id')).toBe(true);
      req.flush({});
    });
  });

  describe('custom config', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideCanvasHttp({ retryAttempts: 5, timeoutMs: 60_000 }),
          provideHttpClientTesting(),
        ],
      });
    });

    it('merges custom values with defaults', () => {
      const cfg = TestBed.inject(CANVAS_HTTP_CONFIG);
      expect(cfg.retryAttempts).toBe(5);
      expect(cfg.timeoutMs).toBe(60_000);
      expect(cfg.retryDelayMs).toBe(DEFAULT_HTTP_CONFIG.retryDelayMs);
    });
  });
});
