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

import { buildRemoteEntryConfig } from './remote-config.factory';

describe('buildRemoteEntryConfig', () => {
  it('returns an object with the provided name', () => {
    const config = buildRemoteEntryConfig('orders-mfe', {});
    expect(config.name).toBe('orders-mfe');
  });

  it('returns an object with the provided exposes map', () => {
    const exposes = { './Component': './src/app/app.component.ts' };
    const config = buildRemoteEntryConfig('orders-mfe', exposes);
    expect(config.exposes).toEqual(exposes);
  });

  it('preserves multiple expose entries', () => {
    const exposes = {
      './Module': './src/app/app.module.ts',
      './Component': './src/app/app.component.ts',
    };
    const config = buildRemoteEntryConfig('my-mfe', exposes);
    expect(Object.keys(config.exposes)).toHaveLength(2);
  });

  it('returns a plain object matching the input exactly', () => {
    const config = buildRemoteEntryConfig('test-mfe', { './A': './src/a.ts' });
    expect(config).toEqual({ name: 'test-mfe', exposes: { './A': './src/a.ts' } });
  });

  it('handles an empty exposes map', () => {
    const config = buildRemoteEntryConfig('empty-mfe', {});
    expect(config.exposes).toEqual({});
  });
});
