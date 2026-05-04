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

import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { HasPermissionDirective } from '@pervaxis/canvas-platform-auth';
import {
  BadgeCellRendererComponent,
  CanvasGridComponent,
  DataViewComponent,
  PageComponent,
} from '@pervaxis/canvas-components-web';
import { ColDef, ICellRendererParams, RowClickedEvent } from 'ag-grid-community';
import { CustomerStore } from '../../state/customer.store';
import { CustomerListItem } from '../../models/customer.model';

/**
 * List page for the Customer domain.
 *
 * Demonstrates:
 * - `CanvasGridComponent` with typed `ColDef<T>[]`
 * - `DataViewComponent` for loading/empty states
 * - `*hasPermission` structural directive for conditional rendering
 * - `transloco` pipe for internationalisation
 * - `CustomerStore` injection and signal binding
 */
@Component({
  selector: 'customer-list',
  standalone: true,
  imports: [
    TranslocoPipe,
    HasPermissionDirective,
    PageComponent,
    DataViewComponent,
    CanvasGridComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <canvas-page
      [title]="'customer.list.title' | transloco"
      [subtitle]="'customer.list.subtitle' | transloco"
    >
      <div canvas-page-actions>
        <button
          *hasPermission="'customers:write'"
          class="btn btn-primary"
          (click)="navigateToCreate()"
        >
          {{ 'customer.action.create' | transloco }}
        </button>
      </div>

      <canvas-data-view
        [loading]="store.loading()"
        [empty]="!store.hasCustomers()"
        [emptyText]="'customer.list.empty' | transloco"
      >
        <canvas-grid
          [rowData]="store.customers()"
          [columnDefs]="columnDefs"
          [pagination]="true"
          [paginationPageSize]="20"
          (rowClicked)="onRowClicked($event)"
        />
      </canvas-data-view>
    </canvas-page>
  `,
})
export class CustomerListPage implements OnInit {
  protected readonly store = inject(CustomerStore);
  private readonly router = inject(Router);

  /** ag-Grid column definitions typed to the CustomerListItem projection. */
  protected readonly columnDefs: ColDef<CustomerListItem>[] = [
    { field: 'code', headerName: 'Code', width: 130, flex: 0 },
    { field: 'name', headerName: 'Name' },
    { field: 'email', headerName: 'Email' },
    { field: 'industry', headerName: 'Industry' },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      flex: 0,
      cellRenderer: BadgeCellRendererComponent,
      cellRendererParams: (params: ICellRendererParams<CustomerListItem>): object => ({
        value: params.value,
        variant: params.value === 'active' ? 'success' : 'warning',
      }),
    },
  ];

  ngOnInit(): void {
    void this.store.loadAll();
  }

  protected navigateToCreate(): void {
    void this.router.navigate(['/customers', 'create']);
  }

  protected onRowClicked(event: RowClickedEvent<CustomerListItem>): void {
    if (event.data?.id) {
      void this.router.navigate(['/customers', event.data.id]);
    }
  }
}
