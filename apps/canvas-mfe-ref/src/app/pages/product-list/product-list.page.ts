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

import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, ValueFormatterParams, CellClickedEvent } from 'ag-grid-community';
import {
  PageComponent,
  SectionComponent,
  DataViewComponent,
  CanvasGridComponent,
  BadgeCellRendererComponent,
} from '@pervaxis/canvas-components-web';
import { AuthContextService } from '@pervaxis/canvas-platform-auth';
import { MfeAuthContextService } from '@pervaxis/canvas-mfe-bootstrap';

interface Product {
  id: string;
  name: string;
  price: number;
  status: 'active' | 'inactive' | 'draft';
}

/**
 * Product list page — demonstrates `CanvasGridComponent` with ag-Grid
 * and `MfeAuthContextService` reading auth context from the host shell.
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageComponent, SectionComponent, DataViewComponent, CanvasGridComponent],
  template: `
    <canvas-page title="Products" subtitle="Browse and manage the product catalogue">
      <canvas-section>
        <canvas-data-view [loading]="loading()" [empty]="products().length === 0" emptyMessage="No products found.">
          <canvas-grid
            [rowData]="products()"
            [columnDefs]="columnDefs"
            style="height: 400px"
          />
        </canvas-data-view>
      </canvas-section>
    </canvas-page>
  `,
})
export class ProductListPage implements OnInit {
  readonly #router = inject(Router);
  readonly #mfeAuth = inject(MfeAuthContextService);

  readonly loading = signal(true);
  readonly products = signal<Product[]>([]);

  readonly columnDefs: ColDef[] = [
    { field: 'name', headerName: 'Name', flex: 2 },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      valueFormatter: (p: ValueFormatterParams<Product>) => `$${(p.value as number).toFixed(2)}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      cellRenderer: BadgeCellRendererComponent,
      cellRendererParams: {
        colorMap: { active: 'green', inactive: 'red', draft: 'orange' },
      },
    },
    {
      headerName: 'Actions',
      flex: 1,
      cellRenderer: () => '<a class="grid-link">View →</a>',
      onCellClicked: (e: CellClickedEvent<Product>) => {
        const id = (e.data as Product).id;
        void this.#router.navigate([id], { relativeTo: null });
      },
    },
  ];

  ngOnInit(): void {
    // Simulate async data load — replace with CanvasHttpService call in a real MFE.
    setTimeout(() => {
      this.products.set([
        { id: '1', name: 'Canvas Framework', price: 0, status: 'active' },
        { id: '2', name: 'Pervaxis Platform', price: 0, status: 'active' },
        { id: '3', name: 'Forge CLI', price: 0, status: 'draft' },
      ]);
      this.loading.set(false);
    }, 300);
  }
}
