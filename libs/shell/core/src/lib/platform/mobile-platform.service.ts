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

import { Injectable, computed, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';

/** The runtime platform the app is currently executing on. */
export type NativePlatform = 'ios' | 'android' | 'web';

/**
 * Detects the current runtime platform (web, iOS, Android) via Capacitor.
 * Provides reactive signals so components can adapt their UI accordingly.
 *
 * Available automatically via `providedIn: 'root'` — no explicit registration needed.
 */
@Injectable({ providedIn: 'root' })
export class MobilePlatformService {
  /** Current platform name as a signal. */
  readonly platform = signal<NativePlatform>(this.#detect());

  /** `true` when running inside a Capacitor native container (iOS or Android). */
  readonly isNative = computed(() => this.platform() !== 'web');

  /** `true` when running on iOS. */
  readonly isIos = computed(() => this.platform() === 'ios');

  /** `true` when running on Android. */
  readonly isAndroid = computed(() => this.platform() === 'android');

  #detect(): NativePlatform {
    const p = Capacitor.getPlatform();
    if (p === 'ios' || p === 'android') return p;
    return 'web';
  }
}
