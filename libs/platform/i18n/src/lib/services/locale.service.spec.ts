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
import { Subject } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { CANVAS_I18N_CONFIG } from '../tokens/i18n-config.token';
import { LocaleService } from './locale.service';

const langChanges$ = new Subject<string>();

const mockTransloco = {
  langChanges$,
  setActiveLang: vi.fn((lang: string) => {
    langChanges$.next(lang);
  }),
  getActiveLang: vi.fn(() => 'en'),
};

describe('LocaleService', () => {
  let service: LocaleService;

  beforeEach(() => {
    mockTransloco.getActiveLang.mockReturnValue('en');
    TestBed.configureTestingModule({
      providers: [
        { provide: TranslocoService, useValue: mockTransloco },
        {
          provide: CANVAS_I18N_CONFIG,
          useValue: {
            defaultLang: 'en',
            availableLangs: ['en', 'fr', 'de'],
          },
        },
      ],
    });
    service = TestBed.inject(LocaleService);
  });

  afterEach(() => vi.clearAllMocks());

  it('exposes the initial active lang via the activeLang signal', () => {
    expect(service.activeLang()).toBe('en');
  });

  it('updates the activeLang signal when setLang is called', () => {
    service.setLang('fr');
    expect(service.activeLang()).toBe('fr');
  });

  it('delegates setLang to TranslocoService', () => {
    service.setLang('de');
    expect(mockTransloco.setActiveLang).toHaveBeenCalledWith('de');
  });

  it('getActiveLang returns the current language from TranslocoService', () => {
    mockTransloco.getActiveLang.mockReturnValue('fr');
    expect(service.getActiveLang()).toBe('fr');
  });

  it('exposes availableLangs from config', () => {
    expect(service.availableLangs).toEqual(['en', 'fr', 'de']);
  });
});

describe('LocaleService — availableLangs fallback', () => {
  it('defaults availableLangs to [defaultLang] when not provided in config', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TranslocoService, useValue: mockTransloco },
        { provide: CANVAS_I18N_CONFIG, useValue: { defaultLang: 'es' } },
      ],
    });
    const service = TestBed.inject(LocaleService);
    expect(service.availableLangs).toEqual(['es']);
  });
});
