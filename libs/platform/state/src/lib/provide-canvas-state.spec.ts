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
import { CANVAS_SHARED_STATE } from '@pervaxis/canvas-mfe-contracts';
import { SharedStateService } from './shared-state/shared-state.service';
import { provideCanvasState } from './provide-canvas-state';

describe('provideCanvasState()', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideCanvasState()],
    });
  });

  it('provides SharedStateService', () => {
    const service = TestBed.inject(SharedStateService);
    expect(service).toBeTruthy();
  });

  it('binds CANVAS_SHARED_STATE to SharedStateService', () => {
    const fromToken = TestBed.inject(CANVAS_SHARED_STATE) as SharedStateService;
    const direct = TestBed.inject(SharedStateService);
    expect(fromToken).toBe(direct);
  });

  it('CANVAS_SHARED_STATE can get and set values', () => {
    const state = TestBed.inject(CANVAS_SHARED_STATE) as SharedStateService;
    state.set('test-key', 'test-value');
    expect(state.get<string>('test-key')()).toBe('test-value');
  });
});
