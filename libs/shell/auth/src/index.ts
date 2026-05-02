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
export { provideCanvasAuth } from './lib/provide-canvas-auth';

// Config
export { CANVAS_AUTH_CONFIG } from './lib/config/canvas-auth-config';
export type { CanvasAuthConfig } from './lib/config/canvas-auth-config';

// Service
export { ShellAuthService } from './lib/services/shell-auth.service';

// Interceptor
export { jwtInterceptor } from './lib/interceptors/jwt.interceptor';
