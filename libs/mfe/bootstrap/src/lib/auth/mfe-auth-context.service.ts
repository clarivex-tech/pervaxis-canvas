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

import { Injectable, Signal, computed, inject } from '@angular/core';
import { AuthContext, CANVAS_AUTH_CONTEXT } from '@pervaxis/canvas-mfe-contracts';

/**
 * Signal-based read-only view of the authenticated user context for MFE remotes.
 *
 * Reads the `CANVAS_AUTH_CONTEXT` token provided by the shell's
 * `canvas-shell-auth` library. When the token is not bound (e.g. in tests
 * that don't load the shell), all derived signals return safe empty defaults.
 *
 * Registered by `provideMfeBootstrap()`.
 *
 * @example
 * readonly #auth = inject(MfeAuthContextService);
 * canEdit = computed(() => this.#auth.hasPermission('invoices:write'));
 */
@Injectable({ providedIn: null })
export class MfeAuthContextService {
  readonly #rawContext = inject(CANVAS_AUTH_CONTEXT, { optional: true });

  /** The full auth context, or `null` when not authenticated or token not bound. */
  readonly context: Signal<AuthContext | null> = computed(() =>
    this.#rawContext?.() ?? null
  );

  /** `true` when the user is currently authenticated. */
  readonly isAuthenticated: Signal<boolean> = computed(() => this.context() !== null);

  /** The current user's subject ID. Empty string when not authenticated. */
  readonly userId: Signal<string> = computed(() => this.context()?.userId ?? '');

  /** The current user's email address. Empty string when not authenticated. */
  readonly email: Signal<string> = computed(() => this.context()?.email ?? '');

  /** The current user's roles. Empty array when not authenticated. */
  readonly roles: Signal<string[]> = computed(() => this.context()?.roles ?? []);

  /** Fine-grained permission codes. Empty array when not authenticated. */
  readonly permissions: Signal<string[]> = computed(() => this.context()?.permissions ?? []);

  /** The raw JWT access token. Empty string when not authenticated. */
  readonly token: Signal<string> = computed(() => this.context()?.token ?? '');

  /**
   * Returns `true` when the authenticated user holds **all** of the given permission codes.
   *
   * @param codes - One or more permission codes to check (e.g. `'invoices:read'`).
   */
  hasPermission(...codes: string[]): boolean {
    return codes.every((c) => this.permissions().includes(c));
  }

  /**
   * Returns `true` when the authenticated user holds **at least one** of the given roles.
   *
   * @param roleNames - One or more role names to check (e.g. `'admin'`).
   */
  hasRole(...roleNames: string[]): boolean {
    return roleNames.some((r) => this.roles().includes(r));
  }
}
