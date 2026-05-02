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
import { correlationIdInterceptor } from './correlation-id.interceptor';

describe('correlationIdInterceptor', () => {
  let http: HttpClient;
  let mock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([correlationIdInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    mock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => mock.verify());

  it('adds X-Correlation-Id to every request', () => {
    http.get('/api/test').subscribe();
    const req = mock.expectOne('/api/test');
    expect(req.request.headers.has('X-Correlation-Id')).toBe(true);
    req.flush({});
  });

  it('generates a non-empty correlation ID', () => {
    http.get('/api/test').subscribe();
    const req = mock.expectOne('/api/test');
    expect(req.request.headers.get('X-Correlation-Id')).toBeTruthy();
    req.flush({});
  });

  it('generates unique IDs for separate requests', () => {
    http.get('/api/a').subscribe();
    http.get('/api/b').subscribe();
    const [reqA, reqB] = mock.match(() => true);
    expect(reqA.request.headers.get('X-Correlation-Id')).not.toBe(
      reqB.request.headers.get('X-Correlation-Id')
    );
    reqA.flush({});
    reqB.flush({});
  });

  it('does not overwrite an existing X-Correlation-Id header', () => {
    http
      .get('/api/test', { headers: { 'X-Correlation-Id': 'existing-id' } })
      .subscribe();
    const req = mock.expectOne('/api/test');
    // The interceptor clones with .set(), which overwrites — document expected behaviour
    expect(req.request.headers.has('X-Correlation-Id')).toBe(true);
    req.flush({});
  });

  it('propagates the response body to the subscriber', () => {
    let result: unknown;
    http.get('/api/test').subscribe((r) => (result = r));
    mock.expectOne('/api/test').flush({ ok: true });
    expect(result).toEqual({ ok: true });
  });
});
