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
import { CANVAS_HTTP_CONFIG } from '../tokens/http-config.token';
import { CanvasHttpError } from '../types/canvas-http-error';
import { REQUEST_TIMEOUT, timeoutInterceptor, withTimeout } from './timeout.interceptor';

const TIMEOUT_MS = 200;
const TEST_CONFIG = { retryAttempts: 0, retryDelayMs: 100, timeoutMs: TIMEOUT_MS };

describe('timeoutInterceptor', () => {
  let http: HttpClient;
  let mock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([timeoutInterceptor])),
        provideHttpClientTesting(),
        { provide: CANVAS_HTTP_CONFIG, useValue: TEST_CONFIG },
      ],
    });
    http = TestBed.inject(HttpClient);
    mock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    vi.useRealTimers();
    // Flush any pending requests to satisfy mock.verify()
    mock.verify();
  });

  it('completes normally when the response arrives before the timeout', async () => {
    vi.useFakeTimers();
    let result: unknown;
    http.get('/api/data').subscribe((r) => (result = r));

    await vi.advanceTimersByTimeAsync(50); // well within 200ms
    mock.expectOne('/api/data').flush({ ok: true });
    expect(result).toEqual({ ok: true });
  });

  it('throws a TIMEOUT CanvasHttpError when the deadline is exceeded', async () => {
    vi.useFakeTimers();
    let err!: CanvasHttpError;
    http.get('/api/data').subscribe({ error: (e) => (err = e) });

    // Grab the pending request so mock.verify() is satisfied
    const req = mock.expectOne('/api/data');

    await vi.advanceTimersByTimeAsync(TIMEOUT_MS + 1);

    expect(err.code).toBe('TIMEOUT');
    expect(err.status).toBe(0);
    expect(err.message).toContain(`${TIMEOUT_MS}ms`);

    // Flush to clean up (the subscription is already errored, this is just cleanup)
    try { req.flush({}); } catch { /* already completed */ }
  });

  it('uses the per-request timeout from HttpContext', async () => {
    vi.useFakeTimers();
    const SHORT_MS = 50;
    let err!: CanvasHttpError;
    http
      .get('/api/data', { context: withTimeout(SHORT_MS) })
      .subscribe({ error: (e) => (err = e) });

    const req = mock.expectOne('/api/data');
    await vi.advanceTimersByTimeAsync(SHORT_MS + 1);

    expect(err.code).toBe('TIMEOUT');
    expect(err.message).toContain(`${SHORT_MS}ms`);

    try { req.flush({}); } catch { /* already completed */ }
  });

  it('does not time out when per-request override is longer than global', async () => {
    vi.useFakeTimers();
    let result: unknown;
    // Override to 500ms — global config is only 200ms
    http
      .get('/api/data', { context: withTimeout(500) })
      .subscribe({ next: (r) => (result = r) });

    await vi.advanceTimersByTimeAsync(300); // past global timeout but within per-request override
    mock.expectOne('/api/data').flush({ ok: true });
    expect(result).toEqual({ ok: true });
  });

  it('withTimeout creates a context with REQUEST_TIMEOUT set', () => {
    const ctx = withTimeout(5_000);
    expect(ctx.get(REQUEST_TIMEOUT)).toBe(5_000);
  });

  it('passes non-timeout errors through unchanged', () => {
    let err: unknown;
    http.get('/api/data').subscribe({ error: (e) => (err = e) });
    mock
      .expectOne('/api/data')
      .flush('error', { status: 500, statusText: 'Server Error' });
    expect((err as { status: number }).status).toBe(500);
  });
});
