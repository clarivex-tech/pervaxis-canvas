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

import { Component, inject, Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthContext, CANVAS_AUTH_CONTEXT, CANVAS_EVENT_BUS, CANVAS_SHARED_STATE } from '@pervaxis/canvas-mfe-contracts';
import { MfeTestHarness } from './mfe-test-harness';
import { MockEventBus } from '../mocks/mock-event-bus.provider';

@Component({
  standalone: true,
  selector: 'lib-test-mfe',
  template: '<span>{{ title }}</span>',
})
class TestMfeComponent {
  readonly #auth = inject(CANVAS_AUTH_CONTEXT, { optional: true }) as Signal<AuthContext | null> | null;
  readonly title = 'Test MFE';
  get userId(): string { return this.#auth?.()?.userId ?? ''; }
}

describe('MfeTestHarness', () => {
  describe('create() with default config', () => {
    let harness: MfeTestHarness<TestMfeComponent>;

    beforeEach(async () => {
      harness = await MfeTestHarness.create(TestMfeComponent);
    });

    it('creates a fixture for the component', () => {
      expect(harness.fixture).toBeTruthy();
    });

    it('exposes the component instance', () => {
      expect(harness.component).toBeInstanceOf(TestMfeComponent);
    });

    it('exposes the nativeElement', () => {
      expect(harness.nativeElement).toBeInstanceOf(HTMLElement);
    });

    it('exposes a mock event bus', () => {
      expect(harness.eventBus).toBeDefined();
      expect(harness.eventBus.publishedEvents).toEqual([]);
    });

    it('resolvedAuthContext is null for unauthenticated config', () => {
      expect(harness.resolvedAuthContext).toBeNull();
    });

    it('CANVAS_AUTH_CONTEXT signal returns null', () => {
      const ctx = TestBed.inject(CANVAS_AUTH_CONTEXT) as Signal<AuthContext | null>;
      expect(ctx()).toBeNull();
    });

    it('CANVAS_SHARED_STATE is null', () => {
      expect(TestBed.inject(CANVAS_SHARED_STATE)).toBeNull();
    });
  });

  describe('create() with authenticated user', () => {
    let harness: MfeTestHarness<TestMfeComponent>;

    beforeEach(async () => {
      harness = await MfeTestHarness.create(TestMfeComponent, {
        authContext: { userId: 'u-123', roles: ['admin'] },
      });
    });

    it('resolvedAuthContext contains the merged context', () => {
      expect(harness.resolvedAuthContext?.userId).toBe('u-123');
      expect(harness.resolvedAuthContext?.roles).toEqual(['admin']);
    });

    it('CANVAS_AUTH_CONTEXT signal returns the populated context', () => {
      const ctx = TestBed.inject(CANVAS_AUTH_CONTEXT) as Signal<AuthContext | null>;
      expect(ctx()?.userId).toBe('u-123');
    });

    it('component can read userId via CANVAS_AUTH_CONTEXT', () => {
      expect(harness.component.userId).toBe('u-123');
    });
  });

  describe('create() with custom sharedState', () => {
    beforeEach(async () => {
      await MfeTestHarness.create(TestMfeComponent, {
        sharedState: { theme: 'dark' },
      });
    });

    it('CANVAS_SHARED_STATE reflects the provided state', () => {
      expect(TestBed.inject(CANVAS_SHARED_STATE)).toEqual({ theme: 'dark' });
    });
  });

  describe('create() with extra providers', () => {
    class FakeService { value = 42; }

    beforeEach(async () => {
      await MfeTestHarness.create(TestMfeComponent, {
        providers: [FakeService],
      });
    });

    it('injects additional providers', () => {
      expect(TestBed.inject(FakeService).value).toBe(42);
    });
  });

  describe('event bus interaction', () => {
    let harness: MfeTestHarness<TestMfeComponent>;

    beforeEach(async () => {
      harness = await MfeTestHarness.create(TestMfeComponent);
    });

    it('event bus mock is accessible via CANVAS_EVENT_BUS', () => {
      const bus = TestBed.inject(CANVAS_EVENT_BUS) as MockEventBus;
      expect(bus).toBe(harness.eventBus);
    });

    it('publishedEvents accumulates after publish()', () => {
      harness.eventBus.publish({ type: 'nav', payload: '/home', source: 'test', timestamp: 1 });
      expect(harness.eventBus.publishedEvents).toHaveLength(1);
    });
  });

  describe('detectChanges()', () => {
    it('does not throw when called after creation', async () => {
      const harness = await MfeTestHarness.create(TestMfeComponent);
      expect(() => harness.detectChanges()).not.toThrow();
    });
  });
});
