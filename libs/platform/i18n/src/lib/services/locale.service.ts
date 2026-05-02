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
import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { CANVAS_I18N_CONFIG } from '../tokens/i18n-config.token';

/**
 * Provides reactive locale management for the Canvas i18n system.
 *
 * Wraps `TranslocoService` to expose the active language as an Angular
 * signal and centralises locale switching. Use with `provideCanvasI18n()`
 * in the application root.
 *
 * @example
 * ```typescript
 * const locale = inject(LocaleService);
 * locale.setLang('fr');
 * effect(() => console.log('lang is', locale.activeLang()));
 * ```
 */
@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly _translocoService = inject(TranslocoService);
  private readonly _config = inject(CANVAS_I18N_CONFIG);

  /**
   * Signal that emits the BCP-47 tag of the currently active language.
   * Updates reactively whenever `setLang()` is called.
   */
  readonly activeLang: Signal<string> = toSignal(this._translocoService.langChanges$, {
    initialValue: this._translocoService.getActiveLang(),
  });

  /** Full list of supported language tags as configured via `CanvasI18nConfig`. */
  readonly availableLangs: readonly string[] =
    this._config.availableLangs ?? [this._config.defaultLang];

  /**
   * Switches the active language and triggers a reactive re-render.
   * @param lang BCP-47 language tag (must be in `availableLangs`).
   */
  setLang(lang: string): void {
    this._translocoService.setActiveLang(lang);
  }

  /** Returns the BCP-47 tag of the currently active language. */
  getActiveLang(): string {
    return this._translocoService.getActiveLang();
  }
}
