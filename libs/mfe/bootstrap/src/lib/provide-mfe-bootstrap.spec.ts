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
import { MfeAuthContextService } from './auth/mfe-auth-context.service';
import { MFE_NAME } from './tokens/mfe-bootstrap.token';
import { provideMfeBootstrap } from './provide-mfe-bootstrap';

describe('provideMfeBootstrap', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMfeBootstrap({ name: 'my-mfe' })],
    });
  });

  it('binds MFE_NAME to the provided name', () => {
    expect(TestBed.inject(MFE_NAME)).toBe('my-mfe');
  });

  it('registers MfeAuthContextService', () => {
    expect(TestBed.inject(MfeAuthContextService)).toBeInstanceOf(MfeAuthContextService);
  });

  it('MfeAuthContextService has null context when no auth token is bound', () => {
    expect(TestBed.inject(MfeAuthContextService).context()).toBeNull();
  });

  it('MfeAuthContextService isAuthenticated is false when no auth token is bound', () => {
    expect(TestBed.inject(MfeAuthContextService).isAuthenticated()).toBe(false);
  });
});
