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

import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ShellLayoutComponent, NavItem } from '@pervaxis/canvas-shell-layout';
import { ShellRoutingService } from '@pervaxis/canvas-shell-routing';
import { RemoteManifestLoader, RegistryClientService } from '@pervaxis/canvas-shell-core';

/**
 * Root shell host component.
 * Wraps the entire application in `ShellLayoutComponent` and registers
 * any dynamically discovered MFE routes from the registry.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ShellLayoutComponent],
  template: `
    <canvas-shell-layout [navItems]="navItems">
      <button canvas-header-actions class="btn-icon" aria-label="User menu">
        &#9679;
      </button>
    </canvas-shell-layout>
  `,
  styles: [`
    :host { display: block; height: 100vh; }
    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      font-size: 1.25rem;
      color: var(--canvas-color-text-muted);
    }
  `],
})
export class AppComponent implements OnInit {
  readonly #routing = inject(ShellRoutingService);
  readonly #manifestLoader = inject(RemoteManifestLoader);
  readonly #registryClient = inject(RegistryClientService);

  /** Static nav items always shown in the sidebar. */
  readonly navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: 'home' },
    { label: 'Settings', path: '/settings', icon: 'settings' },
  ];

  ngOnInit(): void {
    // Register MFE routes from both the legacy manifest loader and the new registry client.
    const manifests = [
      ...this.#manifestLoader.manifests(),
      ...this.#registryClient.remotes(),
    ];
    if (manifests.length > 0) {
      this.#routing.registerMfeRoutes(manifests);
    }
  }
}
