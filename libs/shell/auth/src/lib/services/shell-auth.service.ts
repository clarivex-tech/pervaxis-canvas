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

import { Injectable, inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthContextService } from '@pervaxis/canvas-platform-auth';
import { CANVAS_AUTH_CONFIG, CanvasAuthConfig } from '../config/canvas-auth-config';

/**
 * Orchestrates the full OIDC authentication lifecycle for Canvas shell apps:
 *
 * - Configures `OAuthService` from the `CanvasAuthConfig` token
 * - Discovers the OIDC endpoints and processes the auth callback
 * - Sets up automatic silent refresh for token expiry
 * - Syncs claims into `AuthContextService` after login
 * - Provides `login()` and `logout()` entry points
 *
 * Initialised automatically by the `APP_INITIALIZER` in `provideCanvasAuth()`.
 */
@Injectable({ providedIn: null })
export class ShellAuthService {
  readonly #oauthService = inject(OAuthService);
  readonly #authContext = inject(AuthContextService);
  readonly #config = inject(CANVAS_AUTH_CONFIG);

  /**
   * Configures OIDC, discovers endpoints, processes the post-login callback,
   * enables silent refresh, and populates `AuthContextService` when a valid
   * token already exists.
   *
   * Called automatically by `provideCanvasAuth()`'s `APP_INITIALIZER`.
   */
  async initialize(): Promise<void> {
    this.#configureOAuth(this.#config);
    await this.#oauthService.loadDiscoveryDocumentAndTryLogin();

    if (this.#config.silentRefresh !== false) {
      this.#oauthService.setupAutomaticSilentRefresh();
    }

    if (this.#oauthService.hasValidAccessToken()) {
      this.#syncAuthContext();
    }
  }

  /**
   * Initiates the OIDC Authorization Code flow.
   * Redirects the browser to the identity provider's login page.
   */
  login(): void {
    this.#oauthService.initCodeFlow();
  }

  /**
   * Logs the user out:
   * 1. Clears the local `AuthContextService` context
   * 2. Revokes tokens and redirects to the OIDC end-session endpoint
   */
  logout(): void {
    this.#authContext.clearContext();
    this.#oauthService.logOut();
  }

  /** `true` when the user has a valid, non-expired access token. */
  get isAuthenticated(): boolean {
    return this.#oauthService.hasValidAccessToken();
  }

  #configureOAuth(config: CanvasAuthConfig): void {
    this.#oauthService.configure({
      issuer: config.issuer,
      clientId: config.clientId,
      redirectUri: config.redirectUri ?? window.location.origin,
      responseType: 'code',
      scope: config.scope ?? 'openid profile email',
      showDebugInformation: false,
      clearHashAfterLogin: true,
    });
  }

  #syncAuthContext(): void {
    const claims = this.#oauthService.getIdentityClaims() as Record<string, unknown>;
    const rolesClaim = this.#config.rolesClaim ?? 'roles';
    const permsClaim = this.#config.permissionsClaim ?? 'permissions';

    this.#authContext.setContext({
      userId: String(claims['sub'] ?? ''),
      email: String(claims['email'] ?? ''),
      roles: Array.isArray(claims[rolesClaim]) ? (claims[rolesClaim] as string[]) : [],
      permissions: Array.isArray(claims[permsClaim]) ? (claims[permsClaim] as string[]) : [],
      token: this.#oauthService.getAccessToken(),
    });
  }
}
