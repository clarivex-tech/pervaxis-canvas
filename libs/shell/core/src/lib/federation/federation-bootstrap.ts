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

import { MfeManifest } from '@pervaxis/canvas-mfe-contracts';

/**
 * Converts a `MfeManifest` array into the remote map format expected
 * by `@angular-architects/native-federation`'s `initFederation()`.
 *
 * Call this in `main.ts` before `bootstrapApplication()`:
 *
 * @example
 * // main.ts
 * import { initFederation } from '@angular-architects/native-federation';
 * import { buildFederationManifest } from '@pervaxis/canvas-shell-core';
 *
 * const manifests: MfeManifest[] = await fetchManifestsFromRegistry();
 * await initFederation(buildFederationManifest(manifests));
 * await bootstrapApplication(AppComponent, appConfig);
 *
 * @param manifests - Array of MFE manifests loaded from the registry.
 * @returns A `Record<name, remoteEntryUrl>` map for `initFederation`.
 */
export function buildFederationManifest(manifests: MfeManifest[]): Record<string, string> {
  return Object.fromEntries(manifests.map((m) => [m.name, m.remoteEntry]));
}
