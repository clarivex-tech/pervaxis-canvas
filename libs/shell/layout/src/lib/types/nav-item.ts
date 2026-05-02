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

/**
 * Represents a single navigation item in the sidebar or top nav.
 */
export interface NavItem {
  /** Unique identifier for the nav item. */
  id: string;
  /** Display label. */
  label: string;
  /** Router path (e.g. '/dashboard'). */
  path?: string;
  /** Icon name or ligature (e.g. Material icon key). */
  icon?: string;
  /** Nested children shown when the item is expanded. */
  children?: NavItem[];
  /** Whether this item is disabled. */
  disabled?: boolean;
}

/**
 * A single breadcrumb segment derived from the active route tree.
 */
export interface Breadcrumb {
  /** Human-readable label for this segment. */
  label: string;
  /** Absolute router path, or undefined for the leaf (non-navigable). */
  path?: string;
}
