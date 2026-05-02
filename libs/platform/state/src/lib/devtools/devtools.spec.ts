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
import { patchState, signalStore, withState } from '@ngrx/signals';
import { withCanvasDevTools } from './devtools';

describe('withCanvasDevTools()', () => {
  afterEach(() => {
    delete (globalThis as Record<string, unknown>)['__REDUX_DEVTOOLS_EXTENSION__'];
  });

  it('does not throw when DevTools extension is absent', () => {
    const TestStore = signalStore(
      { providedIn: 'root' },
      withState({ count: 0 }),
      withCanvasDevTools('TestStore')
    );

    expect(() => {
      TestBed.configureTestingModule({ providers: [TestStore] });
      TestBed.inject(TestStore);
    }).not.toThrow();
  });

  it('calls init with current state when extension is present', () => {
    const initSpy = vi.fn();
    const sendSpy = vi.fn();
    const connectSpy = vi.fn(() => ({ init: initSpy, send: sendSpy }));

    (globalThis as Record<string, unknown>)['__REDUX_DEVTOOLS_EXTENSION__'] = {
      connect: connectSpy,
    };

    const TestStore = signalStore(
      withState({ value: 'initial' }),
      withCanvasDevTools('MyStore')
    );

    TestBed.configureTestingModule({ providers: [TestStore] });
    TestBed.inject(TestStore);

    expect(connectSpy).toHaveBeenCalledWith({ name: 'MyStore' });
    expect(initSpy).toHaveBeenCalledWith({ value: 'initial' });
  });

  it('sends updates when state changes', () => {
    const sendSpy = vi.fn();
    (globalThis as Record<string, unknown>)['__REDUX_DEVTOOLS_EXTENSION__'] = {
      connect: () => ({ init: vi.fn(), send: sendSpy }),
    };

    const TestStore = signalStore(
      withState({ count: 0 }),
      withCanvasDevTools('CountStore')
    );

    TestBed.configureTestingModule({ providers: [TestStore] });
    const store = TestBed.inject(TestStore);

    patchState(store, { count: 5 });
    TestBed.flushEffects();

    expect(sendSpy).toHaveBeenCalledWith(
      { type: '[CountStore] Update' },
      { count: 5 }
    );
  });
});
