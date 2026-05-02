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

/** Structured representation of a runtime error captured by the Canvas error system. */
export interface StructuredError {
  /** Human-readable error message. */
  message: string;
  /** Optional stack trace string. */
  stack?: string;
  /** Unix epoch milliseconds when the error was captured. */
  timestamp: number;
  /** Optional label identifying the component or MFE that originated the error. */
  context?: string;
  /** Any additional data attached by the originating code. */
  details?: unknown;
}

/** Configuration for `provideCanvasError()`. */
export interface CanvasErrorConfig {
  /**
   * URL to POST structured errors to.
   * When omitted, remote logging is disabled.
   */
  remoteEndpoint?: string;
  /**
   * Whether to emit structured errors to the browser console.
   * Defaults to `true`.
   */
  enableConsoleLog?: boolean;
}
