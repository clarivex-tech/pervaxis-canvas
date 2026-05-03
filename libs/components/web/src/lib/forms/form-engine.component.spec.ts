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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormEngineComponent } from './form-engine.component';
import { FormSchema } from './form-types';

const simpleSchema: FormSchema = {
  fields: [
    {
      key: 'name',
      type: 'text',
      label: 'Full Name',
      validation: { required: true },
    },
    {
      key: 'email',
      type: 'email',
      label: 'Email',
    },
  ],
};

describe('FormEngineComponent', () => {
  let fixture: ComponentFixture<FormEngineComponent>;
  let component: FormEngineComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormEngineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormEngineComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('schema', simpleSchema);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build form controls from schema', () => {
    expect(component.formGroup.get('name')).toBeTruthy();
    expect(component.formGroup.get('email')).toBeTruthy();
  });

  it('should mark form invalid when required field is empty', () => {
    expect(component.formGroup.invalid).toBe(true);
  });

  it('should mark form valid when required fields are filled', () => {
    component.formGroup.get('name')?.setValue('Alice');
    expect(component.formGroup.valid).toBe(true);
  });

  it('should render form element', () => {
    const form = fixture.nativeElement.querySelector('form.canvas-form');
    expect(form).toBeTruthy();
  });

  it('should render default submit button', () => {
    const btn = fixture.nativeElement.querySelector('.canvas-form__submit');
    expect(btn).toBeTruthy();
  });

  it('should emit formSubmit with values when form is valid', () => {
    const emitted: Record<string, unknown>[] = [];
    component.formSubmit.subscribe((v) => emitted.push(v));

    component.formGroup.get('name')?.setValue('Alice');
    component.onSubmit();

    expect(emitted.length).toBe(1);
    expect(emitted[0]['name']).toBe('Alice');
  });

  it('should not emit formSubmit when form is invalid', () => {
    const emitted: unknown[] = [];
    component.formSubmit.subscribe((v) => emitted.push(v));

    component.onSubmit();

    expect(emitted.length).toBe(0);
  });

  it('should mark all controls touched on invalid submit', () => {
    component.onSubmit();
    expect(component.formGroup.get('name')?.touched).toBe(true);
  });
});
