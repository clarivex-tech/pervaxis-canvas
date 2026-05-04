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
import { Component, Pipe, PipeTransform, signal } from '@angular/core';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { PageComponent, SectionComponent } from '@pervaxis/canvas-components-web';
import { HasPermissionDirective, AuthContextService } from '@pervaxis/canvas-platform-auth';
import { CustomerDetailPage } from './customer-detail.page';
import { CustomerStore } from '../../state/customer.store';
import { Customer } from '../../models/customer.model';

@Pipe({ name: 'transloco', standalone: true, pure: true })
class MockTranslocoPipe implements PipeTransform {
  transform(key: string): string { return key; }
}

@Component({ selector: 'canvas-page', template: '<ng-content />', standalone: true })
class StubPageComponent {}

@Component({ selector: 'canvas-section', template: '<ng-content />', standalone: true })
class StubSectionComponent {}

const MOCK_CUSTOMER: Customer = {
  id: 'c1', code: 'CUST-001', name: 'Acme', email: 'a@test.com',
  phone: '555', status: 'active', industry: 'Technology',
  createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-02T00:00:00Z',
};

function createMockStore() {
  return {
    selected: signal<Customer | null>(MOCK_CUSTOMER),
    loading: signal(false),
    error: signal<string | null>(null),
    select: vi.fn().mockResolvedValue(undefined),
  };
}

describe('CustomerDetailPage', () => {
  let fixture: ComponentFixture<CustomerDetailPage>;
  let mockStore: ReturnType<typeof createMockStore>;
  let authContext: AuthContextService;
  let router: Router;

  beforeEach(async () => {
    mockStore = createMockStore();

    await TestBed.configureTestingModule({
      imports: [CustomerDetailPage],
      providers: [
        provideRouter([]),
        { provide: CustomerStore, useValue: mockStore },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: 'c1' } } },
        },
      ],
    })
      .overrideComponent(CustomerDetailPage, {
        remove: {
          imports: [TranslocoPipe, HasPermissionDirective, PageComponent, SectionComponent],
        },
        add: {
          imports: [MockTranslocoPipe, StubPageComponent, StubSectionComponent],
        },
      })
      .compileComponents();

    authContext = TestBed.inject(AuthContextService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(CustomerDetailPage);
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('calls store.select() with the route id on init', () => {
    fixture.detectChanges();
    expect(mockStore.select).toHaveBeenCalledWith('c1');
  });

  it('navigates back to list on goBack()', () => {
    fixture.detectChanges();
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.componentInstance['goBack']();
    expect(navigateSpy).toHaveBeenCalledWith(['/customers']);
  });

  it('navigates to edit page on navigateToEdit()', () => {
    fixture.detectChanges();
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.componentInstance['navigateToEdit']();
    expect(navigateSpy).toHaveBeenCalledWith(['/customers', 'c1', 'edit']);
  });

  it('shows edit button for users with customers:write permission', async () => {
    authContext.setContext({
      userId: 'u1', email: 'u@test.com', roles: ['admin'],
      permissions: ['customers:write'], token: 'tok',
    });
    fixture.detectChanges();
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('.btn-primary');
    expect(btn).not.toBeNull();
  });

  it('hides edit button for users without customers:write permission', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('.btn-primary');
    expect(btn).toBeNull();
  });
});
