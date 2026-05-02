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
import { CanvasErrorConfig } from '../types/canvas-error.types';

export const DEFAULT_ERROR_CONFIG: Required<CanvasErrorConfig> = {
  remoteEndpoint: '',
  enableConsoleLog: true,
};

/** Provides runtime configuration for the Canvas error handling system. */
export const CANVAS_ERROR_CONFIG = new InjectionToken<CanvasErrorConfig>(
  'CANVAS_ERROR_CONFIG',
  { providedIn: 'root', factory: () => ({ ...DEFAULT_ERROR_CONFIG }) }
);
