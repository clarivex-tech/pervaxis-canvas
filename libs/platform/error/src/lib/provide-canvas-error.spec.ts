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
import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CANVAS_ERROR_CONFIG } from './tokens/error-config.token';
import { CanvasErrorHandler } from './handlers/canvas-error-handler';
import { provideCanvasError } from './provide-canvas-error';

describe('provideCanvasError()', () => {
  afterEach(() => vi.restoreAllMocks());

  describe('with no config argument', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined);
      TestBed.configureTestingModule({ providers: [provideCanvasError()] });
    });

    it('registers CanvasErrorHandler as ErrorHandler', () => {
      const handler = TestBed.inject(ErrorHandler);
      expect(handler).toBeInstanceOf(CanvasErrorHandler);
    });

    it('uses the default config (enableConsoleLog true, no remoteEndpoint)', () => {
      const config = TestBed.inject(CANVAS_ERROR_CONFIG);
      expect(config.enableConsoleLog).toBe(true);
      expect(config.remoteEndpoint).toBeFalsy();
    });
  });

  describe('with partial config override', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined);
      TestBed.configureTestingModule({
        providers: [provideCanvasError({ enableConsoleLog: false, remoteEndpoint: '/api/errors' })],
      });
    });

    it('merges config with defaults', () => {
      const config = TestBed.inject(CANVAS_ERROR_CONFIG);
      expect(config.enableConsoleLog).toBe(false);
      expect(config.remoteEndpoint).toBe('/api/errors');
    });
  });

  describe('ErrorHandler integration', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined);
      TestBed.configureTestingModule({ providers: [provideCanvasError()] });
    });

    it('CanvasErrorHandler and ErrorHandler resolve to the same instance', () => {
      const viaToken = TestBed.inject(ErrorHandler);
      const direct = TestBed.inject(CanvasErrorHandler);
      expect(viaToken).toBe(direct);
    });
  });

  describe('CANVAS_ERROR_CONFIG token default factory', () => {
    it('returns the default config when token is not overridden', () => {
      TestBed.configureTestingModule({});
      const config = TestBed.inject(CANVAS_ERROR_CONFIG);
      expect(config.enableConsoleLog).toBe(true);
      expect(config.remoteEndpoint).toBe('');
    });
  });
});
