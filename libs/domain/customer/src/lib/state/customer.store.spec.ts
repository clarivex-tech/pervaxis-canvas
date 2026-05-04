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

import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CustomerApiService } from '../services/customer-api.service';
import { CustomerStore } from './customer.store';
import { Customer, CustomerListItem, CustomerPage } from '../models/customer.model';

const MOCK_ITEM: CustomerListItem = {
  id: 'c1',
  code: 'CUST-001',
  name: 'Acme Corp',
  email: 'acme@test.com',
  status: 'active',
  industry: 'Technology',
};

const MOCK_PAGE: CustomerPage = {
  items: [MOCK_ITEM],
  total: 1,
  page: 1,
  pageSize: 20,
};

const MOCK_CUSTOMER: Customer = {
  id: 'c1',
  code: 'CUST-001',
  name: 'Acme Corp',
  email: 'acme@test.com',
  phone: '+1-555-0100',
  status: 'active',
  industry: 'Technology',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-02T00:00:00Z',
};

function createMockApi() {
  return {
    list: vi.fn().mockReturnValue(of(MOCK_PAGE)),
    getById: vi.fn().mockReturnValue(of(MOCK_CUSTOMER)),
    create: vi.fn().mockReturnValue(of(MOCK_CUSTOMER)),
    update: vi.fn().mockReturnValue(of(MOCK_CUSTOMER)),
    remove: vi.fn().mockReturnValue(of(undefined)),
  };
}

describe('CustomerStore', () => {
  let store: InstanceType<typeof CustomerStore>;
  let mockApi: ReturnType<typeof createMockApi>;

  beforeEach(() => {
    mockApi = createMockApi();
    TestBed.configureTestingModule({
      providers: [
        CustomerStore,
        { provide: CustomerApiService, useValue: mockApi },
      ],
    });
    store = TestBed.inject(CustomerStore);
  });

  it('initialises with empty state', () => {
    expect(store.customers()).toEqual([]);
    expect(store.selected()).toBeNull();
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.total()).toBe(0);
    expect(store.hasCustomers()).toBe(false);
  });

  describe('loadAll()', () => {
    it('sets loading then populates customers on success', async () => {
      await store.loadAll();
      expect(mockApi.list).toHaveBeenCalledOnce();
      expect(store.customers()).toEqual([MOCK_ITEM]);
      expect(store.total()).toBe(1);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
      expect(store.hasCustomers()).toBe(true);
    });

    it('passes the provided filter to the API', async () => {
      await store.loadAll({ search: 'acme', page: 2 });
      expect(mockApi.list).toHaveBeenCalledWith({ search: 'acme', page: 2 });
    });

    it('sets error and clears loading on failure', async () => {
      mockApi.list.mockReturnValueOnce(throwError(() => new Error('Network error')));
      await store.loadAll();
      expect(store.loading()).toBe(false);
      expect(store.error()).toContain('Network error');
      expect(store.customers()).toEqual([]);
    });
  });

  describe('select()', () => {
    it('loads and caches the customer into selected', async () => {
      await store.select('c1');
      expect(mockApi.getById).toHaveBeenCalledWith('c1');
      expect(store.selected()).toEqual(MOCK_CUSTOMER);
      expect(store.loading()).toBe(false);
    });

    it('clears selected and sets error on failure', async () => {
      mockApi.getById.mockReturnValueOnce(throwError(() => new Error('Not found')));
      await store.select('c1');
      expect(store.selected()).toBeNull();
      expect(store.error()).toContain('Not found');
    });
  });

  describe('create()', () => {
    it('calls API and returns the created customer', async () => {
      const dto = { code: 'CUST-002', name: 'Beta Inc', email: 'b@test.com', phone: '555', industry: 'Finance' };
      const result = await store.create(dto);
      expect(mockApi.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(MOCK_CUSTOMER);
      expect(store.loading()).toBe(false);
    });

    it('propagates error on failure', async () => {
      mockApi.create.mockReturnValueOnce(throwError(() => new Error('Conflict')));
      await expect(store.create({ code: 'X', name: 'X', email: 'x@x.com', phone: '0', industry: 'Other' }))
        .rejects.toThrow('Conflict');
      expect(store.error()).toContain('Conflict');
    });
  });

  describe('update()', () => {
    it('merges changes into the cached list', async () => {
      await store.loadAll();
      await store.update('c1', { name: 'Acme Updated' });
      const updated = store.customers().find(c => c.id === 'c1');
      expect(updated?.name).toBe('Acme Updated');
      expect(store.loading()).toBe(false);
    });

    it('propagates error on failure', async () => {
      mockApi.update.mockReturnValueOnce(throwError(() => new Error('Forbidden')));
      await expect(store.update('c1', { name: 'X' })).rejects.toThrow('Forbidden');
    });
  });

  describe('remove()', () => {
    it('removes the customer from the cached list', async () => {
      await store.loadAll();
      expect(store.customers()).toHaveLength(1);
      await store.remove('c1');
      expect(store.customers()).toHaveLength(0);
      expect(store.total()).toBe(0);
      expect(store.loading()).toBe(false);
    });

    it('propagates error on failure', async () => {
      mockApi.remove.mockReturnValueOnce(throwError(() => new Error('Forbidden')));
      await expect(store.remove('c1')).rejects.toThrow('Forbidden');
    });
  });

  describe('pageCount()', () => {
    it('computes correct page count', async () => {
      mockApi.list.mockReturnValueOnce(of({ items: [], total: 45, page: 1, pageSize: 20 }));
      await store.loadAll({ page: 1, pageSize: 20 });
      expect(store.pageCount()).toBe(3);
    });
  });
});
