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

/** Runtime configuration for the Canvas HTTP interceptor stack. */
export interface CanvasHttpConfig {
  /** Maximum number of retry attempts after the initial request. Default: 3. */
  retryAttempts: number;
  /** Base delay in ms for the first retry; doubles on each subsequent attempt. Default: 1000. */
  retryDelayMs: number;
  /** Request timeout in ms. Override per-request via {@link REQUEST_TIMEOUT}. Default: 30 000. */
  timeoutMs: number;
}

export const DEFAULT_HTTP_CONFIG: CanvasHttpConfig = {
  retryAttempts: 3,
  retryDelayMs: 1000,
  timeoutMs: 30_000,
};

/** Inject to override HTTP behaviour workspace-wide or per feature. */
export const CANVAS_HTTP_CONFIG = new InjectionToken<CanvasHttpConfig>('CANVAS_HTTP_CONFIG', {
  providedIn: 'root',
  factory: () => ({ ...DEFAULT_HTTP_CONFIG }),
});
