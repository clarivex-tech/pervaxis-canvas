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

import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Default 404 component rendered when no route matches and no
 * `CANVAS_NOT_FOUND_REDIRECT` token is provided.
 *
 * Styled via CSS custom properties — override in the shell app's
 * global stylesheet to match the print's design system.
 */
@Component({
  selector: 'canvas-not-found',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="canvas-not-found">
      <h1 class="canvas-not-found__code">404</h1>
      <p class="canvas-not-found__message">The page you requested could not be found.</p>
    </div>
  `,
  styles: [`
    .canvas-not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: var(--canvas-not-found-min-height, 60vh);
      padding: var(--canvas-spacing-xl, 2rem);
      text-align: center;
      color: var(--canvas-color-text-primary, #1a1a1a);
    }

    .canvas-not-found__code {
      font-size: var(--canvas-not-found-code-size, 6rem);
      font-weight: 700;
      line-height: 1;
      margin: 0 0 var(--canvas-spacing-md, 1rem);
      color: var(--canvas-color-text-muted, #6b7280);
    }

    .canvas-not-found__message {
      font-size: var(--canvas-font-size-lg, 1.125rem);
      margin: 0;
      color: var(--canvas-color-text-secondary, #4b5563);
    }
  `],
})
export class CanvasNotFoundComponent {}
