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
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CANVAS_I18N_CONFIG } from './tokens/i18n-config.token';
import { provideCanvasI18n } from './provide-canvas-i18n';

describe('provideCanvasI18n()', () => {
  describe('with no config argument', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting(), provideCanvasI18n()],
      });
    });

    it('provides default config (en, /assets/i18n, prodMode false)', () => {
      const config = TestBed.inject(CANVAS_I18N_CONFIG);
      expect(config.defaultLang).toBe('en');
      expect(config.translationsPath).toBe('/assets/i18n');
      expect(config.prodMode).toBe(false);
    });
  });

  describe('with partial config override', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          provideCanvasI18n({
            defaultLang: 'fr',
            availableLangs: ['fr', 'en'],
            translationsPath: '/custom/i18n',
            prodMode: true,
          }),
        ],
      });
    });

    it('merges overrides with defaults', () => {
      const config = TestBed.inject(CANVAS_I18N_CONFIG);
      expect(config.defaultLang).toBe('fr');
      expect(config.availableLangs).toEqual(['fr', 'en']);
      expect(config.translationsPath).toBe('/custom/i18n');
      expect(config.prodMode).toBe(true);
    });
  });

  describe('CANVAS_I18N_CONFIG token default factory', () => {
    it('returns default config when not overridden', () => {
      TestBed.configureTestingModule({});
      const config = TestBed.inject(CANVAS_I18N_CONFIG);
      expect(config.defaultLang).toBe('en');
      expect(config.fallbackLang).toBe('en');
      expect(config.translationsPath).toBe('/assets/i18n');
    });
  });
});
