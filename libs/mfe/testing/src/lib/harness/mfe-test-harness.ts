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

import { Provider, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthContext, CANVAS_EVENT_BUS } from '@pervaxis/canvas-mfe-contracts';
import { createMockAuthContext, mockCanvasAuthContext } from '../mocks/mock-auth-context.provider';
import { MockEventBus, mockCanvasEventBus } from '../mocks/mock-event-bus.provider';
import { mockCanvasSharedState } from '../mocks/mock-shared-state.provider';

/** Configuration for `MfeTestHarness.create()`. */
export interface MfeTestConfig {
  /**
   * Auth context for the test.
   * Pass `null` (default) for unauthenticated, or a partial `AuthContext`
   * to simulate an authenticated user.
   */
  authContext?: Partial<AuthContext> | null;
  /** Shared state value to bind to `CANVAS_SHARED_STATE`. Defaults to `null`. */
  sharedState?: unknown;
  /** Additional providers to register alongside the Canvas mock providers. */
  providers?: Provider[];
}

/**
 * Test harness that mounts an MFE standalone component in isolation with
 * all Canvas shell context tokens pre-configured as mocks.
 *
 * Automatically registers:
 * - `CANVAS_AUTH_CONTEXT` — via `mockCanvasAuthContext(config.authContext)`
 * - `CANVAS_EVENT_BUS` — via `mockCanvasEventBus()`
 * - `CANVAS_SHARED_STATE` — via `mockCanvasSharedState(config.sharedState)`
 *
 * @example
 * const harness = await MfeTestHarness.create(OrdersComponent, {
 *   authContext: { roles: ['admin'], permissions: ['orders:write'] },
 * });
 * expect(harness.component.canEdit()).toBe(true);
 * harness.detectChanges();
 */
export class MfeTestHarness<T> {
  /** The Angular `ComponentFixture` for the mounted component. */
  readonly fixture: ComponentFixture<T>;

  /** The component instance under test. */
  readonly component: T;

  /** The mock event bus — inspect `publishedEvents` to assert emitted events. */
  readonly eventBus: MockEventBus;

  /** Resolved mock auth context, or `null` when unauthenticated. */
  readonly resolvedAuthContext: AuthContext | null;

  private constructor(
    fixture: ComponentFixture<T>,
    eventBus: MockEventBus,
    resolvedAuthContext: AuthContext | null
  ) {
    this.fixture = fixture;
    this.component = fixture.componentInstance;
    this.eventBus = eventBus;
    this.resolvedAuthContext = resolvedAuthContext;
  }

  /**
   * Creates the harness: configures `TestBed`, compiles the component, and
   * runs the initial change detection cycle.
   *
   * @param component - The standalone Angular component to mount.
   * @param config    - Optional harness configuration (auth context, providers, etc.).
   */
  static async create<T>(
    component: Type<T>,
    config: MfeTestConfig = {}
  ): Promise<MfeTestHarness<T>> {
    const resolved =
      config.authContext === null || config.authContext === undefined
        ? null
        : createMockAuthContext(config.authContext);

    await TestBed.configureTestingModule({
      imports: [component],
      providers: [
        mockCanvasAuthContext(config.authContext ?? null),
        mockCanvasEventBus(),
        mockCanvasSharedState(config.sharedState ?? null),
        ...(config.providers ?? []),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(component);
    fixture.detectChanges();

    const eventBus = TestBed.inject(CANVAS_EVENT_BUS) as MockEventBus;
    return new MfeTestHarness(fixture, eventBus, resolved);
  }

  /** Triggers Angular change detection on the component fixture. */
  detectChanges(): void {
    this.fixture.detectChanges();
  }

  /** Returns the native DOM element of the component's host element. */
  get nativeElement(): HTMLElement {
    return this.fixture.nativeElement as HTMLElement;
  }
}
