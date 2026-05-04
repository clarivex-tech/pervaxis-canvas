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

/** Full customer record returned by GET /api/customers/:id. */
export interface Customer {
  /** Unique customer identifier. */
  id: string;
  /** Human-readable code (e.g. CUST-001). */
  code: string;
  /** Display name. */
  name: string;
  /** Primary contact email. */
  email: string;
  /** Contact phone number. */
  phone: string;
  /** Account status. */
  status: CustomerStatus;
  /** Business industry classification. */
  industry: string;
  /** ISO 8601 creation timestamp. */
  createdAt: string;
  /** ISO 8601 last-updated timestamp. */
  updatedAt: string;
}

/** Possible account statuses. */
export type CustomerStatus = 'active' | 'inactive' | 'suspended';

/** Lightweight projection for grid/list views. */
export interface CustomerListItem {
  id: string;
  code: string;
  name: string;
  email: string;
  status: CustomerStatus;
  industry: string;
}

/** Query parameters for the customer list endpoint. */
export interface CustomerFilter {
  search?: string;
  status?: CustomerStatus;
  industry?: string;
  page?: number;
  pageSize?: number;
}

/** Paginated response wrapper for the list endpoint. */
export interface CustomerPage {
  items: CustomerListItem[];
  total: number;
  page: number;
  pageSize: number;
}

/** Payload for creating a new customer. */
export interface CreateCustomerDto {
  code: string;
  name: string;
  email: string;
  phone: string;
  industry: string;
}

/** Partial payload for updating an existing customer. */
export interface UpdateCustomerDto {
  name?: string;
  email?: string;
  phone?: string;
  industry?: string;
  status?: CustomerStatus;
}
