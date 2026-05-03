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

export { bootstrapMfe } from './lib/bootstrap/mfe-bootstrap';
export { buildRemoteEntryConfig } from './lib/federation/remote-config.factory';
export type { MfeRemoteConfig } from './lib/federation/remote-config.factory';
export { MfeAuthContextService } from './lib/auth/mfe-auth-context.service';
export { provideMfeBootstrap } from './lib/provide-mfe-bootstrap';
export type { MfeBootstrapConfig } from './lib/provide-mfe-bootstrap';
export { MFE_NAME } from './lib/tokens/mfe-bootstrap.token';
