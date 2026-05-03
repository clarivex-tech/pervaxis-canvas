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

import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  RowClickedEvent,
  SelectionChangedEvent,
} from 'ag-grid-community';

/**
 * Canvas-branded wrapper around ag-Grid Community.
 * Provides standardised defaults (OnPush, pagination, theme class) and
 * forwards the most common output events.
 */
@Component({
  selector: 'canvas-grid',
  standalone: true,
  imports: [AgGridAngular],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ag-grid-angular
      class="canvas-grid ag-theme-quartz"
      [rowData]="rowData()"
      [columnDefs]="columnDefs()"
      [gridOptions]="resolvedGridOptions()"
      [pagination]="pagination()"
      [paginationPageSize]="paginationPageSize()"
      [rowSelection]="rowSelection()"
      (gridReady)="onGridReady($event)"
      (rowClicked)="rowClicked.emit($event)"
      (selectionChanged)="selectionChanged.emit($event)"
    />
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
    .canvas-grid {
      width: 100%;
      height: 100%;
      --ag-header-background-color: var(--canvas-grid-header-bg, #f9fafb);
      --ag-header-foreground-color: var(--canvas-grid-header-color, #4b5563);
      --ag-border-color: var(--canvas-grid-border-color, #e5e7eb);
      --ag-row-hover-color: var(--canvas-grid-row-hover-bg, #f9fafb);
      --ag-selected-row-background-color: var(--canvas-grid-row-selected-bg, #dbeafe);
      --ag-font-size: var(--canvas-grid-font-size, 0.875rem);
    }
  `],
})
export class CanvasGridComponent<TData = unknown> {
  /** Row data array. */
  readonly rowData = input<TData[]>([]);

  /** Column definitions. */
  readonly columnDefs = input<ColDef<TData>[]>([]);

  /** Additional ag-Grid options merged at render. */
  readonly gridOptions = input<GridOptions<TData>>({});

  /** Enable pagination. */
  readonly pagination = input<boolean>(false);

  /** Rows per page when pagination is enabled. */
  readonly paginationPageSize = input<number>(20);

  /** Row selection mode. */
  readonly rowSelection = input<'single' | 'multiple' | undefined>(undefined);

  /** Emits when ag-Grid is ready; exposes the GridApi. */
  readonly gridReady = output<GridApi<TData>>();

  /** Emits when a row is clicked. */
  readonly rowClicked = output<RowClickedEvent<TData>>();

  /** Emits when row selection changes. */
  readonly selectionChanged = output<SelectionChangedEvent<TData>>();

  protected resolvedGridOptions(): GridOptions<TData> {
    return {
      animateRows: true,
      suppressCellFocus: false,
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true,
        flex: 1,
        minWidth: 100,
      },
      ...this.gridOptions(),
    };
  }

  protected onGridReady(event: GridReadyEvent<TData>): void {
    this.gridReady.emit(event.api);
  }
}
