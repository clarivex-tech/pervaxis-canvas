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

import { Provider } from '@angular/core';
import { Observable, Subject, filter } from 'rxjs';
import { CanvasEvent, EventBus, CANVAS_EVENT_BUS } from '@pervaxis/canvas-mfe-contracts';

/**
 * In-memory implementation of `EventBus` for use in tests.
 * Exposes `publishedEvents` for assertion and supports `on()` subscriptions
 * using an RxJS `Subject` — no vitest/jest spies required.
 */
export interface MockEventBus extends EventBus {
  /** All events published during the test, in emission order. */
  publishedEvents: CanvasEvent<unknown>[];
}

/**
 * Creates and provides a `MockEventBus` bound to `CANVAS_EVENT_BUS`.
 *
 * Retrieve the mock inside tests via `TestBed.inject(CANVAS_EVENT_BUS)` cast
 * to `MockEventBus` to inspect `publishedEvents`.
 *
 * @example
 * TestBed.configureTestingModule({
 *   providers: [mockCanvasEventBus()],
 * });
 * const bus = TestBed.inject(CANVAS_EVENT_BUS) as MockEventBus;
 * expect(bus.publishedEvents).toHaveLength(1);
 */
export function mockCanvasEventBus(): Provider {
  const events$ = new Subject<CanvasEvent<unknown>>();
  const publishedEvents: CanvasEvent<unknown>[] = [];

  const bus: MockEventBus = {
    publishedEvents,
    publish<T>(event: CanvasEvent<T>): void {
      publishedEvents.push(event as CanvasEvent<unknown>);
      events$.next(event as CanvasEvent<unknown>);
    },
    on<T>(type: string): Observable<CanvasEvent<T>> {
      return events$.pipe(
        filter((e) => e.type === type)
      ) as unknown as Observable<CanvasEvent<T>>;
    },
  };

  return { provide: CANVAS_EVENT_BUS, useValue: bus };
}
