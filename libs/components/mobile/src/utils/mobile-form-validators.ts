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

import { ValidatorFn, Validators } from '@angular/forms';
import { FieldValidation } from '../types/mobile-form-types';

/**
 * Builds an Angular validators array from a `FieldValidation` config.
 */
export function buildMobileValidators(validation: FieldValidation): ValidatorFn[] {
  const validators: ValidatorFn[] = [];
  if (validation.required)                       validators.push(Validators.required);
  if (validation.minLength !== undefined)        validators.push(Validators.minLength(validation.minLength));
  if (validation.maxLength !== undefined)        validators.push(Validators.maxLength(validation.maxLength));
  if (validation.min !== undefined)              validators.push(Validators.min(validation.min));
  if (validation.max !== undefined)              validators.push(Validators.max(validation.max));
  if (validation.pattern)                        validators.push(Validators.pattern(validation.pattern));
  return validators;
}
