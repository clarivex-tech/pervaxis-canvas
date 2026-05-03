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

import { ApplicationConfig, ApplicationRef, Type } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

/**
 * Creates the Native Federation compatible bootstrap factory for an MFE remote.
 *
 * Returns a zero-argument function that, when called, bootstraps the given
 * standalone Angular component as a remote application. This is the shape
 * expected by `@angular-architects/native-federation` when you export a
 * bootstrap function from a remote entry.
 *
 * @example
 * // remoteEntry.ts
 * import { bootstrapMfe } from '@pervaxis/canvas-mfe-bootstrap';
 * import { AppComponent } from './app/app.component';
 * import { appConfig } from './app/app.config';
 *
 * export const bootstrap = bootstrapMfe(AppComponent, appConfig);
 *
 * @param component  - The standalone root component to bootstrap.
 * @param appConfig  - Optional Angular `ApplicationConfig` with providers.
 * @returns A zero-argument factory function that triggers the bootstrap.
 */
export function bootstrapMfe<T>(
  component: Type<T>,
  appConfig?: ApplicationConfig
): () => Promise<ApplicationRef> {
  return () => bootstrapApplication(component, appConfig);
}
