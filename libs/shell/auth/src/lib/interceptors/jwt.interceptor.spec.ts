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
import { OAuthService } from 'angular-oauth2-oidc';
import { jwtInterceptor } from './jwt.interceptor';

function makeOAuthService(token: string | null) {
  return { getAccessToken: vi.fn().mockReturnValue(token) };
}

describe('jwtInterceptor', () => {
  let http: HttpClient;
  let mock: HttpTestingController;

  function setup(token: string | null) {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([jwtInterceptor])),
        provideHttpClientTesting(),
        { provide: OAuthService, useValue: makeOAuthService(token) },
      ],
    });
    http = TestBed.inject(HttpClient);
    mock = TestBed.inject(HttpTestingController);
  }

  afterEach(() => mock.verify());

  describe('when a valid token exists', () => {
    beforeEach(() => setup('my-access-token'));

    it('adds Authorization header to outbound requests', () => {
      http.get('/api/data').subscribe();
      const req = mock.expectOne('/api/data');
      expect(req.request.headers.get('Authorization')).toBe('Bearer my-access-token');
      req.flush({});
    });

    it('passes the request through', () => {
      let result: unknown;
      http.get('/api/data').subscribe((r) => (result = r));
      mock.expectOne('/api/data').flush({ ok: true });
      expect(result).toEqual({ ok: true });
    });
  });

  describe('when no token is present', () => {
    beforeEach(() => setup(null));

    it('does not add an Authorization header', () => {
      http.get('/api/data').subscribe();
      const req = mock.expectOne('/api/data');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });
  });

  describe('when Authorization header is already set', () => {
    beforeEach(() => setup('service-token'));

    it('does not overwrite an existing Authorization header', () => {
      http.get('/api/data', {
        headers: { Authorization: 'Bearer caller-token' },
      }).subscribe();
      const req = mock.expectOne('/api/data');
      expect(req.request.headers.get('Authorization')).toBe('Bearer caller-token');
      req.flush({});
    });
  });
});
