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

import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { CustomerApiService } from '../services/customer-api.service';
import {
  CreateCustomerDto,
  Customer,
  CustomerFilter,
  CustomerListItem,
  UpdateCustomerDto,
} from '../models/customer.model';

/** Shape of the customer slice of NgRx Signals state. */
interface CustomerState {
  customers: CustomerListItem[];
  selected: Customer | null;
  loading: boolean;
  error: string | null;
  total: number;
  filter: CustomerFilter;
}

const initialState: CustomerState = {
  customers: [],
  selected: null,
  loading: false,
  error: null,
  total: 0,
  filter: { page: 1, pageSize: 20 },
};

/**
 * Domain store for the Customer resource.
 *
 * Wraps `CustomerApiService` with NgRx Signals state management.
 * Exposes typed signals for reactive binding in page components and
 * async action methods that update `loading`/`error` around every HTTP call.
 *
 * @example
 * ```typescript
 * // Inject in a component
 * private readonly store = inject(CustomerStore);
 *
 * ngOnInit(): void {
 *   void this.store.loadAll();
 * }
 * ```
 */
export const CustomerStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ customers, total, filter }) => ({
    /** `true` when the list contains at least one customer. */
    hasCustomers: computed(() => customers().length > 0),
    /** Total number of pages based on current filter's pageSize. */
    pageCount: computed(() => Math.ceil(total() / (filter().pageSize ?? 20))),
  })),
  withMethods((store, api = inject(CustomerApiService)) => ({
    /**
     * Loads the paginated customer list.
     * Merges the provided filter with the current store filter when omitted.
     */
    async loadAll(filter?: CustomerFilter): Promise<void> {
      patchState(store, { loading: true, error: null });
      try {
        const resolved = filter ?? store.filter();
        const result = await firstValueFrom(api.list(resolved));
        patchState(store, {
          customers: result.items,
          total: result.total,
          filter: resolved,
          loading: false,
        });
      } catch (err) {
        patchState(store, { loading: false, error: String(err) });
      }
    },

    /** Fetches and caches a single customer into `selected`. */
    async select(id: string): Promise<void> {
      patchState(store, { loading: true, error: null, selected: null });
      try {
        const customer = await firstValueFrom(api.getById(id));
        patchState(store, { selected: customer, loading: false });
      } catch (err) {
        patchState(store, { loading: false, error: String(err) });
      }
    },

    /** Creates a new customer and returns the server response. */
    async create(dto: CreateCustomerDto): Promise<Customer> {
      patchState(store, { loading: true, error: null });
      try {
        const customer = await firstValueFrom(api.create(dto));
        patchState(store, { loading: false });
        return customer;
      } catch (err) {
        patchState(store, { loading: false, error: String(err) });
        throw err;
      }
    },

    /**
     * Updates a customer and merges the changes into the cached list.
     * Returns the full server response.
     */
    async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
      patchState(store, { loading: true, error: null });
      try {
        const customer = await firstValueFrom(api.update(id, dto));
        patchState(store, {
          loading: false,
          customers: store.customers().map(c =>
            c.id === id ? { ...c, ...dto } : c
          ),
        });
        return customer;
      } catch (err) {
        patchState(store, { loading: false, error: String(err) });
        throw err;
      }
    },

    /** Deletes a customer and removes it from the cached list. */
    async remove(id: string): Promise<void> {
      patchState(store, { loading: true, error: null });
      try {
        await firstValueFrom(api.remove(id));
        patchState(store, {
          loading: false,
          customers: store.customers().filter(c => c.id !== id),
          total: store.total() - 1,
        });
      } catch (err) {
        patchState(store, { loading: false, error: String(err) });
        throw err;
      }
    },
  }))
);

/** Inferred type of the CustomerStore instance. */
export type CustomerStoreType = InstanceType<typeof CustomerStore>;
