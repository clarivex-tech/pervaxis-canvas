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
  Directive,
  effect,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AuthContextService } from '../auth-context/auth-context.service';

/**
 * Structural directive that conditionally renders its host element
 * based on whether the current user holds the specified permission code(s).
 *
 * @example
 * ```html
 * <button *hasPermission="'invoices:write'">Create Invoice</button>
 * <div *hasPermission="['reports:read', 'reports:export']">Export</div>
 * ```
 */
@Directive({
  selector: '[hasPermission]',
  standalone: true,
})
export class HasPermissionDirective {
  private readonly _templateRef = inject(TemplateRef<unknown>);
  private readonly _viewContainer = inject(ViewContainerRef);
  private readonly _authContext = inject(AuthContextService);

  private _permissions: string[] = [];

  /**
   * One or more permission codes required to render the element.
   * Accepts a single code string or an array of codes (all must be present).
   */
  @Input()
  set hasPermission(permissions: string | string[]) {
    this._permissions = Array.isArray(permissions) ? permissions : [permissions];
    this._updateView();
  }

  constructor() {
    effect(() => {
      this._authContext.context();
      this._updateView();
    });
  }

  private _updateView(): void {
    if (this._authContext.hasPermission(...this._permissions)) {
      if (this._viewContainer.length === 0) {
        this._viewContainer.createEmbeddedView(this._templateRef);
      }
    } else {
      this._viewContainer.clear();
    }
  }
}
