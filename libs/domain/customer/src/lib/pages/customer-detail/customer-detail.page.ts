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
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { HasPermissionDirective } from '@pervaxis/canvas-platform-auth';
import { PageComponent, SectionComponent } from '@pervaxis/canvas-components-web';
import { CustomerStore } from '../../state/customer.store';

/**
 * Read-only detail page for a single Customer.
 *
 * Demonstrates:
 * - Loading a single record via `CustomerStore.select(id)`
 * - `*hasPermission` on the Edit action button
 * - `transloco` pipe for all labels
 * - `@if` control flow with loading and error states
 */
@Component({
  selector: 'customer-detail',
  standalone: true,
  imports: [TranslocoPipe, HasPermissionDirective, PageComponent, SectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <canvas-page [title]="'customer.detail.title' | transloco">
      <div canvas-page-actions>
        <button class="btn btn-secondary" (click)="goBack()">
          {{ 'customer.action.back' | transloco }}
        </button>
        <button
          *hasPermission="'customers:write'"
          class="btn btn-primary"
          (click)="navigateToEdit()"
        >
          {{ 'customer.action.edit' | transloco }}
        </button>
      </div>

      @if (store.loading()) {
        <p class="loading-text">Loading…</p>
      } @else if (store.error()) {
        <p class="error-text">{{ store.error() }}</p>
      } @else if (store.selected(); as customer) {
        <canvas-section [title]="'customer.section.basic' | transloco">
          <dl class="detail-grid">
            <dt>{{ 'customer.field.code' | transloco }}</dt>
            <dd>{{ customer.code }}</dd>

            <dt>{{ 'customer.field.name' | transloco }}</dt>
            <dd>{{ customer.name }}</dd>

            <dt>{{ 'customer.field.email' | transloco }}</dt>
            <dd>{{ customer.email }}</dd>

            <dt>{{ 'customer.field.phone' | transloco }}</dt>
            <dd>{{ customer.phone }}</dd>

            <dt>{{ 'customer.field.industry' | transloco }}</dt>
            <dd>{{ customer.industry }}</dd>

            <dt>{{ 'customer.field.status' | transloco }}</dt>
            <dd>{{ ('customer.status.' + customer.status) | transloco }}</dd>

            <dt>{{ 'customer.field.createdAt' | transloco }}</dt>
            <dd>{{ customer.createdAt }}</dd>

            <dt>{{ 'customer.field.updatedAt' | transloco }}</dt>
            <dd>{{ customer.updatedAt }}</dd>
          </dl>
        </canvas-section>
      }
    </canvas-page>
  `,
  styles: [`
    .detail-grid {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: 0.5rem 1.5rem;
      margin: 0;
    }
    dt {
      font-weight: 500;
      color: var(--canvas-text-secondary, #4b5563);
    }
    dd {
      margin: 0;
      color: var(--canvas-text-primary, #111827);
    }
    .loading-text, .error-text {
      padding: 1rem 0;
    }
    .error-text {
      color: var(--canvas-color-danger, #dc2626);
    }
  `],
})
export class CustomerDetailPage implements OnInit {
  protected readonly store = inject(CustomerStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'] as string;
    void this.store.select(id);
  }

  protected goBack(): void {
    void this.router.navigate(['/customers']);
  }

  protected navigateToEdit(): void {
    const id = this.route.snapshot.params['id'] as string;
    void this.router.navigate(['/customers', id, 'edit']);
  }
}
