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

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Top-level page wrapper component.
 * Provides consistent page title, optional subtitle, header actions slot,
 * and scrollable content area.
 */
@Component({
  selector: 'canvas-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="canvas-page">
      <header class="canvas-page__header">
        <div class="canvas-page__heading">
          <h1 class="canvas-page__title">{{ title() }}</h1>
          @if (subtitle()) {
            <p class="canvas-page__subtitle">{{ subtitle() }}</p>
          }
        </div>
        <div class="canvas-page__actions">
          <ng-content select="[canvas-page-actions]" />
        </div>
      </header>
      <div class="canvas-page__content">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
    .canvas-page {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: var(--canvas-page-padding, 1.5rem);
      gap: var(--canvas-section-gap, 1.5rem);
      background: var(--canvas-surface-sunken, #f9fafb);
    }
    .canvas-page__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--canvas-space-4, 1rem);
      flex-shrink: 0;
    }
    .canvas-page__heading {
      display: flex;
      flex-direction: column;
      gap: var(--canvas-space-1, 0.25rem);
    }
    .canvas-page__title {
      margin: 0;
      font-size: var(--canvas-font-size-2xl, 1.5rem);
      font-weight: var(--canvas-font-weight-semibold, 600);
      color: var(--canvas-text-primary, #111827);
      line-height: var(--canvas-line-height-tight, 1.25);
    }
    .canvas-page__subtitle {
      margin: 0;
      font-size: var(--canvas-font-size-sm, 0.875rem);
      color: var(--canvas-text-secondary, #4b5563);
      line-height: var(--canvas-line-height-normal, 1.5);
    }
    .canvas-page__actions {
      display: flex;
      align-items: center;
      gap: var(--canvas-space-3, 0.75rem);
      flex-shrink: 0;
    }
    .canvas-page__content {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      gap: var(--canvas-section-gap, 1.5rem);
    }
  `],
})
export class PageComponent {
  /** Page heading text. */
  readonly title = input.required<string>();

  /** Optional subheading below the title. */
  readonly subtitle = input<string>('');
}
