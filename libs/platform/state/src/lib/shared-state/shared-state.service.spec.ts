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
import { SharedStateService } from './shared-state.service';

describe('SharedStateService', () => {
  let service: SharedStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedStateService);
  });

  describe('get()', () => {
    it('returns a signal with undefined for an unknown key', () => {
      const sig = service.get('unknown');
      expect(sig()).toBeUndefined();
    });

    it('returns the same signal reference for the same key', () => {
      const sig1 = service.get('key');
      const sig2 = service.get('key');
      expect(sig1).toBe(sig2);
    });
  });

  describe('set()', () => {
    it('stores a string value', () => {
      service.set('greeting', 'hello');
      expect(service.get<string>('greeting')()).toBe('hello');
    });

    it('stores a number value', () => {
      service.set('count', 42);
      expect(service.get<number>('count')()).toBe(42);
    });

    it('stores an object value', () => {
      const obj = { id: 1, name: 'test' };
      service.set('item', obj);
      expect(service.get<typeof obj>('item')()).toEqual(obj);
    });

    it('overwrites an existing value', () => {
      service.set('counter', 1);
      service.set('counter', 2);
      expect(service.get<number>('counter')()).toBe(2);
    });

    it('creates the signal if set before get', () => {
      service.set('early', 'value');
      expect(service.get<string>('early')()).toBe('value');
    });
  });

  describe('remove()', () => {
    it('resets the signal value to undefined', () => {
      service.set('temp', 'data');
      service.remove('temp');
      expect(service.get<string>('temp')()).toBeUndefined();
    });

    it('is a no-op for a key that does not exist', () => {
      expect(() => service.remove('nonexistent')).not.toThrow();
    });

    it('allows re-setting a key after removal', () => {
      service.set('reusable', 'first');
      service.remove('reusable');
      service.set('reusable', 'second');
      expect(service.get<string>('reusable')()).toBe('second');
    });
  });

  describe('signal reactivity', () => {
    it('get() returns a read-only signal (no direct assignment)', () => {
      const sig = service.get('reactive');
      expect(typeof sig).toBe('function');
    });

    it('signal reflects updated value after set()', () => {
      const sig = service.get<number>('live');
      service.set('live', 10);
      expect(sig()).toBe(10);
      service.set('live', 20);
      expect(sig()).toBe(20);
    });
  });
});
