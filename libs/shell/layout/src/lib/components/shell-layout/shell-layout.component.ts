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

import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavItem } from '../../types/nav-item';

/**
 * Root shell layout component.
 * CSS Grid: sidebar | (header + main outlet).
 * Owns the `sidebarCollapsed` signal; delegates toggle to header and sidebar.
 */
@Component({
  selector: 'canvas-shell-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="canvas-layout"
      [class.canvas-layout--sidebar-collapsed]="sidebarCollapsed()"
    >
      <canvas-sidebar
        class="canvas-layout__sidebar"
        [collapsed]="sidebarCollapsed()"
        [navItems]="navItems()"
        (toggled)="toggleSidebar()"
      />
      <div class="canvas-layout__body">
        <canvas-header
          class="canvas-layout__header"
          (sidebarToggle)="toggleSidebar()"
        >
          <ng-content select="[canvas-header-actions]" canvas-header-actions />
        </canvas-header>
        <main class="canvas-layout__main" id="canvas-main-content" tabindex="-1">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
    .canvas-layout {
      display: grid;
      grid-template-columns: var(--canvas-sidebar-width, 240px) 1fr;
      grid-template-rows: 1fr;
      height: 100%;
      transition: grid-template-columns var(--canvas-sidebar-transition, 200ms ease);
    }
    .canvas-layout--sidebar-collapsed {
      grid-template-columns: var(--canvas-sidebar-collapsed-width, 56px) 1fr;
    }
    .canvas-layout__sidebar {
      grid-row: 1;
      grid-column: 1;
      height: 100%;
      overflow: hidden;
    }
    .canvas-layout__body {
      grid-row: 1;
      grid-column: 2;
      display: flex;
      flex-direction: column;
      min-height: 0;
      overflow: hidden;
    }
    .canvas-layout__header {
      flex-shrink: 0;
    }
    .canvas-layout__main {
      flex: 1;
      overflow: auto;
      padding: var(--canvas-main-padding, 1.5rem);
      background-color: var(--canvas-main-bg, #f5f5f5);
    }
    .canvas-layout__main:focus {
      outline: none;
    }
  `],
})
export class ShellLayoutComponent implements OnInit {
  /** Navigation items passed to the sidebar. */
  readonly navItems = input<NavItem[]>([]);

  /** Whether the sidebar starts collapsed. */
  readonly startCollapsed = input<boolean>(false);

  readonly sidebarCollapsed = signal(false);

  ngOnInit(): void {
    this.sidebarCollapsed.set(this.startCollapsed());
  }

  /** Toggle sidebar collapsed state. */
  toggleSidebar(): void {
    this.sidebarCollapsed.update((c) => !c);
  }
}
