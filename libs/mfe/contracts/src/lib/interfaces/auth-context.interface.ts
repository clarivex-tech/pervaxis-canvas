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
 * Authenticated user context shared across the shell and all MFE remotes.
 * Populated by `canvas-shell-auth` after a successful OIDC login and
 * exposed as a read-only signal via `CANVAS_AUTH_CONTEXT`.
 */
export interface AuthContext {
  /** Subject claim from the OIDC token (unique user identifier). */
  userId: string;
  /** User's email address. */
  email: string;
  /** Roles assigned to the user (e.g. `['admin', 'viewer']`). */
  roles: string[];
  /** Fine-grained permission codes (e.g. `['invoices:read', 'invoices:write']`). */
  permissions: string[];
  /** Raw JWT access token for outbound HTTP requests. */
  token: string;
}
