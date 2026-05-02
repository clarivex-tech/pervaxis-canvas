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
import { Signal } from '@angular/core';

/**
 * Minimal contract that every cross-MFE shared state slice must satisfy.
 *
 * Shell provides a concrete implementation via `CANVAS_SHARED_STATE`.
 * MFEs receive it as an injected token and read/write via the typed signals.
 */
export interface SharedState {
  /** Returns the current value of a named state entry, or `undefined`. */
  get<T>(key: string): Signal<T | undefined>;
  /** Sets a named state entry. Notifies all subscribers reactively. */
  set<T>(key: string, value: T): void;
  /** Removes a named state entry. */
  remove(key: string): void;
}
