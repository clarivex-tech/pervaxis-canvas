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
import { retryInterceptor } from './retry.interceptor';

const TEST_CONFIG = { retryAttempts: 1, retryDelayMs: 100, timeoutMs: 30_000 };

describe('retryInterceptor', () => {
  let http: HttpClient;
  let mock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([retryInterceptor])),
        provideHttpClientTesting(),
        { provide: CANVAS_HTTP_CONFIG, useValue: TEST_CONFIG },
      ],
    });
    http = TestBed.inject(HttpClient);
    mock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    mock.verify();
    vi.useRealTimers();
  });

  it('succeeds on first attempt without retrying', () => {
    let result: unknown;
    http.get('/api/data').subscribe((r) => (result = r));
    mock.expectOne('/api/data').flush({ ok: true });
    expect(result).toEqual({ ok: true });
  });

  it('retries once on a 500 error and succeeds', async () => {
    vi.useFakeTimers();
    let result: unknown;
    http.get('/api/data').subscribe({ next: (r) => (result = r) });

    mock.expectOne('/api/data').flush('err', { status: 500, statusText: 'Server Error' });

    await vi.advanceTimersByTimeAsync(101);

    mock.expectOne('/api/data').flush({ ok: true });
    expect(result).toEqual({ ok: true });
  });

  it('retries once on a 429 error and succeeds', async () => {
    vi.useFakeTimers();
    let result: unknown;
    http.get('/api/data').subscribe({ next: (r) => (result = r) });
    mock.expectOne('/api/data').flush('err', { status: 429, statusText: 'Too Many Requests' });
    await vi.advanceTimersByTimeAsync(101);
    mock.expectOne('/api/data').flush({ ok: true });
    expect(result).toEqual({ ok: true });
  });

  it('retries once on a network error (status 0) and succeeds', async () => {
    vi.useFakeTimers();
    let result: unknown;
    http.get('/api/data').subscribe({ next: (r) => (result = r) });
    mock.expectOne('/api/data').error(new ProgressEvent('error'));
    await vi.advanceTimersByTimeAsync(101);
    mock.expectOne('/api/data').flush({ ok: true });
    expect(result).toEqual({ ok: true });
  });

  it('exhausts retries and propagates the final error', async () => {
    vi.useFakeTimers();
    let err: unknown;
    http.get('/api/data').subscribe({ error: (e) => (err = e) });

    mock.expectOne('/api/data').flush('err', { status: 500, statusText: 'Server Error' });
    await vi.advanceTimersByTimeAsync(101);

    mock.expectOne('/api/data').flush('err', { status: 500, statusText: 'Server Error' });
    await vi.advanceTimersByTimeAsync(10);

    expect(err).toBeTruthy();
  });

  it('does not retry on a 404 error', () => {
    let err: unknown;
    http.get('/api/data').subscribe({ error: (e) => (err = e) });
    mock.expectOne('/api/data').flush('Not Found', { status: 404, statusText: 'Not Found' });
    expect(err).toBeTruthy();
  });

  it('does not retry on a 400 error', () => {
    let err: unknown;
    http.get('/api/data').subscribe({ error: (e) => (err = e) });
    mock.expectOne('/api/data').flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    expect(err).toBeTruthy();
  });

  it('does not retry on a 502 error', async () => {
    vi.useFakeTimers();
    let result: unknown;
    http.get('/api/data').subscribe({ next: (r) => (result = r) });
    mock.expectOne('/api/data').flush('err', { status: 502, statusText: 'Bad Gateway' });
    await vi.advanceTimersByTimeAsync(101);
    mock.expectOne('/api/data').flush({ ok: true });
    expect(result).toEqual({ ok: true });
  });
});

describe('retryInterceptor — exponential backoff', () => {
  let http: HttpClient;
  let mock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([retryInterceptor])),
        provideHttpClientTesting(),
        { provide: CANVAS_HTTP_CONFIG, useValue: { retryAttempts: 2, retryDelayMs: 100, timeoutMs: 30_000 } },
      ],
    });
    http = TestBed.inject(HttpClient);
    mock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    mock.verify();
    vi.useRealTimers();
  });

  it('doubles the delay on each retry attempt', async () => {
    vi.useFakeTimers();
    let result: unknown;
    http.get('/api/data').subscribe({ next: (r) => (result = r) });

    // Attempt 0 fails
    mock.expectOne('/api/data').flush('err', { status: 500, statusText: 'Server Error' });

    // Should not retry before first backoff (100ms × 2^0 = 100ms)
    await vi.advanceTimersByTimeAsync(50);
    mock.expectNone('/api/data');

    // Advance past first backoff
    await vi.advanceTimersByTimeAsync(60);
    // Attempt 1 fails
    mock.expectOne('/api/data').flush('err', { status: 500, statusText: 'Server Error' });

    // Should not retry before second backoff (100ms × 2^1 = 200ms)
    await vi.advanceTimersByTimeAsync(100);
    mock.expectNone('/api/data');

    // Advance past second backoff
    await vi.advanceTimersByTimeAsync(110);
    // Attempt 2 succeeds
    mock.expectOne('/api/data').flush({ ok: true });
    expect(result).toEqual({ ok: true });
  });
});
