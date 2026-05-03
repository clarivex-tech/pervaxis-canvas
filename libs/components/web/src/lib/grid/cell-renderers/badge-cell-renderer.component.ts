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

import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

/** Variant colour for the badge. */
export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

/** Extended renderer params to carry badge variant mapping. */
export interface BadgeCellRendererParams extends ICellRendererParams {
  /** Map of cell value → variant. Falls back to 'default'. */
  variantMap?: Record<string, BadgeVariant>;
}

/**
 * ag-Grid cell renderer that displays the cell value as a coloured badge.
 * Pass `variantMap` in `cellRendererParams` to control colours per value.
 */
@Component({
  selector: 'canvas-badge-cell-renderer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="canvas-badge"
      [class]="'canvas-badge--' + variant()"
    >
      {{ label() }}
    </span>
  `,
  styles: [`
    .canvas-badge {
      display: inline-flex;
      align-items: center;
      padding: var(--canvas-badge-padding, 0.125rem 0.5rem);
      border-radius: var(--canvas-badge-radius, 9999px);
      font-size: var(--canvas-badge-font-size, 0.75rem);
      font-weight: var(--canvas-badge-font-weight, 500);
      line-height: 1.5;
      white-space: nowrap;
    }
    .canvas-badge--default {
      background: var(--canvas-color-neutral-100, #f3f4f6);
      color: var(--canvas-color-neutral-700, #374151);
    }
    .canvas-badge--success {
      background: var(--canvas-color-success-muted, #dcfce7);
      color: var(--canvas-color-success, #16a34a);
    }
    .canvas-badge--warning {
      background: var(--canvas-color-warning-muted, #fef3c7);
      color: var(--canvas-color-warning, #d97706);
    }
    .canvas-badge--error {
      background: var(--canvas-color-error-muted, #fee2e2);
      color: var(--canvas-color-error, #dc2626);
    }
    .canvas-badge--info {
      background: var(--canvas-color-info-muted, #cffafe);
      color: var(--canvas-color-info, #0891b2);
    }
  `],
})
export class BadgeCellRendererComponent implements ICellRendererAngularComp {
  protected readonly label = signal('');
  protected readonly variant = signal<BadgeVariant>('default');

  agInit(params: BadgeCellRendererParams): void {
    this.#update(params);
  }

  refresh(params: BadgeCellRendererParams): boolean {
    this.#update(params);
    return true;
  }

  #update(params: BadgeCellRendererParams): void {
    const val = String(params.value ?? '');
    this.label.set(val);
    this.variant.set(params.variantMap?.[val] ?? 'default');
  }
}
