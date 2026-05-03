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

import { Injectable, inject, signal } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';

/** Represents a single tab-bar entry. */
export interface MobileTab {
  /** Route path segment for this tab. */
  path: string;
  /** Display label. */
  label: string;
  /** Ionicon name (e.g. `'home-outline'`). */
  icon: string;
  /** Badge count shown above the tab icon. Omit or set to 0 to hide. */
  badge?: number;
}

/**
 * Mobile navigation service wrapping Ionic's `NavController`.
 * Tracks the active tab and provides helper methods for stack navigation.
 */
@Injectable({ providedIn: null })
export class MobileNavService {
  readonly #nav = inject(NavController);

  /** Currently active tab path. */
  readonly activeTab = signal<string>('');

  /**
   * Navigate to a tab root by path.
   * Resets the navigation stack for the selected tab.
   */
  navigateToTab(path: string): void {
    this.activeTab.set(path);
    void this.#nav.navigateRoot(path, { animated: true });
  }

  /**
   * Push a new page onto the current tab's navigation stack.
   */
  pushPage(path: string): void {
    void this.#nav.navigateForward(path, { animated: true });
  }

  /**
   * Pop the current page off the navigation stack.
   */
  popPage(): void {
    void this.#nav.pop();
  }

  /**
   * Navigate back to the root of the current tab stack.
   */
  popToRoot(): void {
    void this.#nav.navigateBack('/', { animated: true });
  }
}
