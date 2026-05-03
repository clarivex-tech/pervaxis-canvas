# @pervaxis/canvas-components-web

Browser component library for the Pervaxis Canvas platform — layout shells, schema-driven forms, ag-Grid wrapper, and Apache ECharts chart components. All styling is driven by `--canvas-*` CSS custom properties.

## Installation

Workspace library — no separate install. Declare peerDependencies in the consuming app:

```json
"ag-grid-angular": "^33",
"ag-grid-community": "^33",
"echarts": "^5"
```

## Design Tokens

Import the token sheet once in your root stylesheet:

```scss
@use '@pervaxis/canvas-components-web/src/styles/canvas-tokens' as *;
```

Override any token at `:root` or a scoped selector to theme the library.

## Layout Components

### `PageComponent` (`canvas-page`)

Top-level page wrapper with title, optional subtitle, and a header-actions slot.

```html
<canvas-page title="Dashboard" subtitle="Today's overview">
  <button canvas-page-actions>Export</button>
  <!-- content -->
</canvas-page>
```

### `SectionComponent` (`canvas-section`)

Card-style content group with optional title, description, and actions slot.

```html
<canvas-section title="Users" description="Active accounts">
  <button canvas-section-actions>Add User</button>
  <!-- content -->
</canvas-section>
```

### `DataViewComponent` (`canvas-data-view`)

Wrapper for grids and charts with loading spinner and empty-state handling.

```html
<canvas-data-view [loading]="isLoading()" [empty]="rows().length === 0">
  <canvas-grid [rowData]="rows()" [columnDefs]="cols" />
</canvas-data-view>
```

## Form Engine

Schema-driven reactive forms from a JSON config.

```typescript
const schema: FormSchema = {
  fields: [
    { key: 'name',  type: 'text',   label: 'Name',  validation: { required: true } },
    { key: 'email', type: 'email',  label: 'Email' },
    { key: 'role',  type: 'select', label: 'Role',  options: [{ label: 'Admin', value: 'admin' }] },
  ],
};
```

```html
<canvas-form-engine [schema]="schema" (formSubmit)="onSubmit($event)" />
```

## Grid (`CanvasGridComponent`)

Thin wrapper around ag-Grid Community with Canvas theme defaults.

```html
<canvas-grid
  [rowData]="rows()"
  [columnDefs]="cols"
  [pagination]="true"
  [paginationPageSize]="25"
  (gridReady)="onGridReady($event)"
  (rowClicked)="onRowClick($event)"
/>
```

### Cell Renderers & Editors

- `BadgeCellRendererComponent` — colour-coded badges driven by `variantMap`
- `TextCellEditorComponent` — inline text editing

## Charts

All chart components are thin wrappers over Apache ECharts via `CanvasChartComponent`.

### Bar Chart

```html
<canvas-bar-chart
  [categories]="['Jan','Feb','Mar']"
  [series]="[{ name: 'Revenue', data: [100, 200, 150] }]"
  title="Monthly Revenue"
/>
```

### Line Chart

```html
<canvas-line-chart [categories]="months" [series]="series" />
```

### Pie / Donut Chart

```html
<canvas-pie-chart [slices]="slices" [donut]="true" />
```

### Gauge Chart

```html
<canvas-gauge-chart [value]="72" [min]="0" [max]="100" name="CPU" />
```

### Custom ECharts Options

Use `CanvasChartComponent` directly for any chart type:

```html
<canvas-chart [options]="myEChartsOption" />
```
