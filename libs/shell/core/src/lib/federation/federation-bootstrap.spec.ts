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

import { MfeManifest } from '@pervaxis/canvas-mfe-contracts';
import { buildFederationManifest } from './federation-bootstrap';

const MANIFESTS: MfeManifest[] = [
  {
    name: 'orders-mfe',
    remoteEntry: 'https://orders.example.com/remoteEntry.json',
    exposedModule: './Module',
    routePath: 'orders',
  },
  {
    name: 'inventory-mfe',
    remoteEntry: 'https://inventory.example.com/remoteEntry.json',
    exposedModule: './Module',
    routePath: 'inventory',
    permissions: ['inventory:read'],
  },
];

describe('buildFederationManifest', () => {
  it('returns a record keyed by manifest name', () => {
    const result = buildFederationManifest(MANIFESTS);
    expect(Object.keys(result)).toEqual(['orders-mfe', 'inventory-mfe']);
  });

  it('maps each name to its remoteEntry URL', () => {
    const result = buildFederationManifest(MANIFESTS);
    expect(result['orders-mfe']).toBe('https://orders.example.com/remoteEntry.json');
    expect(result['inventory-mfe']).toBe('https://inventory.example.com/remoteEntry.json');
  });

  it('returns an empty object for an empty manifest array', () => {
    expect(buildFederationManifest([])).toEqual({});
  });

  it('last entry wins when duplicate names exist', () => {
    const dupes: MfeManifest[] = [
      { name: 'orders-mfe', remoteEntry: 'https://v1.example.com', exposedModule: './Module', routePath: 'orders' },
      { name: 'orders-mfe', remoteEntry: 'https://v2.example.com', exposedModule: './Module', routePath: 'orders' },
    ];
    const result = buildFederationManifest(dupes);
    expect(result['orders-mfe']).toBe('https://v2.example.com');
  });

  it('does not include extra manifest fields in the output', () => {
    const result = buildFederationManifest(MANIFESTS);
    const values = Object.values(result);
    values.forEach((v) => expect(typeof v).toBe('string'));
  });
});
