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

/** Describes a Module Federation remote registered with the shell. */
export interface MfeManifest {
  /** Unique logical name for the remote (matches federation.config key). */
  name: string;
  /** URL to the remote's `remoteEntry.json`. */
  remoteEntry: string;
  /** Exposed module path, e.g. `./Module`. */
  exposedModule: string;
  /** Route path the shell will mount this remote at. */
  routePath: string;
  /** Permission codes required to access this remote. Empty means public. */
  permissions?: string[];
}

/** Describes a route contributed by an MFE remote. */
export interface RouteContract {
  /** Matches the `name` in `MfeManifest`. */
  remoteName: string;
  /** Full route path as registered in the shell router. */
  path: string;
  /** Human-readable label used in navigation menus. */
  label: string;
  /** Optional icon identifier for the navigation item. */
  icon?: string;
  /** Permission codes required to see this route in navigation. */
  permissions?: string[];
}
