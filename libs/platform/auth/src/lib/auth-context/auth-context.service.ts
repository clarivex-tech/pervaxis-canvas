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
import { computed, Injectable, Signal, signal } from '@angular/core';
import { AuthContext } from '@pervaxis/canvas-mfe-contracts';

/**
 * Manages the authenticated user context as Angular signals.
 *
 * The shell (`canvas-shell-auth`) writes the context after a successful
 * OIDC login. All platform libs and MFEs read it as derived signals.
 */
@Injectable({ providedIn: 'root' })
export class AuthContextService {
  private readonly _context = signal<AuthContext | null>(null);

  /** Read-only signal of the current auth context; `null` when not authenticated. */
  readonly context: Signal<AuthContext | null> = this._context.asReadonly();

  /** Derived signal: `true` when a user is authenticated. */
  readonly isAuthenticated: Signal<boolean> = computed(() => this._context() !== null);

  /** Derived signal: the current user's roles, or an empty array. */
  readonly roles: Signal<string[]> = computed(() => this._context()?.roles ?? []);

  /** Derived signal: the current user's permission codes, or an empty array. */
  readonly permissions: Signal<string[]> = computed(() => this._context()?.permissions ?? []);

  /**
   * Sets the authenticated user context.
   * Called by `canvas-shell-auth` after a successful OIDC token exchange.
   */
  setContext(context: AuthContext): void {
    this._context.set(context);
  }

  /** Clears the auth context on logout. */
  clearContext(): void {
    this._context.set(null);
  }

  /**
   * Returns `true` if the current user has all of the specified roles.
   * @param roles One or more role names to check.
   */
  hasRole(...roles: string[]): boolean {
    const current = this._context();
    if (!current) return false;
    return roles.every(r => current.roles.includes(r));
  }

  /**
   * Returns `true` if the current user has all of the specified permissions.
   * @param permissions One or more permission codes to check.
   */
  hasPermission(...permissions: string[]): boolean {
    const current = this._context();
    if (!current) return false;
    return permissions.every(p => current.permissions.includes(p));
  }
}
