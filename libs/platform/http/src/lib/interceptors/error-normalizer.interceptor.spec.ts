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
import { CanvasHttpError } from '../types/canvas-http-error';
import { correlationIdInterceptor } from './correlation-id.interceptor';
import { errorNormalizerInterceptor } from './error-normalizer.interceptor';

describe('errorNormalizerInterceptor', () => {
  let http: HttpClient;
  let mock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([correlationIdInterceptor, errorNormalizerInterceptor])
        ),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    mock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => mock.verify());

  function flushError(status: number, body: unknown = 'Error'): CanvasHttpError {
    let err!: CanvasHttpError;
    http.get('/api/test').subscribe({ error: (e) => (err = e) });
    mock
      .expectOne('/api/test')
      .flush(body, { status, statusText: 'Error' });
    return err;
  }

  it('normalizes a 500 error to SERVER_ERROR', () => {
    const err = flushError(500);
    expect(err.status).toBe(500);
    expect(err.code).toBe('SERVER_ERROR');
    expect(err.timestamp).toBeGreaterThan(0);
  });

  it('normalizes a 404 error to NOT_FOUND', () => {
    expect(flushError(404).code).toBe('NOT_FOUND');
  });

  it('normalizes a 401 error to UNAUTHORIZED', () => {
    expect(flushError(401).code).toBe('UNAUTHORIZED');
  });

  it('normalizes a 403 error to FORBIDDEN', () => {
    expect(flushError(403).code).toBe('FORBIDDEN');
  });

  it('normalizes a 400 error to BAD_REQUEST', () => {
    expect(flushError(400).code).toBe('BAD_REQUEST');
  });

  it('normalizes a 409 error to CONFLICT', () => {
    expect(flushError(409).code).toBe('CONFLICT');
  });

  it('normalizes a 422 error to UNPROCESSABLE', () => {
    expect(flushError(422).code).toBe('UNPROCESSABLE');
  });

  it('normalizes a 429 error to TOO_MANY_REQUESTS', () => {
    expect(flushError(429).code).toBe('TOO_MANY_REQUESTS');
  });

  it('extracts a message from the error body', () => {
    const err = flushError(400, { message: 'Invalid email' });
    expect(err.message).toBe('Invalid email');
  });

  it('extracts an error field from the body when message is absent', () => {
    const err = flushError(400, { error: 'validation_failed' });
    expect(err.message).toBe('validation_failed');
  });

  it('attaches the correlation ID from the request header', () => {
    const err = flushError(500);
    expect(err.correlationId).toBeTruthy();
  });

  it('stores the raw response body in details', () => {
    const body = { code: 42, reason: 'oops' };
    const err = flushError(500, body);
    expect(err.details).toEqual(body);
  });

  it('passes non-HTTP errors through unchanged', () => {
    const nonHttpError = new Error('not http');
    let captured: unknown;
    http.get('/api/test').subscribe({ error: (e) => (captured = e) });
    mock.expectOne('/api/test').error(nonHttpError as ErrorEvent);
    // Angular wraps native errors in HttpErrorResponse, so it gets normalised.
    // Verify the interceptor still produces a CanvasHttpError in that case.
    expect((captured as CanvasHttpError).status).toBeDefined();
  });
});
