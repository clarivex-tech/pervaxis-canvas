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
export { provideCanvasCore } from './lib/provide-canvas-core';
export type { CanvasCoreConfig } from './lib/provide-canvas-core';

// Config
export { EnvironmentConfigService } from './lib/config/environment-config.service';
export { CANVAS_CONFIG_URL } from './lib/config/canvas-runtime-config';
export type { CanvasRuntimeConfig } from './lib/config/canvas-runtime-config';

// Manifest
export { RemoteManifestLoader } from './lib/manifest/remote-manifest-loader.service';

// Federation
export { buildFederationManifest } from './lib/federation/federation-bootstrap';

// Initializer (exported for advanced composition)
export { appInitializerFactory } from './lib/initializer/app-initializer.factory';

// Mobile platform detection
export { MobilePlatformService } from './lib/platform/mobile-platform.service';
export type { NativePlatform } from './lib/platform/mobile-platform.service';

// Push notifications
export { PushNotificationService } from './lib/notifications/push-notification.service';
export type { CanvasPushNotification, PushPermissionState } from './lib/notifications/push-notification.service';

// Deep linking
export { DeepLinkService } from './lib/deep-link/deep-link.service';
