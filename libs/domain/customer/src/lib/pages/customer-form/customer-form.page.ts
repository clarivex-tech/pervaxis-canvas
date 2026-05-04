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
  Signal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormEngineComponent, FormSchema, PageComponent } from '@pervaxis/canvas-components-web';
import { CustomerStore } from '../../state/customer.store';
import { CreateCustomerDto, Customer, UpdateCustomerDto } from '../../models/customer.model';

/**
 * Create / Edit form page for the Customer domain.
 *
 * Demonstrates:
 * - Schema-driven form via `FormEngineComponent`
 * - Create vs edit flow detection from route params
 * - Computed `FormSchema` that pre-populates fields from `CustomerStore.selected()`
 * - Async submit that delegates to `CustomerStore.create()` or `.update()`
 * - Loading guard: form is hidden while the edit record is loading
 */
@Component({
  selector: 'customer-form',
  standalone: true,
  imports: [TranslocoPipe, PageComponent, FormEngineComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <canvas-page [title]="pageTitle()">
      <div canvas-page-actions>
        <button class="btn btn-secondary" (click)="goBack()">
          {{ 'customer.action.cancel' | transloco }}
        </button>
      </div>

      @if (store.loading()) {
        <p class="loading-text">Loading…</p>
      } @else {
        <canvas-form-engine
          [schema]="formSchema()"
          [submitLabel]="'customer.form.submit' | transloco"
          (formSubmit)="onSubmit($event)"
        />
      }
    </canvas-page>
  `,
  styles: [`
    .loading-text {
      padding: 1rem 0;
    }
  `],
})
export class CustomerFormPage implements OnInit {
  protected readonly store = inject(CustomerStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /** ID present only for edit flow; undefined for create flow. */
  protected readonly routeId: Signal<string | undefined> = signal(
    this.route.snapshot.params['id'] as string | undefined
  );

  protected readonly isEdit = computed(() => !!this.routeId());

  protected readonly pageTitle = computed(() =>
    this.isEdit()
      ? 'customer.form.editTitle'
      : 'customer.form.createTitle'
  );

  /**
   * Computed form schema.
   *
   * When editing, `store.selected()` is populated after `store.select(id)` resolves.
   * The `@if (!store.loading())` guard in the template ensures the form only renders
   * once the customer data is available, so the form always initialises with correct
   * default values.
   */
  protected readonly formSchema = computed((): FormSchema => {
    const c = this.store.selected();
    return {
      fields: [
        {
          key: 'code',
          type: 'text',
          label: 'customer.form.code',
          placeholder: 'CUST-001',
          defaultValue: c?.code ?? '',
          validation: { required: true, maxLength: 20 },
        },
        {
          key: 'name',
          type: 'text',
          label: 'customer.form.name',
          defaultValue: c?.name ?? '',
          validation: { required: true, maxLength: 100 },
        },
        {
          key: 'email',
          type: 'email',
          label: 'customer.form.email',
          defaultValue: c?.email ?? '',
          validation: { required: true },
        },
        {
          key: 'phone',
          type: 'text',
          label: 'customer.form.phone',
          defaultValue: c?.phone ?? '',
        },
        {
          key: 'industry',
          type: 'select',
          label: 'customer.form.industry',
          defaultValue: c?.industry ?? '',
          validation: { required: true },
          options: [
            { label: 'Technology', value: 'Technology' },
            { label: 'Finance', value: 'Finance' },
            { label: 'Healthcare', value: 'Healthcare' },
            { label: 'Retail', value: 'Retail' },
            { label: 'Other', value: 'Other' },
          ],
        },
      ],
    };
  });

  ngOnInit(): void {
    const id = this.routeId();
    if (id) {
      void this.store.select(id);
    }
  }

  protected async onSubmit(value: Record<string, unknown>): Promise<void> {
    const id = this.routeId();
    let result: Customer;

    if (id) {
      result = await this.store.update(id, value as UpdateCustomerDto);
    } else {
      result = await this.store.create(value as unknown as CreateCustomerDto);
    }

    void this.router.navigate(['/customers', result.id]);
  }

  protected goBack(): void {
    const id = this.routeId();
    void this.router.navigate(id ? ['/customers', id] : ['/customers']);
  }
}
