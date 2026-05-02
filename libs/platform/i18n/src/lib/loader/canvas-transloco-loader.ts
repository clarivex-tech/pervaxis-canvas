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
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { CANVAS_I18N_CONFIG } from '../tokens/i18n-config.token';

/**
 * Lazy translation file loader for the Canvas i18n system.
 *
 * Fetches per-language JSON files from the configured `translationsPath`
 * (default: `/assets/i18n`). Each file must be named `{lang}.json`.
 *
 * Consumed by Transloco via `provideCanvasI18n()`.
 */
@Injectable({ providedIn: 'root' })
export class CanvasTranslocoLoader implements TranslocoLoader {
  private readonly _http = inject(HttpClient);
  private readonly _config = inject(CANVAS_I18N_CONFIG);

  /**
   * Returns an `Observable` that emits the translation map for the given language.
   * Transloco calls this lazily on first use of each language.
   */
  getTranslation(lang: string): Observable<Translation> {
    const path = this._config.translationsPath ?? '/assets/i18n';
    return this._http.get<Translation>(`${path}/${lang}.json`);
  }
}
