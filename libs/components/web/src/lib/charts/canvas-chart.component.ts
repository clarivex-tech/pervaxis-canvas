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
  InjectionToken,
  OnChanges,
  OnDestroy,
  OnInit,
  inject,
  input,
  viewChild,
} from '@angular/core';
import type { ECharts, EChartsOption, EChartsType } from 'echarts';

/** Minimal ECharts API surface used internally. */
export interface EChartsInstance {
  setOption(option: EChartsOption, notMerge?: boolean): void;
  resize(): void;
  dispose(): void;
}

/** Factory function type that creates an ECharts instance on a DOM element. */
export type EChartsInitFn = (
  el: HTMLElement,
  theme?: string
) => EChartsInstance;

/** DI token that provides the ECharts `init` function. Defaults to the real echarts. */
export const ECHARTS_INIT = new InjectionToken<EChartsInitFn>('ECHARTS_INIT', {
  providedIn: 'root',
  factory: (): EChartsInitFn =>
    (el, theme) =>
      import('echarts').then(
        (m) => m.init(el as Parameters<typeof m.init>[0], theme) as ECharts
      ) as unknown as EChartsInstance,
});

/**
 * Base chart component backed by Apache ECharts.
 * Initialises an ECharts instance, handles resize via `ResizeObserver`,
 * and re-applies options on input changes.
 */
@Component({
  selector: 'canvas-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div #chartContainer class="canvas-chart__container"></div>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    .canvas-chart__container {
      width: 100%;
      height: 100%;
      min-height: 200px;
    }
  `],
})
export class CanvasChartComponent implements OnInit, OnChanges, OnDestroy {
  /** ECharts option object. */
  readonly options = input<EChartsOption>({});

  /** Whether to show the chart in dark theme. */
  readonly darkTheme = input<boolean>(false);

  protected readonly chartContainer =
    viewChild.required<ElementRef<HTMLDivElement>>('chartContainer');

  readonly #el = inject(ElementRef);
  readonly #echartsInit = inject(ECHARTS_INIT);

  #chart: EChartsInstance | null = null;
  #resizeObserver: ResizeObserver | null = null;

  async ngOnInit(): Promise<void> {
    const theme = this.darkTheme() ? 'dark' : undefined;
    const instance = this.#echartsInit(this.chartContainer().nativeElement, theme);
    // Resolve whether the factory returned a promise or a direct instance.
    const chart = instance instanceof Promise ? await instance : instance;
    this.#chart = chart;
    chart.setOption(this.options());
    this.#resizeObserver = new ResizeObserver(() => this.#chart?.resize());
    this.#resizeObserver.observe(this.#el.nativeElement);
  }

  ngOnChanges(): void {
    this.#chart?.setOption(this.options(), true);
  }

  ngOnDestroy(): void {
    this.#resizeObserver?.disconnect();
    this.#chart?.dispose();
    this.#chart = null;
  }

  /** Expose the underlying ECharts instance for advanced usage. */
  getInstance(): EChartsInstance | null {
    return this.#chart;
  }
}

/** Type alias kept for external callers importing from echarts directly. */
export type { EChartsOption, EChartsType };
