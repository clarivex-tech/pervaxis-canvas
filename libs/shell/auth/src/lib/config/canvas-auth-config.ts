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

import { InjectionToken } from '@angular/core';

/**
 * OIDC / shell authentication configuration passed to `provideCanvasAuth()`.
 */
export interface CanvasAuthConfig {
  /** OIDC issuer URL (e.g. `https://auth.example.com`). */
  issuer: string;

  /** OIDC client ID registered with the identity provider. */
  clientId: string;

  /**
   * Post-login redirect URI.
   * Defaults to `window.location.origin` when omitted.
   */
  redirectUri?: string;

  /**
   * OIDC scope string.
   * Defaults to `'openid profile email'` when omitted.
   */
  scope?: string;

  /**
   * Enable automatic silent refresh before token expiry.
   * Defaults to `true`.
   */
  silentRefresh?: boolean;

  /**
   * JWT claim name that carries the user's roles array.
   * Defaults to `'roles'`.
   */
  rolesClaim?: string;

  /**
   * JWT claim name that carries the user's permission codes array.
   * Defaults to `'permissions'`.
   */
  permissionsClaim?: string;
}

/** Injection token for the resolved `CanvasAuthConfig`. */
export const CANVAS_AUTH_CONFIG = new InjectionToken<CanvasAuthConfig>('CANVAS_AUTH_CONFIG');
