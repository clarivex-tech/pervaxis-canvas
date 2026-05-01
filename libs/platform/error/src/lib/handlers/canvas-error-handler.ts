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
import { ErrorHandler, inject, Injectable } from '@angular/core';
import { CanvasErrorService } from '../services/canvas-error.service';
import { StructuredError } from '../types/canvas-error.types';

/**
 * Angular `ErrorHandler` implementation for the Canvas platform.
 *
 * Intercepts all uncaught application errors, normalises them into a
 * `StructuredError`, and routes them to `CanvasErrorService` for logging
 * and reactive consumption by `ErrorBoundaryComponent`.
 *
 * Registered via `provideCanvasError()`.
 */
@Injectable()
export class CanvasErrorHandler implements ErrorHandler {
  private readonly _errorService = inject(CanvasErrorService);

  handleError(error: unknown): void {
    const structured = this._normalise(error);
    this._errorService.report(structured);
  }

  private _normalise(error: unknown): StructuredError {
    if (error instanceof Error) {
      return {
        message: error.message,
        stack: error.stack,
        timestamp: Date.now(),
        details: error,
      };
    }

    if (typeof error === 'string') {
      return { message: error, timestamp: Date.now() };
    }

    return {
      message: 'An unknown error occurred.',
      timestamp: Date.now(),
      details: error,
    };
  }
}
