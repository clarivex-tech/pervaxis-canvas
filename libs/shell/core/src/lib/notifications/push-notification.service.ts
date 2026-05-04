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

import { Injectable, computed, inject, signal } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { MobilePlatformService } from '../platform/mobile-platform.service';

/** Normalised push notification payload. */
export interface CanvasPushNotification {
  /** Notification title. */
  title: string | undefined;
  /** Notification body text. */
  body: string | undefined;
  /** Custom data payload attached to the notification. */
  data: Record<string, unknown>;
}

/** Push permission state mirroring the Capacitor `PermissionState` values. */
export type PushPermissionState = 'prompt' | 'granted' | 'denied';

/**
 * Manages push notification registration and reception on native platforms
 * via the `@capacitor/push-notifications` plugin.
 *
 * On web, all methods are no-ops — `isGranted` stays `false`.
 *
 * @example
 * // In your app bootstrap:
 * const push = inject(PushNotificationService);
 * await push.register();
 */
@Injectable({ providedIn: 'root' })
export class PushNotificationService {
  readonly #platform = inject(MobilePlatformService);

  readonly #permissionStatus = signal<PushPermissionState>('prompt');
  readonly #registrationToken = signal<string | null>(null);
  readonly #lastNotification = signal<CanvasPushNotification | null>(null);

  /** Current OS-level push permission state. */
  readonly permissionStatus = this.#permissionStatus.asReadonly();

  /** APNs / FCM device registration token. `null` until `register()` succeeds. */
  readonly registrationToken = this.#registrationToken.asReadonly();

  /** Most recently received foreground push notification. */
  readonly lastNotification = this.#lastNotification.asReadonly();

  /** `true` when push permission has been granted by the user. */
  readonly isGranted = computed(() => this.#permissionStatus() === 'granted');

  /**
   * Requests push permission (if not yet determined) and registers with
   * APNs / FCM. Sets `registrationToken` on success.
   * No-op on web.
   */
  async register(): Promise<void> {
    if (!this.#platform.isNative()) return;

    const current = await PushNotifications.checkPermissions();
    const effective =
      current.receive === 'prompt'
        ? (await PushNotifications.requestPermissions()).receive
        : current.receive;

    this.#permissionStatus.set(effective as PushPermissionState);

    if (this.#permissionStatus() !== 'granted') return;

    await PushNotifications.register();
    this.#attachListeners();
  }

  #attachListeners(): void {
    PushNotifications.addListener('registration', ({ value }) => {
      this.#registrationToken.set(value);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      this.#lastNotification.set({
        title: notification.title,
        body: notification.body,
        data: (notification.data ?? {}) as Record<string, unknown>,
      });
    });
  }
}
