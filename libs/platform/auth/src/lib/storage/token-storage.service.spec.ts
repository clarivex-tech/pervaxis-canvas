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
import { vi, describe, it, expect, beforeEach } from 'vitest';
import {
  CANVAS_TOKEN_STORAGE,
  CanvasTokenStorage,
  provideCapacitorTokenStorage,
} from './token-storage.service';

const mockIsNative = vi.fn().mockReturnValue(false);
const mockPreferencesGet = vi.fn().mockResolvedValue({ value: null });
const mockPreferencesSet = vi.fn().mockResolvedValue(undefined);
const mockPreferencesRemove = vi.fn().mockResolvedValue(undefined);

vi.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: () => mockIsNative() },
}));
vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: (opts: { key: string }) => mockPreferencesGet(opts),
    set: (opts: { key: string; value: string }) => mockPreferencesSet(opts),
    remove: (opts: { key: string }) => mockPreferencesRemove(opts),
  },
}));

describe('CANVAS_TOKEN_STORAGE (web)', () => {
  let storage: CanvasTokenStorage;

  beforeEach(() => {
    mockIsNative.mockReturnValue(false);
    sessionStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    storage = TestBed.inject(CANVAS_TOKEN_STORAGE);
  });

  it('stores and retrieves a value via sessionStorage', async () => {
    await storage.setItem('token', 'abc123');
    expect(await storage.getItem('token')).toBe('abc123');
  });

  it('returns null for a missing key', async () => {
    expect(await storage.getItem('missing')).toBeNull();
  });

  it('removes an item', async () => {
    await storage.setItem('token', 'abc123');
    await storage.removeItem('token');
    expect(await storage.getItem('token')).toBeNull();
  });
});

describe('CANVAS_TOKEN_STORAGE (capacitor)', () => {
  let storage: CanvasTokenStorage;

  beforeEach(() => {
    mockIsNative.mockReturnValue(true);
    mockPreferencesGet.mockResolvedValue({ value: 'native-token' });
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideCapacitorTokenStorage()],
    });
    storage = TestBed.inject(CANVAS_TOKEN_STORAGE);
  });

  it('reads from Capacitor Preferences', async () => {
    const val = await storage.getItem('token');
    expect(mockPreferencesGet).toHaveBeenCalledWith({ key: 'token' });
    expect(val).toBe('native-token');
  });

  it('writes to Capacitor Preferences', async () => {
    await storage.setItem('token', 'xyz');
    expect(mockPreferencesSet).toHaveBeenCalledWith({ key: 'token', value: 'xyz' });
  });

  it('removes via Capacitor Preferences', async () => {
    await storage.removeItem('token');
    expect(mockPreferencesRemove).toHaveBeenCalledWith({ key: 'token' });
  });
});
