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
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonToggle,
} from '@ionic/angular/standalone';
import type { FieldConfig, FormSchema } from '../../../types/mobile-form-types';
import { buildMobileValidators } from '../../../utils/mobile-form-validators';

/**
 * Mobile form engine using the same `FormSchema` contract as the web form engine,
 * but rendered with Ionic components for native look and feel.
 */
@Component({
  selector: 'canvas-mobile-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonToggle,
    IonNote,
    IonButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="onSubmit()" novalidate>
      <ion-list [inset]="true">
        @for (field of schema().fields; track field.key) {
          @if (field.type !== 'hidden') {
            <ion-item
              [class.canvas-mobile-form__item--invalid]="isInvalid(field.key)"
            >
              @switch (field.type) {
                @case ('toggle') {
                  <ion-label>{{ field.label }}</ion-label>
                  <ion-toggle
                    [formControlName]="field.key"
                    slot="end"
                  ></ion-toggle>
                }
                @case ('select') {
                  <ion-select
                    [formControlName]="field.key"
                    [label]="field.label"
                    labelPlacement="stacked"
                    [placeholder]="field.placeholder ?? 'Select…'"
                  >
                    @for (opt of field.options ?? []; track opt.value) {
                      <ion-select-option [value]="opt.value">
                        {{ opt.label }}
                      </ion-select-option>
                    }
                  </ion-select>
                }
                @case ('textarea') {
                  <ion-textarea
                    [formControlName]="field.key"
                    [label]="field.label"
                    labelPlacement="stacked"
                    [placeholder]="field.placeholder ?? ''"
                    [rows]="field.rows ?? 4"
                    autoGrow="true"
                  ></ion-textarea>
                }
                @default {
                  <ion-input
                    [formControlName]="field.key"
                    [type]="field.type === 'password' ? 'password' : field.type === 'number' ? 'number' : 'text'"
                    [label]="field.label"
                    labelPlacement="stacked"
                    [placeholder]="field.placeholder ?? ''"
                  ></ion-input>
                }
              }
              @if (isInvalid(field.key)) {
                <ion-note slot="error" color="danger">
                  {{ getError(field.key) }}
                </ion-note>
              }
            </ion-item>
          }
        }
      </ion-list>
      <div class="canvas-mobile-form__actions">
        <ion-button
          type="submit"
          expand="block"
          [disabled]="formGroup.invalid"
        >
          {{ submitLabel() }}
        </ion-button>
      </div>
    </form>
  `,
  styles: [`
    .canvas-mobile-form__actions {
      padding: 16px;
    }
    .canvas-mobile-form__item--invalid {
      --highlight-color-focused: var(--ion-color-danger);
    }
  `],
})
export class MobileFormComponent implements OnChanges {
  /** Form schema (same contract as `FormEngineComponent`). */
  readonly schema = input.required<FormSchema>();

  /** Submit button label. */
  readonly submitLabel = input<string>('Submit');

  /** Emits when the form is submitted and valid. */
  readonly formSubmit = output<Record<string, unknown>>();

  readonly formGroup: FormGroup = new FormGroup({});

  readonly #fb = inject(FormBuilder);

  ngOnChanges(): void {
    this.#buildForm(this.schema().fields);
  }

  onSubmit(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.formSubmit.emit(this.formGroup.value as Record<string, unknown>);
    }
  }

  protected isInvalid(key: string): boolean {
    const ctrl = this.formGroup.get(key);
    return ctrl !== null && ctrl.invalid && ctrl.touched;
  }

  protected getError(key: string): string {
    const ctrl = this.formGroup.get(key);
    if (!ctrl?.errors) return '';
    const errorKey = Object.keys(ctrl.errors)[0];
    const field = this.schema().fields.find((f) => f.key === key);
    return field?.validation?.messages?.[errorKey] ?? DEFAULT_MESSAGES[errorKey] ?? `Invalid (${errorKey})`;
  }

  #buildForm(fields: FieldConfig[]): void {
    const controls: Record<string, FormControl> = {};
    for (const field of fields) {
      const validators = field.validation ? buildMobileValidators(field.validation) : [];
      controls[field.key] = this.#fb.control(
        { value: field.defaultValue ?? '', disabled: field.disabled ?? false },
        validators
      );
    }
    Object.keys(controls).forEach((key) => this.formGroup.addControl(key, controls[key]));
  }
}

const DEFAULT_MESSAGES: Record<string, string> = {
  required:  'This field is required.',
  minlength: 'Value is too short.',
  maxlength: 'Value is too long.',
  min:       'Value is below the minimum.',
  max:       'Value exceeds the maximum.',
  pattern:   'Value does not match the required format.',
  email:     'Please enter a valid email address.',
};
