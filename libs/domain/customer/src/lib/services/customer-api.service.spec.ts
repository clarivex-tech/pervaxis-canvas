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

import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { CustomerApiService } from './customer-api.service';
import { Customer, CustomerListItem, CustomerPage } from '../models/customer.model';

const MOCK_LIST_ITEM: CustomerListItem = {
  id: 'c1',
  code: 'CUST-001',
  name: 'Acme Corp',
  email: 'contact@acme.com',
  status: 'active',
  industry: 'Technology',
};

const MOCK_PAGE: CustomerPage = {
  items: [MOCK_LIST_ITEM],
  total: 1,
  page: 1,
  pageSize: 20,
};

const MOCK_CUSTOMER: Customer = {
  id: 'c1',
  code: 'CUST-001',
  name: 'Acme Corp',
  email: 'contact@acme.com',
  phone: '+1-555-0100',
  status: 'active',
  industry: 'Technology',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-02T00:00:00Z',
};

describe('CustomerApiService', () => {
  let service: CustomerApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CustomerApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  describe('list()', () => {
    it('sends GET /api/customers with no params when filter is omitted', () => {
      service.list().subscribe();
      const req = http.expectOne('/api/customers');
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_PAGE);
    });

    it('appends search param when provided', () => {
      service.list({ search: 'acme' }).subscribe();
      const req = http.expectOne(r => r.url === '/api/customers');
      expect(req.request.params.get('search')).toBe('acme');
      req.flush(MOCK_PAGE);
    });

    it('appends status and industry params when provided', () => {
      service.list({ status: 'active', industry: 'Technology' }).subscribe();
      const req = http.expectOne(r => r.url === '/api/customers');
      expect(req.request.params.get('status')).toBe('active');
      expect(req.request.params.get('industry')).toBe('Technology');
      req.flush(MOCK_PAGE);
    });

    it('appends pagination params when provided', () => {
      service.list({ page: 2, pageSize: 10 }).subscribe();
      const req = http.expectOne(r => r.url === '/api/customers');
      expect(req.request.params.get('page')).toBe('2');
      expect(req.request.params.get('pageSize')).toBe('10');
      req.flush(MOCK_PAGE);
    });

    it('returns the CustomerPage response', (done) => {
      service.list().subscribe(result => {
        expect(result).toEqual(MOCK_PAGE);
        done();
      });
      http.expectOne('/api/customers').flush(MOCK_PAGE);
    });
  });

  describe('getById()', () => {
    it('sends GET /api/customers/:id', () => {
      service.getById('c1').subscribe();
      const req = http.expectOne('/api/customers/c1');
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_CUSTOMER);
    });

    it('returns the Customer response', (done) => {
      service.getById('c1').subscribe(result => {
        expect(result).toEqual(MOCK_CUSTOMER);
        done();
      });
      http.expectOne('/api/customers/c1').flush(MOCK_CUSTOMER);
    });
  });

  describe('create()', () => {
    it('sends POST /api/customers with the dto', () => {
      const dto = { code: 'CUST-002', name: 'Beta Inc', email: 'beta@test.com', phone: '555-0200', industry: 'Finance' };
      service.create(dto).subscribe();
      const req = http.expectOne('/api/customers');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush(MOCK_CUSTOMER);
    });
  });

  describe('update()', () => {
    it('sends PATCH /api/customers/:id with the dto', () => {
      const dto = { name: 'Acme Updated' };
      service.update('c1', dto).subscribe();
      const req = http.expectOne('/api/customers/c1');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(dto);
      req.flush(MOCK_CUSTOMER);
    });
  });

  describe('remove()', () => {
    it('sends DELETE /api/customers/:id', () => {
      service.remove('c1').subscribe();
      const req = http.expectOne('/api/customers/c1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
