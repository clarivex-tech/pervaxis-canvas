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
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-community';

/**
 * Inline text cell editor for ag-Grid.
 * Focuses the input after render and returns the current value on `getValue()`.
 */
@Component({
  selector: 'canvas-text-cell-editor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      #input
      class="canvas-cell-editor"
      type="text"
      [value]="value()"
      (input)="onInput($event)"
    />
  `,
  styles: [`
    .canvas-cell-editor {
      width: 100%;
      height: 100%;
      border: none;
      outline: 2px solid var(--canvas-color-primary, #2563eb);
      padding: 0 var(--canvas-space-2, 0.5rem);
      font-size: var(--canvas-grid-font-size, 0.875rem);
      background: var(--canvas-surface-bg, #ffffff);
      box-sizing: border-box;
    }
  `],
})
export class TextCellEditorComponent implements ICellEditorAngularComp {
  protected readonly value = signal('');

  readonly #inputRef = viewChild.required<ElementRef<HTMLInputElement>>('input');
  readonly #el = inject(ElementRef);

  agInit(params: ICellEditorParams): void {
    this.value.set(params.value ?? '');
    afterNextRender(() => {
      this.#inputRef().nativeElement.focus();
    }, { injector: (this.#el as unknown as { injector: Parameters<typeof afterNextRender>[1]['injector'] }).injector });
  }

  /** Returns current editor value to ag-Grid. */
  getValue(): string {
    return this.value();
  }

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
