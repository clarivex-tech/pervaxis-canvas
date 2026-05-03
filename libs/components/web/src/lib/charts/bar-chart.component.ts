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
  computed,
  input,
} from '@angular/core';
import type { EChartsOption } from 'echarts';
import { CanvasChartComponent } from './canvas-chart.component';

/** A single bar-chart series. */
export interface BarSeries {
  name: string;
  data: number[];
  color?: string;
}

/**
 * Bar chart built on top of `CanvasChartComponent`.
 * Accepts category labels and one or more data series.
 */
@Component({
  selector: 'canvas-bar-chart',
  standalone: true,
  imports: [CanvasChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <canvas-chart [options]="chartOptions()" [darkTheme]="darkTheme()" />
  `,
  styles: [`:host { display: block; width: 100%; height: 100%; }`],
})
export class BarChartComponent {
  /** Category axis labels. */
  readonly categories = input<string[]>([]);

  /** One or more data series. */
  readonly series = input<BarSeries[]>([]);

  /** Optional chart title. */
  readonly title = input<string>('');

  /** Dark theme toggle. */
  readonly darkTheme = input<boolean>(false);

  /** Computed ECharts options object. */
  readonly chartOptions = computed<EChartsOption>(() => ({
    title: this.title() ? { text: this.title(), left: 'center' } : undefined,
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    xAxis: { type: 'category', data: this.categories() },
    yAxis: { type: 'value' },
    series: this.series().map((s) => ({
      name: s.name,
      type: 'bar',
      data: s.data,
      ...(s.color ? { itemStyle: { color: s.color } } : {}),
    })),
  }));
}
