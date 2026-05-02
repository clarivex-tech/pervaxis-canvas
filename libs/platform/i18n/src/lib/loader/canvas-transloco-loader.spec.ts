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
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CANVAS_I18N_CONFIG } from '../tokens/i18n-config.token';
import { CanvasTranslocoLoader } from './canvas-transloco-loader';

describe('CanvasTranslocoLoader', () => {
  let loader: CanvasTranslocoLoader;
  let http: HttpTestingController;

  describe('with default config', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          { provide: CANVAS_I18N_CONFIG, useValue: { defaultLang: 'en', translationsPath: '/assets/i18n' } },
        ],
      });
      loader = TestBed.inject(CanvasTranslocoLoader);
      http = TestBed.inject(HttpTestingController);
    });

    afterEach(() => http.verify());

    it('requests the correct URL for a given language', () => {
      loader.getTranslation('en').subscribe();
      const req = http.expectOne('/assets/i18n/en.json');
      expect(req.request.method).toBe('GET');
      req.flush({ hello: 'world' });
    });

    it('emits the translation map returned by the server', () => {
      const translations = { greeting: 'Hello', farewell: 'Goodbye' };
      let result: Record<string, string> | undefined;

      loader.getTranslation('en').subscribe((v) => {
        result = v as Record<string, string>;
      });

      http.expectOne('/assets/i18n/en.json').flush(translations);
      expect(result).toEqual(translations);
    });

    it('loads a non-default language', () => {
      loader.getTranslation('fr').subscribe();
      http.expectOne('/assets/i18n/fr.json').flush({});
    });
  });

  describe('with custom translationsPath', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          {
            provide: CANVAS_I18N_CONFIG,
            useValue: { defaultLang: 'en', translationsPath: '/custom/path/i18n' },
          },
        ],
      });
      loader = TestBed.inject(CanvasTranslocoLoader);
      http = TestBed.inject(HttpTestingController);
    });

    afterEach(() => http.verify());

    it('uses the configured custom path', () => {
      loader.getTranslation('de').subscribe();
      http.expectOne('/custom/path/i18n/de.json').flush({});
    });
  });

  describe('without translationsPath in config (uses default fallback)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          { provide: CANVAS_I18N_CONFIG, useValue: { defaultLang: 'en' } },
        ],
      });
      loader = TestBed.inject(CanvasTranslocoLoader);
      http = TestBed.inject(HttpTestingController);
    });

    afterEach(() => http.verify());

    it('falls back to /assets/i18n when translationsPath is not set', () => {
      loader.getTranslation('en').subscribe();
      http.expectOne('/assets/i18n/en.json').flush({});
    });
  });
});
