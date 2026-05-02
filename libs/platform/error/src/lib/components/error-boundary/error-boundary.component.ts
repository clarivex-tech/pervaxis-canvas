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
  computed,
  inject,
  input,
  Signal,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CanvasErrorService } from '../../services/canvas-error.service';
import { StructuredError } from '../../types/canvas-error.types';

/**
 * Wraps content and renders a fallback template whenever an error is active
 * in the `CanvasErrorService`. Integrates with Angular's global `ErrorHandler`
 * via `CanvasErrorService` to show degraded-but-stable UI on failure.
 *
 * Use `reset()` to clear the error state and restore the original content.
 *
 * @example
 * ```html
 * <canvas-error-boundary [fallback]="errorTpl">
 *   <app-risky-feature />
 * </canvas-error-boundary>
 *
 * <ng-template #errorTpl let-error>
 *   <p>Failed to load: {{ error?.message }}</p>
 * </ng-template>
 * ```
 */
@Component({
  selector: 'canvas-error-boundary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  template: `
    @if (hasError()) {
      <ng-container
        [ngTemplateOutlet]="fallback() ?? defaultFallback"
        [ngTemplateOutletContext]="{ $implicit: error() }"
      />
    } @else {
      <ng-content />
    }

    <ng-template #defaultFallback>
      <div class="canvas-error-boundary">
        <p>Something went wrong. Please try again.</p>
        <button type="button" (click)="reset()">Retry</button>
      </div>
    </ng-template>
  `,
})
export class ErrorBoundaryComponent {
  private readonly _errorService = inject(CanvasErrorService);

  /**
   * Optional custom fallback template.
   * The template context exposes the `StructuredError` as `$implicit`.
   */
  readonly fallback = input<TemplateRef<{ $implicit: StructuredError | null }> | undefined>(
    undefined
  );

  /** The current structured error from `CanvasErrorService`, or `null`. */
  readonly error: Signal<StructuredError | null> = this._errorService.lastError;

  /** `true` when there is an active error to display. */
  readonly hasError: Signal<boolean> = computed(() => this._errorService.lastError() !== null);

  /** Clears the error state and restores normal content rendering. */
  reset(): void {
    this._errorService.clear();
  }
}
