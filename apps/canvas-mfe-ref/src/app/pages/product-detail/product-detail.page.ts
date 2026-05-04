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

import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PageComponent, SectionComponent, FormEngineComponent, FormSchema } from '@pervaxis/canvas-components-web';
import { HasPermissionDirective } from '@pervaxis/canvas-platform-auth';

/**
 * Product detail page — demonstrates `FormEngineComponent` for edit flows
 * and `HasPermissionDirective` for conditional action visibility.
 */
@Component({
  selector: 'app-product-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageComponent, SectionComponent, FormEngineComponent, HasPermissionDirective],
  template: `
    <canvas-page [title]="'Product: ' + id()" subtitle="View and edit product details">
      <button canvas-page-actions class="btn-secondary" (click)="goBack()">
        ← Back to Products
      </button>

      <canvas-section title="Details">
        <canvas-form-engine
          [schema]="productSchema"
          submitLabel="Save Changes"
          (formSubmit)="onSave($event)"
        />
      </canvas-section>

      @if (saved()) {
        <p class="save-confirmation" role="status">Changes saved successfully.</p>
      }
    </canvas-page>
  `,
  styles: [`
    .btn-secondary {
      background: white;
      border: 1px solid var(--canvas-color-border, #e2e8f0);
      border-radius: var(--canvas-radius-md, 0.5rem);
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-size: 0.875rem;
    }
    .save-confirmation {
      color: #16a34a;
      font-weight: 500;
      margin-top: 1rem;
    }
  `],
})
export class ProductDetailPage implements OnInit {
  readonly id = input.required<string>();

  readonly #router = inject(Router);
  readonly saved = signal(false);

  readonly productSchema: FormSchema = {
    fields: [
      { key: 'name', type: 'input', label: 'Product Name', required: true },
      { key: 'price', type: 'number', label: 'Price (USD)', required: true },
      {
        key: 'status',
        type: 'select',
        label: 'Status',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
          { label: 'Draft', value: 'draft' },
        ],
      },
      { key: 'description', type: 'textarea', label: 'Description' },
    ],
  };

  ngOnInit(): void {
    // Pre-populate form with product data fetched by ID.
    // In a real MFE: inject CanvasHttpService and call the products API.
  }

  onSave(_value: Record<string, unknown>): void {
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 3000);
  }

  goBack(): void {
    void this.#router.navigate(['../'], { relativeTo: null });
  }
}
