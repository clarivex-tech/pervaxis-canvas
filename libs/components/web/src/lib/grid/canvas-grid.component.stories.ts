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

import type { Meta, StoryObj } from '@storybook/angular';
import type { ColDef } from 'ag-grid-community';
import { CanvasGridComponent } from './canvas-grid.component';

interface Employee {
  name: string;
  role: string;
  department: string;
  status: string;
}

const columnDefs: ColDef<Employee>[] = [
  { field: 'name', headerName: 'Name' },
  { field: 'role', headerName: 'Role' },
  { field: 'department', headerName: 'Department' },
  { field: 'status', headerName: 'Status' },
];

const rowData: Employee[] = [
  { name: 'Alice Johnson', role: 'Senior Engineer', department: 'Platform', status: 'Active' },
  { name: 'Bob Smith', role: 'Product Designer', department: 'Product', status: 'Active' },
  { name: 'Carol White', role: 'Engineering Manager', department: 'Engineering', status: 'Active' },
  { name: 'David Brown', role: 'Data Scientist', department: 'Analytics', status: 'Active' },
  { name: 'Eve Davis', role: 'Security Engineer', department: 'Infrastructure', status: 'On Leave' },
];

const meta: Meta<CanvasGridComponent> = {
  title: 'Components/CanvasGrid',
  component: CanvasGridComponent,
  tags: ['autodocs'],
  argTypes: {
    pagination: { control: 'boolean' },
    paginationPageSize: { control: 'number' },
    rowSelection: { control: { type: 'select' }, options: [undefined, 'single', 'multiple'] },
  },
  decorators: [],
};

export default meta;
type Story = StoryObj<CanvasGridComponent>;

export const Default: Story = {
  args: {
    rowData,
    columnDefs,
  },
  render: (args) => ({
    props: args,
    template: `<div style="height:320px"><canvas-grid [rowData]="rowData" [columnDefs]="columnDefs" /></div>`,
  }),
};

export const WithPagination: Story = {
  args: {
    rowData,
    columnDefs,
    pagination: true,
    paginationPageSize: 3,
  },
  render: (args) => ({
    props: args,
    template: `<div style="height:360px"><canvas-grid [rowData]="rowData" [columnDefs]="columnDefs" [pagination]="pagination" [paginationPageSize]="paginationPageSize" /></div>`,
  }),
};

export const MultiSelect: Story = {
  args: {
    rowData,
    columnDefs,
    rowSelection: 'multiple',
  },
  render: (args) => ({
    props: args,
    template: `<div style="height:320px"><canvas-grid [rowData]="rowData" [columnDefs]="columnDefs" [rowSelection]="rowSelection" /></div>`,
  }),
};
