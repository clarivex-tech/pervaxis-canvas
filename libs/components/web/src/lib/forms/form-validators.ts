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

import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FieldValidation } from './form-types';

/**
 * Builds an array of Angular validators from a `FieldValidation` config object.
 */
export function buildValidators(validation: FieldValidation): ValidatorFn[] {
  const validators: ValidatorFn[] = [];

  if (validation.required) {
    validators.push(Validators.required);
  }
  if (validation.minLength !== undefined) {
    validators.push(Validators.minLength(validation.minLength));
  }
  if (validation.maxLength !== undefined) {
    validators.push(Validators.maxLength(validation.maxLength));
  }
  if (validation.min !== undefined) {
    validators.push(Validators.min(validation.min));
  }
  if (validation.max !== undefined) {
    validators.push(Validators.max(validation.max));
  }
  if (validation.pattern) {
    validators.push(Validators.pattern(validation.pattern));
  }

  return validators;
}

/**
 * Returns a human-readable error message for the first active validation error
 * on the given control, using optional custom `messages` from `FieldValidation`.
 */
export function getFieldError(
  control: AbstractControl,
  validation?: FieldValidation
): string {
  if (!control.errors) return '';

  const errorKey = Object.keys(control.errors)[0];
  const custom = validation?.messages?.[errorKey];
  if (custom) return custom;

  return DEFAULT_MESSAGES[errorKey]?.(control.errors[errorKey]) ?? `Invalid value (${errorKey})`;
}

/** Default fallback messages for built-in validators. */
const DEFAULT_MESSAGES: Record<string, (err: ValidationErrors) => string> = {
  required:   () => 'This field is required.',
  minlength:  (e) => `Minimum length is ${e['requiredLength']} characters.`,
  maxlength:  (e) => `Maximum length is ${e['requiredLength']} characters.`,
  min:        (e) => `Minimum value is ${e['min']}.`,
  max:        (e) => `Maximum value is ${e['max']}.`,
  pattern:    () => 'Value does not match the required format.',
  email:      () => 'Please enter a valid email address.',
};
