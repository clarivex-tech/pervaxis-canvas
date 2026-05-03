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

/** Supported form field types. */
export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'toggle'
  | 'date'
  | 'hidden';

/** A single option for select/multiselect fields. */
export interface FieldOption {
  /** Display label. */
  label: string;
  /** Submitted value. */
  value: unknown;
  /** Disable this option. */
  disabled?: boolean;
}

/** Validation configuration for a field. */
export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  /** Custom regex pattern. */
  pattern?: string;
  /** Custom error messages keyed by validator name. */
  messages?: Record<string, string>;
}

/** Configuration for a single form field. */
export interface FieldConfig {
  /** Unique field key (maps to FormGroup control name). */
  key: string;
  /** Field input type. */
  type: FieldType;
  /** Label shown to the user. */
  label: string;
  /** Placeholder text. */
  placeholder?: string;
  /** Initial/default value. */
  defaultValue?: unknown;
  /** Validation rules. */
  validation?: FieldValidation;
  /** Options for select/multiselect fields. */
  options?: FieldOption[];
  /** Whether the field is disabled. */
  disabled?: boolean;
  /** Hint text displayed below the field. */
  hint?: string;
  /** Number of rows for textarea. */
  rows?: number;
}

/** Top-level form schema. */
export interface FormSchema {
  /** Ordered list of field definitions. */
  fields: FieldConfig[];
}
