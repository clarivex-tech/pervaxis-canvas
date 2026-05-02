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
import { CANVAS_ERROR_CONFIG } from '../tokens/error-config.token';
import { CanvasErrorService } from './canvas-error.service';
import { StructuredError } from '../types/canvas-error.types';

const MOCK_ERROR: StructuredError = {
  message: 'Test error',
  timestamp: 1234567890,
};

describe('CanvasErrorService', () => {
  let service: CanvasErrorService;
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    TestBed.configureTestingModule({
      providers: [
        { provide: CANVAS_ERROR_CONFIG, useValue: { enableConsoleLog: true, remoteEndpoint: '' } },
      ],
    });
    service = TestBed.inject(CanvasErrorService);
  });

  afterEach(() => consoleSpy.mockRestore());

  describe('initial state', () => {
    it('lastError is null', () => {
      expect(service.lastError()).toBeNull();
    });
  });

  describe('report()', () => {
    it('sets the lastError signal', () => {
      service.report(MOCK_ERROR);
      expect(service.lastError()).toEqual(MOCK_ERROR);
    });

    it('logs to console when enableConsoleLog is true', () => {
      service.report(MOCK_ERROR);
      expect(consoleSpy).toHaveBeenCalledWith('[Canvas Error]', MOCK_ERROR.message, MOCK_ERROR);
    });

    it('overwrites a previous error with the latest', () => {
      service.report(MOCK_ERROR);
      const newer: StructuredError = { message: 'newer', timestamp: 2 };
      service.report(newer);
      expect(service.lastError()).toEqual(newer);
    });
  });

  describe('report() — console suppressed', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          { provide: CANVAS_ERROR_CONFIG, useValue: { enableConsoleLog: false, remoteEndpoint: '' } },
        ],
      });
      service = TestBed.inject(CanvasErrorService);
    });

    it('does not log to console when enableConsoleLog is false', () => {
      service.report(MOCK_ERROR);
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('report() — remote logging', () => {
    let fetchSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response());
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          {
            provide: CANVAS_ERROR_CONFIG,
            useValue: { enableConsoleLog: false, remoteEndpoint: '/api/errors' },
          },
        ],
      });
      service = TestBed.inject(CanvasErrorService);
    });

    afterEach(() => fetchSpy.mockRestore());

    it('POSTs to the remote endpoint', () => {
      service.report(MOCK_ERROR);
      expect(fetchSpy).toHaveBeenCalledWith(
        '/api/errors',
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('does not throw when the fetch fails', async () => {
      fetchSpy.mockRejectedValue(new Error('Network error'));
      expect(() => service.report(MOCK_ERROR)).not.toThrow();
    });
  });

  describe('clear()', () => {
    it('resets lastError to null', () => {
      service.report(MOCK_ERROR);
      service.clear();
      expect(service.lastError()).toBeNull();
    });
  });
});
