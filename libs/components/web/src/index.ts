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

// Layout components
export { PageComponent } from './lib/components/page/page.component';
export { SectionComponent } from './lib/components/section/section.component';
export { DataViewComponent } from './lib/components/data-view/data-view.component';

// Form engine
export { FieldConfig, FieldOption, FieldType, FieldValidation, FormSchema } from './lib/forms/form-types';
export { buildValidators, getFieldError } from './lib/forms/form-validators';
export { CanvasFormControlComponent } from './lib/forms/canvas-form-control.component';
export { FormEngineComponent } from './lib/forms/form-engine.component';

// Grid
export { CanvasGridComponent } from './lib/grid/canvas-grid.component';
export { TextCellEditorComponent } from './lib/grid/cell-editors/text-cell-editor.component';
export {
  BadgeCellRendererComponent,
  BadgeCellRendererParams,
  BadgeVariant,
} from './lib/grid/cell-renderers/badge-cell-renderer.component';

// Charts
export { CanvasChartComponent } from './lib/charts/canvas-chart.component';
export { BarChartComponent, BarSeries } from './lib/charts/bar-chart.component';
export { LineChartComponent, LineSeries } from './lib/charts/line-chart.component';
export { PieChartComponent, PieSlice } from './lib/charts/pie-chart.component';
export { GaugeChartComponent } from './lib/charts/gauge-chart.component';
