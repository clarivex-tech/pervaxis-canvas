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
import { provideRouter, Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  CanvasGridComponent,
  DataViewComponent,
  PageComponent,
} from '@pervaxis/canvas-components-web';
import { AuthContextService } from '@pervaxis/canvas-platform-auth';
import { RowClickedEvent } from 'ag-grid-community';
import { CustomerListPage } from './customer-list.page';
import { CustomerStore } from '../../state/customer.store';
import { CustomerListItem } from '../../models/customer.model';

@Pipe({ name: 'transloco', standalone: true, pure: true })
class MockTranslocoPipe implements PipeTransform {
  transform(key: string): string { return key; }
}

@Component({ selector: 'canvas-page', template: '<ng-content />', standalone: true })
class StubPageComponent {
  @Input() title = '';
  @Input() subtitle = '';
}

@Component({ selector: 'canvas-data-view', template: '<ng-content />', standalone: true })
class StubDataViewComponent {
  @Input() loading = false;
  @Input() empty = false;
  @Input() emptyText = '';
}

@Component({ selector: 'canvas-grid', template: '', standalone: true })
class StubCanvasGridComponent {
  @Input() rowData: unknown[] = [];
  @Input() columnDefs: unknown[] = [];
  @Input() pagination = false;
  @Input() paginationPageSize = 0;
  @Output() rowClicked = new EventEmitter<unknown>();
}

const MOCK_ITEM: CustomerListItem = {
  id: 'c1',
  code: 'CUST-001',
  name: 'Acme',
  email: 'a@test.com',
  status: 'active',
  industry: 'Technology',
};

function createMockStore() {
  return {
    customers: signal([MOCK_ITEM]),
    loading: signal(false),
    error: signal<string | null>(null),
    hasCustomers: signal(true),
    loadAll: vi.fn().mockResolvedValue(undefined),
  };
}

describe('CustomerListPage', () => {
  let fixture: ComponentFixture<CustomerListPage>;
  let mockStore: ReturnType<typeof createMockStore>;
  let authContext: AuthContextService;
  let router: Router;

  beforeEach(async () => {
    mockStore = createMockStore();

    await TestBed.configureTestingModule({
      imports: [CustomerListPage],
      providers: [
        provideRouter([]),
        { provide: CustomerStore, useValue: mockStore },
      ],
    })
      .overrideComponent(CustomerListPage, {
        remove: {
          imports: [
            TranslocoPipe,
            PageComponent,
            DataViewComponent,
            CanvasGridComponent,
          ],
        },
        add: {
          imports: [MockTranslocoPipe, StubPageComponent, StubDataViewComponent, StubCanvasGridComponent],
        },
      })
      .compileComponents();

    authContext = TestBed.inject(AuthContextService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(CustomerListPage);
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('calls store.loadAll() on init', () => {
    fixture.detectChanges();
    expect(mockStore.loadAll).toHaveBeenCalledOnce();
  });

  it('navigates to create page when navigateToCreate() is called', async () => {
    fixture.detectChanges();
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.componentInstance['navigateToCreate']();
    expect(navigateSpy).toHaveBeenCalledWith(['/customers', 'create']);
  });

  it('navigates to detail page on row click', async () => {
    fixture.detectChanges();
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const event = { data: MOCK_ITEM } as RowClickedEvent<CustomerListItem>;
    fixture.componentInstance['onRowClicked'](event);
    expect(navigateSpy).toHaveBeenCalledWith(['/customers', 'c1']);
  });

  it('does not navigate on row click when data is missing', () => {
    fixture.detectChanges();
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.componentInstance['onRowClicked']({ data: undefined } as RowClickedEvent<CustomerListItem>);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('shows create button for users with customers:write permission', async () => {
    authContext.setContext({
      userId: 'u1', email: 'u@test.com', roles: ['admin'],
      permissions: ['customers:write'], token: 'tok',
    });
    fixture.detectChanges();
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('.btn-primary');
    expect(btn).not.toBeNull();
  });

  it('hides create button for users without customers:write permission', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('.btn-primary');
    expect(btn).toBeNull();
  });
});
