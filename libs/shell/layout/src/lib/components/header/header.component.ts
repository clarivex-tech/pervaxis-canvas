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
  inject,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbService } from '../../services/breadcrumb.service';

/**
 * Application header: breadcrumb trail, sidebar toggle, and an action slot.
 * Content-projects into `[canvas-header-actions]` for toolbar buttons.
 */
@Component({
  selector: 'canvas-header',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="canvas-header">
      <div class="canvas-header__start">
        <button
          class="canvas-header__sidebar-toggle"
          type="button"
          (click)="sidebarToggle.emit()"
          aria-label="Toggle sidebar"
        >
          <span aria-hidden="true">☰</span>
        </button>

        <nav class="canvas-header__breadcrumbs" aria-label="Breadcrumb">
          <ol class="canvas-header__breadcrumb-list">
            @for (crumb of breadcrumbService.breadcrumbs(); track crumb.label; let last = $last) {
              <li class="canvas-header__breadcrumb-item">
                @if (crumb.path && !last) {
                  <a class="canvas-header__breadcrumb-link" [routerLink]="crumb.path">
                    {{ crumb.label }}
                  </a>
                } @else {
                  <span class="canvas-header__breadcrumb-current" aria-current="page">
                    {{ crumb.label }}
                  </span>
                }
                @if (!last) {
                  <span class="canvas-header__breadcrumb-sep" aria-hidden="true">/</span>
                }
              </li>
            }
          </ol>
        </nav>
      </div>

      <div class="canvas-header__actions">
        <ng-content select="[canvas-header-actions]" />
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }
    .canvas-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--canvas-header-height, 56px);
      padding: var(--canvas-header-padding, 0 1rem);
      background-color: var(--canvas-header-bg, #fff);
      border-bottom: var(--canvas-header-border, 1px solid rgba(0,0,0,0.12));
      box-shadow: var(--canvas-header-shadow, none);
    }
    .canvas-header__start {
      display: flex;
      align-items: center;
      gap: var(--canvas-header-gap, 0.75rem);
    }
    .canvas-header__sidebar-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: var(--canvas-header-btn-radius, 0.25rem);
      font-size: 1.125rem;
      color: var(--canvas-header-icon-color, inherit);
    }
    .canvas-header__sidebar-toggle:hover {
      background-color: var(--canvas-header-btn-hover-bg, rgba(0,0,0,0.06));
    }
    .canvas-header__breadcrumb-list {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      list-style: none;
      margin: 0;
      padding: 0;
      font-size: var(--canvas-breadcrumb-font-size, 0.875rem);
    }
    .canvas-header__breadcrumb-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .canvas-header__breadcrumb-link {
      color: var(--canvas-breadcrumb-link-color, inherit);
      text-decoration: none;
    }
    .canvas-header__breadcrumb-link:hover {
      text-decoration: underline;
    }
    .canvas-header__breadcrumb-current {
      color: var(--canvas-breadcrumb-current-color, inherit);
      font-weight: var(--canvas-breadcrumb-current-weight, 500);
    }
    .canvas-header__breadcrumb-sep {
      color: var(--canvas-breadcrumb-sep-color, rgba(0,0,0,0.4));
    }
    .canvas-header__actions {
      display: flex;
      align-items: center;
      gap: var(--canvas-header-actions-gap, 0.5rem);
    }
  `],
})
export class HeaderComponent {
  /** Exposed for template access. */
  readonly breadcrumbService = inject(BreadcrumbService);
  /** Emits when the user clicks the sidebar toggle in the header. */
  readonly sidebarToggle = output<void>();
}
