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
import { CanvasGridComponent } from './canvas-grid.component';
import { ColDef } from 'ag-grid-community';

interface Row { id: number; name: string; }

const rows: Row[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

const cols: ColDef<Row>[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'name', headerName: 'Name' },
];

describe('CanvasGridComponent', () => {
  let fixture: ComponentFixture<CanvasGridComponent<Row>>;
  let component: CanvasGridComponent<Row>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CanvasGridComponent<Row>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('rowData', rows);
    fixture.componentRef.setInput('columnDefs', cols);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render ag-grid-angular', () => {
    const grid = fixture.nativeElement.querySelector('ag-grid-angular');
    expect(grid).toBeTruthy();
  });

  it('should apply canvas-grid class', () => {
    const grid = fixture.nativeElement.querySelector('.canvas-grid');
    expect(grid).toBeTruthy();
  });

  it('should apply ag-theme-quartz class', () => {
    const grid = fixture.nativeElement.querySelector('.ag-theme-quartz');
    expect(grid).toBeTruthy();
  });

  it('should default pagination to false', () => {
    expect(component.pagination()).toBe(false);
  });

  it('should default paginationPageSize to 20', () => {
    expect(component.paginationPageSize()).toBe(20);
  });

  it('should have default resolvedGridOptions with animateRows', () => {
    const opts = (component as unknown as { resolvedGridOptions: () => object }).resolvedGridOptions();
    expect((opts as { animateRows: boolean }).animateRows).toBe(true);
  });
});
