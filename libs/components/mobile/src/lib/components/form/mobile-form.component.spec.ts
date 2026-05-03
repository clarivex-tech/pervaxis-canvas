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
import { provideIonicAngular } from '@ionic/angular/standalone';
import { MobileFormComponent } from './mobile-form.component';
import { FormSchema } from '../../../types/mobile-form-types';

const schema: FormSchema = {
  fields: [
    { key: 'name',  type: 'text',  label: 'Name',  validation: { required: true } },
    { key: 'email', type: 'email', label: 'Email' },
  ],
};

describe('MobileFormComponent', () => {
  let fixture: ComponentFixture<MobileFormComponent>;
  let component: MobileFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileFormComponent],
      providers: [provideIonicAngular()],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('schema', schema);
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

  it('should mark form valid when required field is filled', () => {
    component.formGroup.get('name')?.setValue('Alice');
    expect(component.formGroup.valid).toBe(true);
  });

  it('should render a form element', () => {
    const form = fixture.nativeElement.querySelector('form');
    expect(form).toBeTruthy();
  });

  it('should render ion-list', () => {
    const list = fixture.nativeElement.querySelector('ion-list');
    expect(list).toBeTruthy();
  });

  it('should emit formSubmit when valid', () => {
    const emitted: Record<string, unknown>[] = [];
    component.formSubmit.subscribe((v) => emitted.push(v));
    component.formGroup.get('name')?.setValue('Bob');
    component.onSubmit();
    expect(emitted.length).toBe(1);
    expect(emitted[0]['name']).toBe('Bob');
  });

  it('should not emit formSubmit when invalid', () => {
    const emitted: unknown[] = [];
    component.formSubmit.subscribe((v) => emitted.push(v));
    component.onSubmit();
    expect(emitted.length).toBe(0);
  });

  it('should mark all touched on invalid submit', () => {
    component.onSubmit();
    expect(component.formGroup.get('name')?.touched).toBe(true);
  });

  it('should return true for isInvalid after touch when error present', () => {
    component.formGroup.get('name')?.markAsTouched();
    const invalid = (component as unknown as { isInvalid: (k: string) => boolean }).isInvalid('name');
    expect(invalid).toBe(true);
  });
});
