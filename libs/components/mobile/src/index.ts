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

// Components
export { MobileListComponent } from './lib/components/list/mobile-list.component';
export { MobileFormComponent } from './lib/components/form/mobile-form.component';
export { MobileChartComponent, MOBILE_ECHARTS_INIT, MobileEChartsInitFn } from './lib/components/chart/mobile-chart.component';

// Navigation
export { MobileNavService, MobileTab } from './lib/navigation/mobile-nav.service';

// Types
export { FieldConfig, FieldOption, FieldType, FieldValidation, FormSchema, MobileFieldType } from './types/mobile-form-types';
export { buildMobileValidators } from './utils/mobile-form-validators';
export { EChartsInstance } from './types/echarts-types';
