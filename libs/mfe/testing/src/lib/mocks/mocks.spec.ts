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
import { Signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthContext, CANVAS_AUTH_CONTEXT, CANVAS_EVENT_BUS, CANVAS_SHARED_STATE, CanvasEvent } from '@pervaxis/canvas-mfe-contracts';
import { createMockAuthContext, mockCanvasAuthContext } from './mock-auth-context.provider';
import { MockEventBus, mockCanvasEventBus } from './mock-event-bus.provider';
import { mockCanvasSharedState } from './mock-shared-state.provider';

describe('createMockAuthContext', () => {
  it('returns an AuthContext with defaults', () => {
    const ctx = createMockAuthContext();
    expect(ctx.userId).toBe('test-user-id');
    expect(ctx.email).toBe('test@example.com');
    expect(ctx.roles).toEqual(['viewer']);
    expect(ctx.permissions).toEqual([]);
    expect(ctx.token).toBe('mock-jwt-token');
  });

  it('merges overrides over defaults', () => {
    const ctx = createMockAuthContext({ userId: 'u-999', roles: ['admin'] });
    expect(ctx.userId).toBe('u-999');
    expect(ctx.roles).toEqual(['admin']);
    expect(ctx.email).toBe('test@example.com');
  });
});

describe('mockCanvasAuthContext', () => {
  describe('with null (unauthenticated)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [mockCanvasAuthContext(null)],
      });
    });

    it('provides CANVAS_AUTH_CONTEXT as a null signal', () => {
      const ctxSignal = TestBed.inject(CANVAS_AUTH_CONTEXT) as Signal<AuthContext | null>;
      expect(ctxSignal()).toBeNull();
    });
  });

  describe('with partial auth context', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [mockCanvasAuthContext({ userId: 'u-42', roles: ['admin'] })],
      });
    });

    it('provides CANVAS_AUTH_CONTEXT with merged defaults', () => {
      const ctxSignal = TestBed.inject(CANVAS_AUTH_CONTEXT) as Signal<AuthContext | null>;
      const ctx = ctxSignal();
      expect(ctx?.userId).toBe('u-42');
      expect(ctx?.roles).toEqual(['admin']);
      expect(ctx?.email).toBe('test@example.com');
    });
  });

  describe('default (no argument)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [mockCanvasAuthContext()],
      });
    });

    it('defaults to null context', () => {
      const ctxSignal = TestBed.inject(CANVAS_AUTH_CONTEXT) as Signal<AuthContext | null>;
      expect(ctxSignal()).toBeNull();
    });
  });
});

describe('mockCanvasEventBus', () => {
  let bus: MockEventBus;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [mockCanvasEventBus()],
    });
    bus = TestBed.inject(CANVAS_EVENT_BUS) as MockEventBus;
  });

  it('provides CANVAS_EVENT_BUS', () => {
    expect(bus).toBeDefined();
  });

  it('publishedEvents starts empty', () => {
    expect(bus.publishedEvents).toHaveLength(0);
  });

  it('publish() records the event in publishedEvents', () => {
    const event: CanvasEvent<string> = { type: 'test', payload: 'hello', source: 'test', timestamp: Date.now() };
    bus.publish(event);
    expect(bus.publishedEvents).toHaveLength(1);
    expect(bus.publishedEvents[0]).toEqual(event);
  });

  it('on() receives events matching the type', async () => {
    const event: CanvasEvent<number> = { type: 'counter', payload: 42, source: 'test', timestamp: Date.now() };
    const received$ = bus.on<number>('counter');
    const promise = firstValueFrom(received$);
    bus.publish(event);
    const received = await promise;
    expect(received.payload).toBe(42);
  });

  it('on() does not receive events of a different type', async () => {
    let received = false;
    bus.on('other-type').subscribe(() => { received = true; });
    bus.publish({ type: 'counter', payload: 1, source: 'test', timestamp: Date.now() });
    expect(received).toBe(false);
  });

  it('multiple publish() calls accumulate in publishedEvents', () => {
    bus.publish({ type: 'a', payload: 1, source: 'x', timestamp: 1 });
    bus.publish({ type: 'b', payload: 2, source: 'x', timestamp: 2 });
    expect(bus.publishedEvents).toHaveLength(2);
  });
});

describe('mockCanvasSharedState', () => {
  describe('with default (null)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [mockCanvasSharedState()],
      });
    });

    it('provides CANVAS_SHARED_STATE as null', () => {
      expect(TestBed.inject(CANVAS_SHARED_STATE)).toBeNull();
    });
  });

  describe('with a custom state object', () => {
    const state = { theme: 'dark', locale: 'en' };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [mockCanvasSharedState(state)],
      });
    });

    it('provides CANVAS_SHARED_STATE as the given value', () => {
      expect(TestBed.inject(CANVAS_SHARED_STATE)).toEqual(state);
    });
  });
});
