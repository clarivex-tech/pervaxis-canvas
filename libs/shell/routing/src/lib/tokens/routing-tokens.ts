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

import { InjectionToken, Type } from '@angular/core';
import { MfeManifest } from '@pervaxis/canvas-mfe-contracts';

/**
 * Function type for loading a remote Angular component from an MFE manifest.
 *
 * Implement this using `@angular-architects/native-federation`'s `loadRemoteModule`
 * and provide it via `provideCanvasRouting({ loader: ... })`.
 *
 * @example
 * import { loadRemoteModule } from '@angular-architects/native-federation';
 *
 * const loader: MfeModuleLoader = (manifest) =>
 *   loadRemoteModule(manifest.name, manifest.exposedModule).then(m => m.default);
 */
export type MfeModuleLoader = (manifest: MfeManifest) => Promise<Type<unknown>>;

/**
 * Injection token for the MFE remote module loader function.
 * Must be provided via `provideCanvasRouting({ loader })`.
 */
export const CANVAS_MFE_MODULE_LOADER = new InjectionToken<MfeModuleLoader>(
  'CANVAS_MFE_MODULE_LOADER'
);

/**
 * Injection token for the redirect path used by the `**` catch-all route.
 * When not provided, the catch-all renders `CanvasNotFoundComponent` instead.
 */
export const CANVAS_NOT_FOUND_REDIRECT = new InjectionToken<string>(
  'CANVAS_NOT_FOUND_REDIRECT'
);
