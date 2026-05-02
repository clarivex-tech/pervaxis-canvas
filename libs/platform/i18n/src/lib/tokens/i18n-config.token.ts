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
import { InjectionToken } from '@angular/core';
import { CanvasI18nConfig } from '../types/canvas-i18n.types';

export const DEFAULT_I18N_CONFIG: Required<CanvasI18nConfig> = {
  defaultLang: 'en',
  fallbackLang: 'en',
  availableLangs: ['en'],
  translationsPath: '/assets/i18n',
  prodMode: false,
};

/** Provides runtime configuration for the Canvas i18n system. */
export const CANVAS_I18N_CONFIG = new InjectionToken<CanvasI18nConfig>('CANVAS_I18N_CONFIG', {
  providedIn: 'root',
  factory: () => ({ ...DEFAULT_I18N_CONFIG }),
});
