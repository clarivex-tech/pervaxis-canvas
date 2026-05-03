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

/** Typed descriptor for a Native Federation remote configuration. */
export interface MfeRemoteConfig {
  /** Logical name matching `MfeManifest.name` in the registry. */
  name: string;
  /** Map of exposed paths to their Angular source entry points. */
  exposes: Record<string, string>;
}

/**
 * Builds a typed Native Federation remote configuration descriptor.
 *
 * Use the returned object as the base for your MFE remote's
 * `federation.config.js` to get type checking on the name and exposes map.
 *
 * @example
 * // federation.config.js
 * const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');
 * const { buildRemoteEntryConfig } = require('@pervaxis/canvas-mfe-bootstrap');
 *
 * const remote = buildRemoteEntryConfig('orders-mfe', {
 *   './Component': './src/app/app.component.ts',
 * });
 *
 * module.exports = withNativeFederation({
 *   ...remote,
 *   shared: { ...shareAll({ singleton: true, strictVersion: true }) },
 * });
 *
 * @param name    - Logical name matching `MfeManifest.name` in the Canvas registry.
 * @param exposes - Map of exposed paths to Angular source entry points.
 */
export function buildRemoteEntryConfig(
  name: string,
  exposes: Record<string, string>
): MfeRemoteConfig {
  return { name, exposes };
}
