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
 * Card-style section component for grouping related content.
 * Provides an optional title, optional description, header-actions slot,
 * and a padded content area.
 */
@Component({
  selector: 'canvas-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="canvas-section" [attr.aria-label]="title() || null">
      @if (title() || hasActions) {
        <div class="canvas-section__header">
          <div class="canvas-section__heading">
            @if (title()) {
              <h2 class="canvas-section__title">{{ title() }}</h2>
            }
            @if (description()) {
              <p class="canvas-section__description">{{ description() }}</p>
            }
          </div>
          <div class="canvas-section__actions">
            <ng-content select="[canvas-section-actions]" />
          </div>
        </div>
      }
      <div class="canvas-section__body">
        <ng-content />
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
    .canvas-section {
      background: var(--canvas-surface-raised, #ffffff);
      border: 1px solid var(--canvas-border-color, #e5e7eb);
      border-radius: var(--canvas-radius-lg, 0.5rem);
      box-shadow: var(--canvas-shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05));
      overflow: hidden;
    }
    .canvas-section__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--canvas-space-4, 1rem);
      padding: var(--canvas-section-padding, 1.5rem);
      border-bottom: 1px solid var(--canvas-border-color, #e5e7eb);
    }
    .canvas-section__heading {
      display: flex;
      flex-direction: column;
      gap: var(--canvas-space-1, 0.25rem);
    }
    .canvas-section__title {
      margin: 0;
      font-size: var(--canvas-font-size-lg, 1.125rem);
      font-weight: var(--canvas-font-weight-semibold, 600);
      color: var(--canvas-text-primary, #111827);
      line-height: var(--canvas-line-height-snug, 1.375);
    }
    .canvas-section__description {
      margin: 0;
      font-size: var(--canvas-font-size-sm, 0.875rem);
      color: var(--canvas-text-secondary, #4b5563);
    }
    .canvas-section__actions {
      display: flex;
      align-items: center;
      gap: var(--canvas-space-2, 0.5rem);
      flex-shrink: 0;
    }
    .canvas-section__body {
      padding: var(--canvas-section-padding, 1.5rem);
    }
  `],
})
export class SectionComponent {
  /** Section heading. Omit to render a headerless card. */
  readonly title = input<string>('');

  /** Optional description below the title. */
  readonly description = input<string>('');

  protected readonly hasActions = false;
}
