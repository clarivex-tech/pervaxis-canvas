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

export type { StructuredError, CanvasErrorConfig } from './lib/types/canvas-error.types';
export { CANVAS_ERROR_CONFIG } from './lib/tokens/error-config.token';
export { CanvasErrorService } from './lib/services/canvas-error.service';
export { CanvasErrorHandler } from './lib/handlers/canvas-error-handler';
export { ErrorBoundaryComponent } from './lib/components/error-boundary/error-boundary.component';
export { provideCanvasError } from './lib/provide-canvas-error';
