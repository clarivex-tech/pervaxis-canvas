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
  input,
  output,
} from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';
import { NavItem } from '../../types/nav-item';

/**
 * Collapsible sidebar hosting the primary navigation.
 * Collapse state is owned by the parent and passed via `collapsed` input.
 */
@Component({
  selector: 'canvas-sidebar',
  standalone: true,
  imports: [NavigationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside
      class="canvas-sidebar"
      [class.canvas-sidebar--collapsed]="collapsed()"
      [attr.aria-expanded]="!collapsed()"
    >
      <div class="canvas-sidebar__header">
        <button
          class="canvas-sidebar__toggle"
          type="button"
          (click)="toggled.emit()"
          [attr.aria-label]="collapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <span class="canvas-sidebar__toggle-icon" aria-hidden="true">
            {{ collapsed() ? '›' : '‹' }}
          </span>
        </button>
      </div>
      <div class="canvas-sidebar__content">
        <canvas-navigation [items]="navItems()" />
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
    }
    .canvas-sidebar {
      display: flex;
      flex-direction: column;
      width: var(--canvas-sidebar-width, 240px);
      height: 100%;
      background-color: var(--canvas-sidebar-bg, #fff);
      border-right: var(--canvas-sidebar-border, 1px solid rgba(0,0,0,0.12));
      transition: width var(--canvas-sidebar-transition, 200ms ease);
      overflow: hidden;
    }
    .canvas-sidebar--collapsed {
      width: var(--canvas-sidebar-collapsed-width, 56px);
    }
    .canvas-sidebar__header {
      display: flex;
      justify-content: flex-end;
      padding: var(--canvas-sidebar-header-padding, 0.5rem);
      border-bottom: var(--canvas-sidebar-header-border, 1px solid rgba(0,0,0,0.08));
    }
    .canvas-sidebar__toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: var(--canvas-sidebar-toggle-radius, 0.25rem);
      color: var(--canvas-sidebar-toggle-color, inherit);
      font-size: 1.25rem;
    }
    .canvas-sidebar__toggle:hover {
      background-color: var(--canvas-sidebar-toggle-hover-bg, rgba(0,0,0,0.06));
    }
    .canvas-sidebar__content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: var(--canvas-sidebar-content-padding, 0.5rem 0);
    }
    .canvas-sidebar--collapsed .canvas-sidebar__content {
      opacity: 0;
      pointer-events: none;
    }
  `],
})
export class SidebarComponent {
  /** Whether the sidebar is collapsed. */
  readonly collapsed = input<boolean>(false);
  /** Navigation items rendered inside the sidebar. */
  readonly navItems = input<NavItem[]>([]);
  /** Emits when the toggle button is clicked. */
  readonly toggled = output<void>();
}
