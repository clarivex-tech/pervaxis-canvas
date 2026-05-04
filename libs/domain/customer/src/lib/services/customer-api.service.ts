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

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateCustomerDto,
  Customer,
  CustomerFilter,
  CustomerPage,
  UpdateCustomerDto,
} from '../models/customer.model';

const BASE = '/api/customers';

/**
 * HTTP client for the Customer resource.
 *
 * Relies on the Canvas HTTP interceptor stack (retry, timeout, error
 * normalisation) registered by `provideCanvasHttp()` in the shell.
 * Do NOT call `provideCanvasHttp` here — it is already wired at the shell
 * level and injected via Angular's DI tree.
 */
@Injectable({ providedIn: 'root' })
export class CustomerApiService {
  readonly #http = inject(HttpClient);

  /**
   * Returns a paginated list of customers, optionally filtered.
   * Maps to `GET /api/customers?search=...&status=...&page=...&pageSize=...`
   */
  list(filter?: CustomerFilter): Observable<CustomerPage> {
    let params = new HttpParams();
    if (filter?.search) params = params.set('search', filter.search);
    if (filter?.status) params = params.set('status', filter.status);
    if (filter?.industry) params = params.set('industry', filter.industry);
    if (filter?.page != null) params = params.set('page', String(filter.page));
    if (filter?.pageSize != null) params = params.set('pageSize', String(filter.pageSize));
    return this.#http.get<CustomerPage>(BASE, { params });
  }

  /**
   * Fetches a single customer by ID.
   * Maps to `GET /api/customers/:id`
   */
  getById(id: string): Observable<Customer> {
    return this.#http.get<Customer>(`${BASE}/${id}`);
  }

  /**
   * Creates a new customer.
   * Maps to `POST /api/customers`
   */
  create(dto: CreateCustomerDto): Observable<Customer> {
    return this.#http.post<Customer>(BASE, dto);
  }

  /**
   * Partially updates a customer.
   * Maps to `PATCH /api/customers/:id`
   */
  update(id: string, dto: UpdateCustomerDto): Observable<Customer> {
    return this.#http.patch<Customer>(`${BASE}/${id}`, dto);
  }

  /**
   * Deletes a customer.
   * Maps to `DELETE /api/customers/:id`
   */
  remove(id: string): Observable<void> {
    return this.#http.delete<void>(`${BASE}/${id}`);
  }
}
