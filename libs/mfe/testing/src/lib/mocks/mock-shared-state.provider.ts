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

import { Provider } from '@angular/core';
import { CANVAS_SHARED_STATE } from '@pervaxis/canvas-mfe-contracts';

/**
 * Provides a mock value bound to `CANVAS_SHARED_STATE` for use in `TestBed`.
 *
 * The token is intentionally typed as `unknown` in `canvas-mfe-contracts` to
 * avoid a hard dependency on the state library. Pass whatever slice your
 * component under test needs.
 *
 * @example
 * TestBed.configureTestingModule({
 *   providers: [
 *     mockCanvasSharedState({ theme: 'dark', locale: 'en' }),
 *   ],
 * });
 *
 * @param state - The state value to expose via the token. Defaults to `null`.
 */
export function mockCanvasSharedState(state: unknown = null): Provider {
  return { provide: CANVAS_SHARED_STATE, useValue: state };
}
