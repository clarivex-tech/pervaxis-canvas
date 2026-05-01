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

/** Runtime configuration for the Canvas i18n system. */
export interface CanvasI18nConfig {
  /** BCP-47 language tag used on first load (e.g. `'en'`). */
  defaultLang: string;
  /** Language to fall back to when a translation key is missing. Defaults to `defaultLang`. */
  fallbackLang?: string;
  /** Full list of supported language tags. Defaults to `[defaultLang]`. */
  availableLangs?: string[];
  /** Base path to translation JSON files. Defaults to `'/assets/i18n'`. */
  translationsPath?: string;
  /** Set to `true` in production to suppress missing-key warnings. */
  prodMode?: boolean;
}
