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
import { inject, Injectable, Signal, signal } from '@angular/core';
import { CANVAS_ERROR_CONFIG } from '../tokens/error-config.token';
import { StructuredError } from '../types/canvas-error.types';

/**
 * Central store for structured runtime errors captured by the Canvas error system.
 *
 * The `CanvasErrorHandler` writes to this service; `ErrorBoundaryComponent`
 * reads from it reactively via the `lastError` signal.
 */
@Injectable({ providedIn: 'root' })
export class CanvasErrorService {
  private readonly _config = inject(CANVAS_ERROR_CONFIG);
  private readonly _lastError = signal<StructuredError | null>(null);

  /** Read-only signal of the most recent structured error; `null` when no error exists. */
  readonly lastError: Signal<StructuredError | null> = this._lastError.asReadonly();

  /**
   * Records a structured error, logs it to console and/or remote endpoint
   * based on the active `CanvasErrorConfig`.
   */
  report(error: StructuredError): void {
    this._lastError.set(error);

    if (this._config.enableConsoleLog !== false) {
      console.error('[Canvas Error]', error.message, error);
    }

    if (this._config.remoteEndpoint) {
      this._postToRemote(error);
    }
  }

  /** Clears the current error state (e.g. after an `ErrorBoundaryComponent` reset). */
  clear(): void {
    this._lastError.set(null);
  }

  private _postToRemote(error: StructuredError): void {
    fetch(this._config.remoteEndpoint as string, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(error),
    }).catch(() => {
      // Remote logging failures must never throw — they are fire-and-forget.
    });
  }
}
