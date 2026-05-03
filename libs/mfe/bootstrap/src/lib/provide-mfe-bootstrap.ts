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

import { EnvironmentProviders, Provider, makeEnvironmentProviders } from '@angular/core';
import { MfeAuthContextService } from './auth/mfe-auth-context.service';
import { MFE_NAME } from './tokens/mfe-bootstrap.token';

/** Configuration options for `provideMfeBootstrap()`. */
export interface MfeBootstrapConfig {
  /** Logical name of this MFE — must match `MfeManifest.name` in the registry. */
  name: string;
}

/**
 * Registers all Canvas MFE Bootstrap providers:
 * - `MfeAuthContextService` — signal-based typed access to the shell auth context
 * - `MFE_NAME` — identifies this remote by name for diagnostics and event sourcing
 *
 * Include this in your MFE remote's `ApplicationConfig`:
 *
 * @example
 * // app.config.ts (MFE remote)
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideMfeBootstrap({ name: 'orders-mfe' }),
 *     provideRouter(routes),
 *   ],
 * };
 */
export function provideMfeBootstrap(config: MfeBootstrapConfig): EnvironmentProviders {
  const providers: Provider[] = [
    MfeAuthContextService,
    { provide: MFE_NAME, useValue: config.name },
  ];
  return makeEnvironmentProviders(providers);
}
