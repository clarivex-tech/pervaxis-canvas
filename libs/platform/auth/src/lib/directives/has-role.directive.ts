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
 * based on whether the current user holds the specified role(s).
 *
 * @example
 * ```html
 * <section *hasRole="'admin'">Admin Panel</section>
 * <div *hasRole="['admin', 'manager']">Management Area</div>
 * ```
 */
@Directive({
  selector: '[hasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private readonly _templateRef = inject(TemplateRef<unknown>);
  private readonly _viewContainer = inject(ViewContainerRef);
  private readonly _authContext = inject(AuthContextService);

  private _roles: string[] = [];

  /**
   * One or more roles required to render the element.
   * Accepts a single role string or an array of roles (all must be present).
   */
  @Input()
  set hasRole(roles: string | string[]) {
    this._roles = Array.isArray(roles) ? roles : [roles];
    this._updateView();
  }

  constructor() {
    effect(() => {
      this._authContext.context();
      this._updateView();
    });
  }

  private _updateView(): void {
    if (this._authContext.hasRole(...this._roles)) {
      if (this._viewContainer.length === 0) {
        this._viewContainer.createEmbeddedView(this._templateRef);
      }
    } else {
      this._viewContainer.clear();
    }
  }
}
