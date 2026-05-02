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
import { CanvasErrorService } from '../services/canvas-error.service';
import { CanvasErrorHandler } from './canvas-error-handler';

describe('CanvasErrorHandler', () => {
  let handler: CanvasErrorHandler;
  let errorService: CanvasErrorService;

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    TestBed.configureTestingModule({
      providers: [
        CanvasErrorHandler,
        { provide: CANVAS_ERROR_CONFIG, useValue: { enableConsoleLog: true, remoteEndpoint: '' } },
      ],
    });
    handler = TestBed.inject(CanvasErrorHandler);
    errorService = TestBed.inject(CanvasErrorService);
  });

  afterEach(() => vi.restoreAllMocks());

  it('normalises an Error instance', () => {
    const err = new Error('boom');
    handler.handleError(err);
    const result = errorService.lastError();
    expect(result?.message).toBe('boom');
    expect(result?.stack).toBe(err.stack);
    expect(result?.details).toBe(err);
  });

  it('normalises a string error', () => {
    handler.handleError('something went wrong');
    expect(errorService.lastError()?.message).toBe('something went wrong');
  });

  it('normalises an unknown object', () => {
    handler.handleError({ code: 42 });
    const result = errorService.lastError();
    expect(result?.message).toBe('An unknown error occurred.');
    expect(result?.details).toEqual({ code: 42 });
  });

  it('normalises null', () => {
    handler.handleError(null);
    expect(errorService.lastError()?.message).toBe('An unknown error occurred.');
  });

  it('sets a timestamp on every error', () => {
    handler.handleError(new Error('ts'));
    expect(errorService.lastError()?.timestamp).toBeGreaterThan(0);
  });
});
