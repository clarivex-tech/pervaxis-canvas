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

import { InjectionToken, Provider } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

/**
 * Asynchronous key/value storage abstraction used for token persistence.
 * Web default uses `sessionStorage`; native default uses Capacitor Preferences
 * (Keychain on iOS, EncryptedSharedPreferences on Android).
 */
export interface CanvasTokenStorage {
  /** Retrieves a stored value by key, or `null` if not found. */
  getItem(key: string): Promise<string | null>;
  /** Persists a value under the given key. */
  setItem(key: string, value: string): Promise<void>;
  /** Removes the entry for the given key. */
  removeItem(key: string): Promise<void>;
}

class WebTokenStorage implements CanvasTokenStorage {
  async getItem(key: string): Promise<string | null> {
    return sessionStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    sessionStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    sessionStorage.removeItem(key);
  }
}

/** Uses Capacitor Preferences — Keychain on iOS, EncryptedSharedPreferences on Android. */
class CapacitorTokenStorage implements CanvasTokenStorage {
  async getItem(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key });
    return value;
  }

  async setItem(key: string, value: string): Promise<void> {
    await Preferences.set({ key, value });
  }

  async removeItem(key: string): Promise<void> {
    await Preferences.remove({ key });
  }
}

/**
 * DI token providing the active {@link CanvasTokenStorage} implementation.
 * Automatically selects `CapacitorTokenStorage` on native platforms and
 * `WebTokenStorage` (sessionStorage) on web.
 *
 * Override with `provideCapacitorTokenStorage()` to force the Capacitor
 * implementation regardless of platform (useful for testing).
 */
export const CANVAS_TOKEN_STORAGE = new InjectionToken<CanvasTokenStorage>(
  'CANVAS_TOKEN_STORAGE',
  {
    providedIn: 'root',
    factory: () =>
      Capacitor.isNativePlatform()
        ? new CapacitorTokenStorage()
        : new WebTokenStorage(),
  }
);

/**
 * Provider that forces Capacitor Preferences storage regardless of platform.
 * Add to the `providers` array of a native-only bootstrapped app.
 */
export function provideCapacitorTokenStorage(): Provider {
  return { provide: CANVAS_TOKEN_STORAGE, useClass: CapacitorTokenStorage };
}
