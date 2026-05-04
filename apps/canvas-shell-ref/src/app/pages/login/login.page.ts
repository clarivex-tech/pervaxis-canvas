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

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ShellAuthService } from '@pervaxis/canvas-shell-auth';

/**
 * Login page — triggers the OIDC redirect flow via `ShellAuthService`.
 * Rendered when the user is unauthenticated or navigates to `/login`.
 */
@Component({
  selector: 'app-login-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1 class="login-title">Pervaxis Canvas</h1>
        <p class="login-subtitle">Sign in to continue</p>
        <button class="btn-primary" (click)="login()">
          Sign in with OIDC
        </button>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: var(--canvas-color-surface, #f8fafc);
    }
    .login-card {
      background: white;
      border-radius: var(--canvas-radius-md, 0.5rem);
      box-shadow: var(--canvas-shadow-sm);
      padding: 2.5rem 3rem;
      text-align: center;
      min-width: 320px;
    }
    .login-title { margin: 0 0 0.5rem; font-size: 1.5rem; color: var(--canvas-color-text); }
    .login-subtitle { margin: 0 0 2rem; color: var(--canvas-color-text-muted); }
    .btn-primary {
      background: var(--canvas-color-primary);
      color: white;
      border: none;
      border-radius: var(--canvas-radius-md);
      padding: 0.75rem 2rem;
      font-size: 1rem;
      cursor: pointer;
      width: 100%;
    }
    .btn-primary:hover { background: var(--canvas-color-primary-hover); }
  `],
})
export class LoginPage {
  readonly #auth = inject(ShellAuthService);

  login(): void {
    this.#auth.login();
  }
}
