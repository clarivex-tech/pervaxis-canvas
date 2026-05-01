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
import { InjectionToken, Signal } from '@angular/core';
import { AuthContext } from '../interfaces/auth-context.interface';
import { EventBus } from '../interfaces/canvas-event.interface';

/**
 * Provides the authenticated user context as a read-only signal.
 * Bound by `canvas-shell-auth`; consumed by MFEs and platform libs.
 * Value is `null` when no user is authenticated.
 */
export const CANVAS_AUTH_CONTEXT = new InjectionToken<Signal<AuthContext | null>>(
  'CANVAS_AUTH_CONTEXT'
);

/**
 * Provides the cross-MFE event bus.
 * Bound by `canvas-shell-core`; consumed by any MFE that needs
 * to publish or subscribe to cross-boundary events.
 */
export const CANVAS_EVENT_BUS = new InjectionToken<EventBus>('CANVAS_EVENT_BUS');

/**
 * Provides access to the cross-MFE shared state slice.
 * Bound by `canvas-platform-state`; type is intentionally `unknown` here
 * to avoid a hard dependency on the state library from contracts.
 */
export const CANVAS_SHARED_STATE = new InjectionToken<unknown>('CANVAS_SHARED_STATE');
