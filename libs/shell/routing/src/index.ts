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

// Provider
export { provideCanvasRouting } from './lib/provide-canvas-routing';
export type { CanvasRoutingConfig } from './lib/provide-canvas-routing';

// Service
export { ShellRoutingService } from './lib/shell-routing.service';

// Tokens
export { CANVAS_MFE_MODULE_LOADER, CANVAS_NOT_FOUND_REDIRECT } from './lib/tokens/routing-tokens';
export type { MfeModuleLoader } from './lib/tokens/routing-tokens';

// Components
export { CanvasNotFoundComponent } from './lib/components/not-found/canvas-not-found.component';
