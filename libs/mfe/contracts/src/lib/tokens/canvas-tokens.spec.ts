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
import { InjectionToken } from '@angular/core';
import { CANVAS_AUTH_CONTEXT, CANVAS_EVENT_BUS, CANVAS_SHARED_STATE } from './canvas-tokens';

describe('Canvas InjectionTokens', () => {
  it('CANVAS_AUTH_CONTEXT is an InjectionToken', () => {
    expect(CANVAS_AUTH_CONTEXT).toBeInstanceOf(InjectionToken);
  });

  it('CANVAS_AUTH_CONTEXT has correct description', () => {
    expect(CANVAS_AUTH_CONTEXT.toString()).toContain('CANVAS_AUTH_CONTEXT');
  });

  it('CANVAS_EVENT_BUS is an InjectionToken', () => {
    expect(CANVAS_EVENT_BUS).toBeInstanceOf(InjectionToken);
  });

  it('CANVAS_EVENT_BUS has correct description', () => {
    expect(CANVAS_EVENT_BUS.toString()).toContain('CANVAS_EVENT_BUS');
  });

  it('CANVAS_SHARED_STATE is an InjectionToken', () => {
    expect(CANVAS_SHARED_STATE).toBeInstanceOf(InjectionToken);
  });

  it('CANVAS_SHARED_STATE has correct description', () => {
    expect(CANVAS_SHARED_STATE.toString()).toContain('CANVAS_SHARED_STATE');
  });
});
