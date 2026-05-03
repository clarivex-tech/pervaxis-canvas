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
import type { EChartsOption } from 'echarts';
import type { EChartsInstance } from '../../../types/echarts-types';

/** Factory function type for creating an ECharts instance. */
export type MobileEChartsInitFn = (el: HTMLElement, theme?: string) => EChartsInstance;

/** DI token for the ECharts initialiser — swap in tests. */
export const MOBILE_ECHARTS_INIT = new InjectionToken<MobileEChartsInitFn>(
  'MOBILE_ECHARTS_INIT',
  {
    providedIn: 'root',
    factory: (): MobileEChartsInitFn =>
      (el, theme) =>
        import('echarts').then(
          (m) => m.init(el as Parameters<typeof m.init>[0], theme)
        ) as unknown as EChartsInstance,
  }
);

/**
 * Mobile-optimised ECharts wrapper.
 * Uses `devicePixelRatio` for crisp rendering on high-DPI screens and
 * listens to window resize (ResizeObserver) for responsive layout.
 */
@Component({
  selector: 'canvas-mobile-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div #chartContainer class="canvas-mobile-chart__container"></div>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    .canvas-mobile-chart__container {
      width: 100%;
      height: var(--canvas-mobile-chart-height, 240px);
    }
  `],
})
export class MobileChartComponent implements OnInit, OnChanges, OnDestroy {
  /** ECharts option object. */
  readonly options = input<EChartsOption>({});

  /** Chart height (sets `--canvas-mobile-chart-height`). Defaults to 240px. */
  readonly height = input<string>('240px');

  /** Dark theme for the chart. */
  readonly darkTheme = input<boolean>(false);

  protected readonly chartContainer =
    viewChild.required<ElementRef<HTMLDivElement>>('chartContainer');

  readonly #el = inject(ElementRef);
  readonly #echartsInit = inject(MOBILE_ECHARTS_INIT);

  #chart: EChartsInstance | null = null;
  #resizeObserver: ResizeObserver | null = null;

  async ngOnInit(): Promise<void> {
    const container = this.chartContainer().nativeElement;
    container.style.setProperty('--canvas-mobile-chart-height', this.height());
    const theme = this.darkTheme() ? 'dark' : undefined;
    const instance = this.#echartsInit(container, theme);
    this.#chart = instance instanceof Promise ? await instance : instance;
    this.#chart.setOption(this.options());
    this.#resizeObserver = new ResizeObserver(() => this.#chart?.resize());
    this.#resizeObserver.observe(this.#el.nativeElement);
  }

  ngOnChanges(): void {
    if (this.#chart) {
      this.#chart.setOption(this.options(), true);
    }
  }

  ngOnDestroy(): void {
    this.#resizeObserver?.disconnect();
    this.#chart?.dispose();
    this.#chart = null;
  }

  /** Expose the underlying ECharts instance. */
  getInstance(): EChartsInstance | null {
    return this.#chart;
  }
}
