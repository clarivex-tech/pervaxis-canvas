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

import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { BreadcrumbService } from './services/breadcrumb.service';

/**
 * Registers `canvas-shell-layout` providers into the Angular DI environment.
 * Call from your app's `bootstrapApplication` providers array.
 *
 * @example
 * bootstrapApplication(AppComponent, {
 *   providers: [provideCanvasLayout()],
 * });
 */
export function provideCanvasLayout(): EnvironmentProviders {
  return makeEnvironmentProviders([BreadcrumbService]);
}
