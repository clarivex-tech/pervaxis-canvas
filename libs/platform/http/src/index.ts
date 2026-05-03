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
export { provideCanvasHttp } from './lib/provide-canvas-http';

// Configuration
export { CANVAS_HTTP_CONFIG, DEFAULT_HTTP_CONFIG } from './lib/tokens/http-config.token';
export type { CanvasHttpConfig } from './lib/tokens/http-config.token';

// Error types
export { isCanvasHttpError } from './lib/types/canvas-http-error';
export type { CanvasHttpError } from './lib/types/canvas-http-error';

// Per-request timeout context helpers
export { REQUEST_TIMEOUT, withTimeout } from './lib/interceptors/timeout.interceptor';

// Individual interceptors (for advanced composition)
export { correlationIdInterceptor } from './lib/interceptors/correlation-id.interceptor';
export { errorNormalizerInterceptor } from './lib/interceptors/error-normalizer.interceptor';
export { offlineInterceptor } from './lib/interceptors/offline.interceptor';
export { retryInterceptor } from './lib/interceptors/retry.interceptor';
export { timeoutInterceptor } from './lib/interceptors/timeout.interceptor';

// Network service
export { NetworkService } from './lib/services/network.service';
