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

import { Injectable, OnDestroy, computed, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Network } from '@capacitor/network';

/**
 * Tracks the device network connectivity state as a reactive signal.
 *
 * On native (Capacitor) platforms, uses the `@capacitor/network` plugin for
 * accurate cellular/WiFi detection. On web, falls back to `navigator.onLine`
 * and the browser `online`/`offline` events.
 */
@Injectable({ providedIn: 'root' })
export class NetworkService implements OnDestroy {
  readonly #online = signal<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  /** `true` when the device has network connectivity. */
  readonly isOnline = this.#online.asReadonly();

  /** `true` when the device is offline. */
  readonly isOffline = computed(() => !this.#online());

  readonly #onlineHandler = () => this.#online.set(true);
  readonly #offlineHandler = () => this.#online.set(false);

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.#onlineHandler);
      window.addEventListener('offline', this.#offlineHandler);
    }
    if (Capacitor.isNativePlatform()) {
      void this.#initNative();
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.#onlineHandler);
      window.removeEventListener('offline', this.#offlineHandler);
    }
    void Network.removeAllListeners();
  }

  async #initNative(): Promise<void> {
    const status = await Network.getStatus();
    this.#online.set(status.connected);
    await Network.addListener('networkStatusChange', ({ connected }) => {
      this.#online.set(connected);
    });
  }
}
