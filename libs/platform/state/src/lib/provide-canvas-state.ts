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
import { CANVAS_SHARED_STATE } from '@pervaxis/canvas-mfe-contracts';
import { SharedStateService } from './shared-state/shared-state.service';

/**
 * Registers the Canvas state infrastructure in the Angular DI tree.
 *
 * Binds `SharedStateService` to the `CANVAS_SHARED_STATE` InjectionToken so
 * that MFEs and platform libs can inject the cross-MFE shared state slice
 * without a hard dependency on the concrete service class.
 *
 * @example
 * ```typescript
 * // app.config.ts (shell)
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideCanvasState(),
 *   ],
 * };
 * ```
 */
export function provideCanvasState(): EnvironmentProviders {
  return makeEnvironmentProviders([
    SharedStateService,
    { provide: CANVAS_SHARED_STATE, useExisting: SharedStateService },
  ]);
}
