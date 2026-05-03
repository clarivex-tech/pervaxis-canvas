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

/** Supported form field types for mobile. */
export type MobileFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'toggle'
  | 'hidden';

/** Re-exported as `FieldType` for schema compatibility with the web form engine. */
export type FieldType = MobileFieldType;

/** A single option for select fields. */
export interface FieldOption {
  label: string;
  value: unknown;
}

/** Validation configuration for a mobile field. */
export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  messages?: Record<string, string>;
}

/** Configuration for a single form field. */
export interface FieldConfig {
  key: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  defaultValue?: unknown;
  validation?: FieldValidation;
  options?: FieldOption[];
  disabled?: boolean;
  rows?: number;
}

/** Top-level form schema. */
export interface FormSchema {
  fields: FieldConfig[];
}
