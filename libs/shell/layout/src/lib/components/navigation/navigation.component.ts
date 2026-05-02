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
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from '../../types/nav-item';

/**
 * Renders a recursive navigation tree.
 * Purely presentational — all state is passed via inputs.
 */
@Component({
  selector: 'canvas-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="canvas-nav" aria-label="Main navigation">
      <ul class="canvas-nav__list" role="list">
        @for (item of items(); track item.id) {
          <li class="canvas-nav__item" [class.canvas-nav__item--disabled]="item.disabled">
            @if (item.path && !item.disabled) {
              <a
                class="canvas-nav__link"
                [routerLink]="item.path"
                routerLinkActive="canvas-nav__link--active"
                [attr.aria-disabled]="item.disabled || null"
              >
                @if (item.icon) {
                  <span class="canvas-nav__icon" aria-hidden="true">{{ item.icon }}</span>
                }
                <span class="canvas-nav__label">{{ item.label }}</span>
              </a>
            } @else {
              <span
                class="canvas-nav__link canvas-nav__link--no-route"
                [attr.aria-disabled]="item.disabled || null"
              >
                @if (item.icon) {
                  <span class="canvas-nav__icon" aria-hidden="true">{{ item.icon }}</span>
                }
                <span class="canvas-nav__label">{{ item.label }}</span>
              </span>
            }
            @if (item.children && item.children.length > 0) {
              <ul class="canvas-nav__children" role="list">
                @for (child of item.children; track child.id) {
                  <li class="canvas-nav__item canvas-nav__item--child" [class.canvas-nav__item--disabled]="child.disabled">
                    @if (child.path && !child.disabled) {
                      <a
                        class="canvas-nav__link canvas-nav__link--child"
                        [routerLink]="child.path"
                        routerLinkActive="canvas-nav__link--active"
                      >
                        @if (child.icon) {
                          <span class="canvas-nav__icon" aria-hidden="true">{{ child.icon }}</span>
                        }
                        <span class="canvas-nav__label">{{ child.label }}</span>
                      </a>
                    } @else {
                      <span class="canvas-nav__link canvas-nav__link--child canvas-nav__link--no-route">
                        @if (child.icon) {
                          <span class="canvas-nav__icon" aria-hidden="true">{{ child.icon }}</span>
                        }
                        <span class="canvas-nav__label">{{ child.label }}</span>
                      </span>
                    }
                  </li>
                }
              </ul>
            }
          </li>
        }
      </ul>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
    }
    .canvas-nav__list,
    .canvas-nav__children {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .canvas-nav__link {
      display: flex;
      align-items: center;
      gap: var(--canvas-nav-icon-gap, 0.5rem);
      padding: var(--canvas-nav-item-padding, 0.625rem 1rem);
      color: var(--canvas-nav-text-color, inherit);
      text-decoration: none;
      border-radius: var(--canvas-nav-item-radius, 0.25rem);
      cursor: pointer;
      transition: background-color 150ms ease;
    }
    .canvas-nav__link:hover:not(.canvas-nav__link--no-route) {
      background-color: var(--canvas-nav-hover-bg, rgba(0,0,0,0.06));
    }
    .canvas-nav__link--active {
      background-color: var(--canvas-nav-active-bg, rgba(0,0,0,0.1));
      color: var(--canvas-nav-active-color, inherit);
      font-weight: var(--canvas-nav-active-font-weight, 600);
    }
    .canvas-nav__item--disabled .canvas-nav__link {
      opacity: var(--canvas-nav-disabled-opacity, 0.4);
      cursor: not-allowed;
    }
    .canvas-nav__link--child {
      padding-left: var(--canvas-nav-child-indent, 2.5rem);
      font-size: var(--canvas-nav-child-font-size, 0.875rem);
    }
  `],
})
export class NavigationComponent {
  /** The list of nav items to render. */
  readonly items = input<NavItem[]>([]);
}
