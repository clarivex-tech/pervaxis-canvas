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

// Domain models
export type {
  Customer,
  CustomerListItem,
  CustomerFilter,
  CustomerPage,
  CustomerStatus,
  CreateCustomerDto,
  UpdateCustomerDto,
} from './lib/models/customer.model';

// API service
export { CustomerApiService } from './lib/services/customer-api.service';

// NgRx Signals store
export { CustomerStore } from './lib/state/customer.store';
export type { CustomerStoreType } from './lib/state/customer.store';

// Pages
export { CustomerListPage } from './lib/pages/customer-list/customer-list.page';
export { CustomerDetailPage } from './lib/pages/customer-detail/customer-detail.page';
export { CustomerFormPage } from './lib/pages/customer-form/customer-form.page';

// Routes
export { CUSTOMER_ROUTES } from './lib/routes/customer.routes';
