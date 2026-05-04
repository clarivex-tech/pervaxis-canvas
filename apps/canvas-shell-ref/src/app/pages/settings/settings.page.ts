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
import { PageComponent, SectionComponent, FormEngineComponent } from '@pervaxis/canvas-components-web';
import { FormSchema } from '@pervaxis/canvas-components-web';
import { LocaleService } from '@pervaxis/canvas-platform-i18n';
import { ShellAuthService } from '@pervaxis/canvas-shell-auth';

/**
 * Settings page — locale selection and session management.
 * Demonstrates `FormEngineComponent` and `LocaleService` integration.
 */
@Component({
  selector: 'app-settings-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageComponent, SectionComponent, FormEngineComponent],
  template: `
    <canvas-page title="Settings" subtitle="Application and session preferences">
      <canvas-section title="Locale">
        <canvas-form-engine
          [schema]="localeSchema"
          submitLabel="Apply"
          (formSubmit)="onLocaleChange($event)"
        />
      </canvas-section>

      <canvas-section title="Session">
        <p>Use the button below to end your session and return to the login page.</p>
        <button class="btn-danger" (click)="logout()">Sign Out</button>
      </canvas-section>
    </canvas-page>
  `,
  styles: [`
    .btn-danger {
      background: #dc2626;
      color: white;
      border: none;
      border-radius: var(--canvas-radius-md, 0.5rem);
      padding: 0.6rem 1.5rem;
      font-size: 0.9rem;
      cursor: pointer;
    }
    .btn-danger:hover { background: #b91c1c; }
  `],
})
export class SettingsPage {
  readonly #locale = inject(LocaleService);
  readonly #auth = inject(ShellAuthService);

  readonly localeSchema: FormSchema = {
    fields: [
      {
        key: 'lang',
        type: 'select',
        label: 'Language',
        defaultValue: 'en',
        options: [
          { label: 'English', value: 'en' },
          { label: 'French', value: 'fr' },
          { label: 'German', value: 'de' },
        ],
      },
    ],
  };

  onLocaleChange(value: Record<string, unknown>): void {
    const lang = value['lang'] as string;
    if (lang) this.#locale.setLocale(lang);
  }

  logout(): void {
    this.#auth.logout();
  }
}
