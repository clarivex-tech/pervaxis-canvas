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
 * Container for data-heavy views such as grids and charts.
 * Manages a loading overlay, empty state, and consistent chrome.
 */
@Component({
  selector: 'canvas-data-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="canvas-data-view" [class.canvas-data-view--loading]="loading()">
      @if (loading()) {
        <div class="canvas-data-view__overlay" role="status" aria-label="Loading">
          <div class="canvas-data-view__spinner" aria-hidden="true"></div>
        </div>
      }
      @if (!loading() && empty()) {
        <div class="canvas-data-view__empty">
          <p class="canvas-data-view__empty-text">{{ emptyText() }}</p>
        </div>
      } @else {
        <ng-content />
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
    .canvas-data-view {
      position: relative;
      height: 100%;
      min-height: 200px;
    }
    .canvas-data-view--loading {
      pointer-events: none;
    }
    .canvas-data-view__overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgb(255 255 255 / 0.7);
      z-index: var(--canvas-z-overlay, 300);
      border-radius: inherit;
    }
    .canvas-data-view__spinner {
      width: 2rem;
      height: 2rem;
      border: 3px solid var(--canvas-border-color, #e5e7eb);
      border-top-color: var(--canvas-color-primary, #2563eb);
      border-radius: 50%;
      animation: canvas-spin 0.7s linear infinite;
    }
    @keyframes canvas-spin {
      to { transform: rotate(360deg); }
    }
    .canvas-data-view__empty {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 200px;
    }
    .canvas-data-view__empty-text {
      margin: 0;
      font-size: var(--canvas-font-size-sm, 0.875rem);
      color: var(--canvas-text-secondary, #4b5563);
    }
  `],
})
export class DataViewComponent {
  /** Show loading spinner overlay. */
  readonly loading = input<boolean>(false);

  /** Whether the data set is empty (shows empty state when true and not loading). */
  readonly empty = input<boolean>(false);

  /** Message shown in the empty state. */
  readonly emptyText = input<string>('No data to display');
}
