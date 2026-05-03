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

import { ApplicationRef, Component } from '@angular/core';
import { bootstrapMfe } from './mfe-bootstrap';

vi.mock('@angular/platform-browser', () => ({
  bootstrapApplication: vi.fn(),
}));

describe('bootstrapMfe', () => {
  @Component({ standalone: true, selector: 'lib-test-root', template: '' })
  class TestRootComponent {}

  let mockBootstrap: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    const pb = await import('@angular/platform-browser');
    mockBootstrap = pb.bootstrapApplication as ReturnType<typeof vi.fn>;
    mockBootstrap.mockResolvedValue({} as ApplicationRef);
  });

  afterEach(() => mockBootstrap.mockReset());

  it('returns a factory function', () => {
    expect(typeof bootstrapMfe(TestRootComponent)).toBe('function');
  });

  it('factory calls bootstrapApplication with the component and no config', async () => {
    await bootstrapMfe(TestRootComponent)();
    expect(mockBootstrap).toHaveBeenCalledWith(TestRootComponent, undefined);
  });

  it('factory passes appConfig to bootstrapApplication', async () => {
    const config = { providers: [] };
    await bootstrapMfe(TestRootComponent, config)();
    expect(mockBootstrap).toHaveBeenCalledWith(TestRootComponent, config);
  });

  it('factory returns the ApplicationRef from bootstrapApplication', async () => {
    const mockRef = { destroy: vi.fn() } as unknown as ApplicationRef;
    mockBootstrap.mockResolvedValue(mockRef);
    const result = await bootstrapMfe(TestRootComponent)();
    expect(result).toBe(mockRef);
  });
});
