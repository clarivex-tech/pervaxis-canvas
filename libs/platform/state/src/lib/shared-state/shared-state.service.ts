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
import { Injectable, Signal, signal } from '@angular/core';
import { SharedState } from '../interfaces/shared-state.interface';

/**
 * Signal-based implementation of `SharedState`.
 *
 * Acts as a keyed signal registry — each entry is an independent Angular
 * signal that MFEs can observe reactively. The shell provides this service
 * via `CANVAS_SHARED_STATE` so all remotes share the same instance.
 */
@Injectable({ providedIn: 'root' })
export class SharedStateService implements SharedState {
  private readonly _store = new Map<string, ReturnType<typeof signal>>();

  /**
   * Returns a read-only signal for the given key.
   * If the key has never been set the signal value is `undefined`.
   */
  get<T>(key: string): Signal<T | undefined> {
    if (!this._store.has(key)) {
      this._store.set(key, signal<T | undefined>(undefined));
    }
    return (this._store.get(key) as ReturnType<typeof signal<T | undefined>>).asReadonly();
  }

  /** Writes a value into the store, creating the signal if needed. */
  set<T>(key: string, value: T): void {
    if (!this._store.has(key)) {
      this._store.set(key, signal<T | undefined>(undefined));
    }
    (this._store.get(key) as ReturnType<typeof signal<T | undefined>>).set(value);
  }

  /** Removes an entry from the store and resets its signal to `undefined`. */
  remove(key: string): void {
    if (this._store.has(key)) {
      (this._store.get(key) as ReturnType<typeof signal>).set(undefined);
      this._store.delete(key);
    }
  }
}
