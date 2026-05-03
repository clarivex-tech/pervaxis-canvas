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
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldConfig } from './form-types';
import { getFieldError } from './form-validators';

/**
 * Renders a single reactive form control based on its `FieldConfig`.
 * Intended for internal use by `FormEngineComponent`.
 */
@Component({
  selector: 'canvas-form-control',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let ctrl = form().get(field().key);
    @let isInvalid = ctrl !== null && ctrl.invalid && ctrl.touched;
    <div
      class="canvas-form-control"
      [class.canvas-form-control--invalid]="isInvalid"
    >
      @if (field().type !== 'hidden' && field().type !== 'checkbox' && field().type !== 'toggle') {
        <label class="canvas-form-control__label" [for]="field().key">
          {{ field().label }}
          @if (field().validation?.required) {
            <span class="canvas-form-control__required" aria-hidden="true"> *</span>
          }
        </label>
      }

      @switch (field().type) {
        @case ('textarea') {
          <textarea
            class="canvas-form-control__input canvas-form-control__textarea"
            [id]="field().key"
            [formControl]="$any(ctrl)"
            [placeholder]="field().placeholder ?? ''"
            [rows]="field().rows ?? 4"
            [attr.aria-describedby]="isInvalid ? field().key + '-error' : null"
          ></textarea>
        }
        @case ('select') {
          <select
            class="canvas-form-control__input canvas-form-control__select"
            [id]="field().key"
            [formControl]="$any(ctrl)"
            [attr.aria-describedby]="isInvalid ? field().key + '-error' : null"
          >
            <option value="">{{ field().placeholder ?? 'Select…' }}</option>
            @for (opt of field().options ?? []; track opt.value) {
              <option [value]="opt.value" [disabled]="opt.disabled ?? false">
                {{ opt.label }}
              </option>
            }
          </select>
        }
        @case ('checkbox') {
          <label class="canvas-form-control__checkbox-label" [for]="field().key">
            <input
              class="canvas-form-control__checkbox"
              type="checkbox"
              [id]="field().key"
              [formControl]="$any(ctrl)"
            />
            {{ field().label }}
          </label>
        }
        @case ('toggle') {
          <label class="canvas-form-control__toggle-label" [for]="field().key">
            <input
              class="canvas-form-control__toggle"
              type="checkbox"
              role="switch"
              [id]="field().key"
              [formControl]="$any(ctrl)"
            />
            {{ field().label }}
          </label>
        }
        @case ('hidden') {
          <input type="hidden" [id]="field().key" [formControl]="$any(ctrl)" />
        }
        @default {
          <input
            class="canvas-form-control__input"
            [type]="field().type"
            [id]="field().key"
            [formControl]="$any(ctrl)"
            [placeholder]="field().placeholder ?? ''"
            [attr.aria-describedby]="isInvalid ? field().key + '-error' : null"
          />
        }
      }

      @if (field().hint && !isInvalid) {
        <p class="canvas-form-control__hint" [id]="field().key + '-hint'">{{ field().hint }}</p>
      }

      @if (isInvalid) {
        <p
          class="canvas-form-control__error"
          [id]="field().key + '-error'"
          role="alert"
          aria-live="polite"
        >
          {{ getError(ctrl) }}
        </p>
      }
    </div>
  `,
  styles: [`
    .canvas-form-control {
      display: flex;
      flex-direction: column;
      gap: var(--canvas-space-1, 0.25rem);
    }
    .canvas-form-control__label {
      font-size: var(--canvas-label-font-size, 0.875rem);
      font-weight: var(--canvas-label-font-weight, 500);
      color: var(--canvas-text-primary, #111827);
    }
    .canvas-form-control__required {
      color: var(--canvas-color-error, #dc2626);
    }
    .canvas-form-control__input,
    .canvas-form-control__textarea,
    .canvas-form-control__select {
      height: var(--canvas-input-height, 2.5rem);
      padding: 0 var(--canvas-space-3, 0.75rem);
      border: var(--canvas-input-border, 1px solid #e5e7eb);
      border-radius: var(--canvas-input-radius, 0.375rem);
      font-size: var(--canvas-input-font-size, 0.875rem);
      background: var(--canvas-input-bg, #ffffff);
      color: var(--canvas-text-primary, #111827);
      width: 100%;
      box-sizing: border-box;
      transition: border-color var(--canvas-transition-fast, 100ms ease);
    }
    .canvas-form-control__textarea {
      height: auto;
      padding: var(--canvas-space-2, 0.5rem) var(--canvas-space-3, 0.75rem);
      resize: vertical;
    }
    .canvas-form-control__input:focus,
    .canvas-form-control__textarea:focus,
    .canvas-form-control__select:focus {
      outline: none;
      border: var(--canvas-input-border-focus, 2px solid #2563eb);
    }
    .canvas-form-control--invalid .canvas-form-control__input,
    .canvas-form-control--invalid .canvas-form-control__textarea,
    .canvas-form-control--invalid .canvas-form-control__select {
      border-color: var(--canvas-color-error, #dc2626);
    }
    .canvas-form-control__hint {
      margin: 0;
      font-size: var(--canvas-font-size-xs, 0.75rem);
      color: var(--canvas-text-secondary, #4b5563);
    }
    .canvas-form-control__error {
      margin: 0;
      font-size: var(--canvas-font-size-xs, 0.75rem);
      color: var(--canvas-color-error, #dc2626);
    }
    .canvas-form-control__checkbox-label,
    .canvas-form-control__toggle-label {
      display: flex;
      align-items: center;
      gap: var(--canvas-space-2, 0.5rem);
      font-size: var(--canvas-label-font-size, 0.875rem);
      font-weight: var(--canvas-label-font-weight, 500);
      cursor: pointer;
    }
  `],
})
export class CanvasFormControlComponent {
  /** Field definition. */
  readonly field = input.required<FieldConfig>();

  /** The parent FormGroup containing this control. */
  readonly form = input.required<FormGroup>();

  protected getError(ctrl: ReturnType<FormGroup['get']>): string {
    if (!ctrl) return '';
    return getFieldError(ctrl, this.field().validation);
  }
}
