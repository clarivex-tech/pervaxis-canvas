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

import { Component, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MfeManifest } from '@pervaxis/canvas-mfe-contracts';
import { RemoteManifestLoader } from '@pervaxis/canvas-shell-core';
import { signal } from '@angular/core';
import { ShellRoutingService } from './shell-routing.service';
import { CANVAS_MFE_MODULE_LOADER, CANVAS_NOT_FOUND_REDIRECT } from './tokens/routing-tokens';
import { provideCanvasRouting } from './provide-canvas-routing';

@Component({ standalone: true, template: '' })
class FakeRemoteComponent {}

const stubLoader = (_m: MfeManifest): Promise<Type<unknown>> => Promise.resolve(FakeRemoteComponent);

describe('provideCanvasRouting', () => {
  describe('with loader only', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideRouter([]),
          provideCanvasRouting({ loader: stubLoader }),
          { provide: RemoteManifestLoader, useValue: { manifests: signal([]) } },
        ],
      });
    });

    it('provides ShellRoutingService', () => {
      expect(TestBed.inject(ShellRoutingService)).toBeTruthy();
    });

    it('provides CANVAS_MFE_MODULE_LOADER with the given loader', () => {
      expect(TestBed.inject(CANVAS_MFE_MODULE_LOADER)).toBe(stubLoader);
    });

    it('does not provide CANVAS_NOT_FOUND_REDIRECT', () => {
      const redirect = TestBed.inject(CANVAS_NOT_FOUND_REDIRECT, null, { optional: true });
      expect(redirect).toBeNull();
    });
  });

  describe('with notFoundRedirectTo', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideRouter([]),
          provideCanvasRouting({ loader: stubLoader, notFoundRedirectTo: '/404' }),
          { provide: RemoteManifestLoader, useValue: { manifests: signal([]) } },
        ],
      });
    });

    it('provides CANVAS_NOT_FOUND_REDIRECT with the given path', () => {
      expect(TestBed.inject(CANVAS_NOT_FOUND_REDIRECT)).toBe('/404');
    });
  });
});
