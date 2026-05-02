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

/** Structured error produced by the Canvas HTTP error-normalizer interceptor. */
export interface CanvasHttpError {
  /** HTTP status code, or 0 for network/timeout errors. */
  status: number;
  /** Short machine-readable error code string. */
  code: string;
  /** Human-readable error message. */
  message: string;
  /** Correlation ID from the originating request header, if present. */
  correlationId: string | undefined;
  /** Unix timestamp (ms) when the error was created. */
  timestamp: number;
  /** Raw error body from the server response, if any. */
  details: unknown;
}

/** Type guard — returns true when the value conforms to {@link CanvasHttpError}. */
export function isCanvasHttpError(error: unknown): error is CanvasHttpError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'timestamp' in error &&
    typeof (error as CanvasHttpError).status === 'number'
  );
}
