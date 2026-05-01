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
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideTransloco } from '@jsverse/transloco';
import { CanvasTranslocoLoader } from './loader/canvas-transloco-loader';
import { CANVAS_I18N_CONFIG, DEFAULT_I18N_CONFIG } from './tokens/i18n-config.token';
import { CanvasI18nConfig } from './types/canvas-i18n.types';

/**
 * Registers the Canvas i18n infrastructure in the Angular DI tree.
 *
 * Configures Transloco with `CanvasTranslocoLoader` for lazy JSON file loading
 * and exposes the active locale reactively via `LocaleService`.
 *
 * Requires `provideHttpClient()` to be present in the same injector scope
 * because `CanvasTranslocoLoader` uses `HttpClient` to fetch translation files.
 *
 * @param config Optional runtime overrides merged with `DEFAULT_I18N_CONFIG`.
 *
 * @example
 * ```typescript
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideHttpClient(),
 *     provideCanvasI18n({ defaultLang: 'en', availableLangs: ['en', 'fr', 'de'] }),
 *   ],
 * };
 * ```
 */
export function provideCanvasI18n(config?: Partial<CanvasI18nConfig>): EnvironmentProviders {
  const resolved: Required<CanvasI18nConfig> = { ...DEFAULT_I18N_CONFIG, ...config };
  return makeEnvironmentProviders([
    { provide: CANVAS_I18N_CONFIG, useValue: resolved },
    ...provideTransloco({
      config: {
        availableLangs: resolved.availableLangs,
        defaultLang: resolved.defaultLang,
        fallbackLang: resolved.fallbackLang,
        reRenderOnLangChange: true,
        prodMode: resolved.prodMode,
      },
      loader: CanvasTranslocoLoader,
    }),
  ]);
}
