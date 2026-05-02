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

import { Injectable, OnDestroy, inject, signal } from '@angular/core';
import { Router, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { Breadcrumb } from '../types/nav-item';

/**
 * Builds a breadcrumb trail from the active route tree on every `NavigationEnd`.
 * Reads `data['breadcrumb']` from each route snapshot.
 */
@Injectable({ providedIn: null })
export class BreadcrumbService implements OnDestroy {
  readonly #router = inject(Router);
  readonly #breadcrumbs = signal<Breadcrumb[]>([]);
  readonly #sub: Subscription;

  /** Read-only signal of the current breadcrumb trail. */
  readonly breadcrumbs = this.#breadcrumbs.asReadonly();

  constructor() {
    this.#sub = this.#router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.#build());
    this.#build();
  }

  ngOnDestroy(): void {
    this.#sub.unsubscribe();
  }

  #build(): void {
    const root = this.#router.routerState.snapshot.root;
    this.#breadcrumbs.set(this.#collect(root, ''));
  }

  #collect(route: ActivatedRouteSnapshot, pathAccum: string): Breadcrumb[] {
    const crumbs: Breadcrumb[] = [];
    const segment = route.url.map((s) => s.path).join('/');
    const fullPath = segment ? `${pathAccum}/${segment}` : pathAccum;

    if (route.data['breadcrumb']) {
      crumbs.push({ label: route.data['breadcrumb'] as string, path: fullPath || '/' });
    }

    for (const child of route.children) {
      crumbs.push(...this.#collect(child, fullPath));
    }

    return crumbs;
  }
}
