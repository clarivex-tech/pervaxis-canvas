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
  OnChanges,
  inject,
  input,
  output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { FieldConfig, FormSchema } from './form-types';
import { buildValidators } from './form-validators';
import { CanvasFormControlComponent } from './canvas-form-control.component';

/**
 * Schema-driven form engine.
 * Accepts a `FormSchema`, builds a reactive `FormGroup`, renders controls,
 * and emits the form value on valid submit.
 */
@Component({
  selector: 'canvas-form-engine',
  standalone: true,
  imports: [ReactiveFormsModule, CanvasFormControlComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form
      class="canvas-form"
      [formGroup]="formGroup"
      (ngSubmit)="onSubmit()"
      novalidate
    >
      <div class="canvas-form__fields">
        @for (field of schema().fields; track field.key) {
          <canvas-form-control [field]="field" [form]="formGroup" />
        }
      </div>
      <div class="canvas-form__actions">
        <ng-content select="[canvas-form-actions]" />
        @if (!suppressDefaultSubmit()) {
          <button
            class="canvas-form__submit"
            type="submit"
            [disabled]="formGroup.invalid"
          >
            {{ submitLabel() }}
          </button>
        }
      </div>
    </form>
  `,
  styles: [`
    .canvas-form__fields {
      display: flex;
      flex-direction: column;
      gap: var(--canvas-space-4, 1rem);
    }
    .canvas-form__actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--canvas-space-3, 0.75rem);
      margin-top: var(--canvas-space-6, 1.5rem);
    }
    .canvas-form__submit {
      padding: var(--canvas-space-2, 0.5rem) var(--canvas-space-5, 1.25rem);
      background: var(--canvas-color-primary, #2563eb);
      color: var(--canvas-text-inverse, #ffffff);
      border: none;
      border-radius: var(--canvas-radius-md, 0.375rem);
      font-size: var(--canvas-font-size-sm, 0.875rem);
      font-weight: var(--canvas-font-weight-medium, 500);
      cursor: pointer;
      transition: background var(--canvas-transition-fast, 100ms ease);
    }
    .canvas-form__submit:hover:not(:disabled) {
      background: var(--canvas-color-primary-hover, #1d4ed8);
    }
    .canvas-form__submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `],
})
export class FormEngineComponent implements OnChanges {
  /** Form schema defining the fields. */
  readonly schema = input.required<FormSchema>();

  /** Label for the default submit button. */
  readonly submitLabel = input<string>('Submit');

  /** Hide the default submit button (use `[canvas-form-actions]` slot instead). */
  readonly suppressDefaultSubmit = input<boolean>(false);

  /** Emits the form value when the form is submitted and valid. */
  readonly formSubmit = output<Record<string, unknown>>();

  readonly formGroup: FormGroup = new FormGroup({});

  readonly #fb = inject(FormBuilder);

  ngOnChanges(): void {
    this.#buildForm(this.schema().fields);
  }

  /** Submit handler — marks all controls touched to surface errors, then emits. */
  onSubmit(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.formSubmit.emit(this.formGroup.value as Record<string, unknown>);
    }
  }

  #buildForm(fields: FieldConfig[]): void {
    const controls: Record<string, FormControl> = {};
    for (const field of fields) {
      const validators = field.validation ? buildValidators(field.validation) : [];
      controls[field.key] = this.#fb.control(
        { value: field.defaultValue ?? '', disabled: field.disabled ?? false },
        validators
      );
    }
    Object.keys(controls).forEach((key) => this.formGroup.addControl(key, controls[key]));
  }
}
