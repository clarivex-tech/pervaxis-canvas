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
import { Component, EventEmitter, Input, Output, Pipe, PipeTransform, signal } from '@angular/core';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormEngineComponent, PageComponent } from '@pervaxis/canvas-components-web';
import { CustomerFormPage } from './customer-form.page';
import { CustomerStore } from '../../state/customer.store';
import { Customer } from '../../models/customer.model';

@Pipe({ name: 'transloco', standalone: true, pure: true })
class MockTranslocoPipe implements PipeTransform {
  transform(key: string): string { return key; }
}

@Component({ selector: 'canvas-page', template: '<ng-content />', standalone: true })
class StubPageComponent {
  @Input() title = '';
}

@Component({ selector: 'canvas-form-engine', template: '', standalone: true })
class StubFormEngineComponent {
  @Input() schema: unknown = null;
  @Input() submitLabel = '';
  @Output() formSubmit = new EventEmitter<unknown>();
}

const MOCK_CUSTOMER: Customer = {
  id: 'c1', code: 'CUST-001', name: 'Acme', email: 'a@test.com',
  phone: '555', status: 'active', industry: 'Technology',
  createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-02T00:00:00Z',
};

function createMockStore(selectedCustomer: Customer | null = null) {
  return {
    selected: signal<Customer | null>(selectedCustomer),
    loading: signal(false),
    error: signal<string | null>(null),
    select: vi.fn().mockResolvedValue(undefined),
    create: vi.fn().mockResolvedValue(MOCK_CUSTOMER),
    update: vi.fn().mockResolvedValue(MOCK_CUSTOMER),
  };
}

describe('CustomerFormPage — create flow', () => {
  let fixture: ComponentFixture<CustomerFormPage>;
  let mockStore: ReturnType<typeof createMockStore>;
  let router: Router;

  beforeEach(async () => {
    mockStore = createMockStore();

    await TestBed.configureTestingModule({
      imports: [CustomerFormPage],
      providers: [
        provideRouter([]),
        { provide: CustomerStore, useValue: mockStore },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
      ],
    })
      .overrideComponent(CustomerFormPage, {
        remove: { imports: [TranslocoPipe, PageComponent, FormEngineComponent] },
        add: { imports: [MockTranslocoPipe, StubPageComponent, StubFormEngineComponent] },
      })
      .compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(CustomerFormPage);
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('does not call store.select() when no route id is present', () => {
    expect(mockStore.select).not.toHaveBeenCalled();
  });

  it('isEdit() returns false', () => {
    expect(fixture.componentInstance['isEdit']()).toBe(false);
  });

  it('calls store.create() on submit and navigates to detail', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const dto = { code: 'CUST-002', name: 'Beta', email: 'b@test.com', phone: '0', industry: 'Finance' };
    await fixture.componentInstance['onSubmit'](dto);
    expect(mockStore.create).toHaveBeenCalledWith(dto);
    expect(navigateSpy).toHaveBeenCalledWith(['/customers', 'c1']);
  });

  it('goBack() navigates to list when no id', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.componentInstance['goBack']();
    expect(navigateSpy).toHaveBeenCalledWith(['/customers']);
  });
});

describe('CustomerFormPage — edit flow', () => {
  let fixture: ComponentFixture<CustomerFormPage>;
  let mockStore: ReturnType<typeof createMockStore>;
  let router: Router;

  beforeEach(async () => {
    mockStore = createMockStore(MOCK_CUSTOMER);

    await TestBed.configureTestingModule({
      imports: [CustomerFormPage],
      providers: [
        provideRouter([]),
        { provide: CustomerStore, useValue: mockStore },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: 'c1' } } } },
      ],
    })
      .overrideComponent(CustomerFormPage, {
        remove: { imports: [TranslocoPipe, PageComponent, FormEngineComponent] },
        add: { imports: [MockTranslocoPipe, StubPageComponent, StubFormEngineComponent] },
      })
      .compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(CustomerFormPage);
    fixture.detectChanges();
  });

  it('calls store.select() with route id on init', () => {
    expect(mockStore.select).toHaveBeenCalledWith('c1');
  });

  it('isEdit() returns true', () => {
    expect(fixture.componentInstance['isEdit']()).toBe(true);
  });

  it('pre-populates form schema with customer values', () => {
    const schema = fixture.componentInstance['formSchema']();
    const codeField = schema.fields.find(f => f.key === 'code');
    expect(codeField?.defaultValue).toBe('CUST-001');
  });

  it('calls store.update() on submit and navigates to detail', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const dto = { name: 'Acme Updated' };
    await fixture.componentInstance['onSubmit'](dto);
    expect(mockStore.update).toHaveBeenCalledWith('c1', dto);
    expect(navigateSpy).toHaveBeenCalledWith(['/customers', 'c1']);
  });

  it('goBack() navigates to detail when id is present', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.componentInstance['goBack']();
    expect(navigateSpy).toHaveBeenCalledWith(['/customers', 'c1']);
  });
});
