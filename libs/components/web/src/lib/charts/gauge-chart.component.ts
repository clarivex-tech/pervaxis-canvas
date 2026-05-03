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

/**
 * Gauge/speedometer chart built on top of `CanvasChartComponent`.
 */
@Component({
  selector: 'canvas-gauge-chart',
  standalone: true,
  imports: [CanvasChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <canvas-chart [options]="chartOptions()" [darkTheme]="darkTheme()" />
  `,
  styles: [`:host { display: block; width: 100%; height: 100%; }`],
})
export class GaugeChartComponent {
  /** Current value displayed on the gauge. */
  readonly value = input<number>(0);

  /** Minimum gauge value. */
  readonly min = input<number>(0);

  /** Maximum gauge value. */
  readonly max = input<number>(100);

  /** Series name shown in tooltip. */
  readonly name = input<string>('Value');

  /** Optional chart title. */
  readonly title = input<string>('');

  /** Dark theme toggle. */
  readonly darkTheme = input<boolean>(false);

  /** Computed ECharts options object. */
  readonly chartOptions = computed<EChartsOption>(() => ({
    title: this.title() ? { text: this.title(), left: 'center' } : undefined,
    tooltip: { formatter: '{b}: {c}' },
    series: [
      {
        name: this.name(),
        type: 'gauge',
        min: this.min(),
        max: this.max(),
        detail: { formatter: '{value}', fontSize: 20 },
        data: [{ value: this.value(), name: this.name() }],
        axisLine: {
          lineStyle: {
            color: [
              [0.3, '#dc2626'],
              [0.7, '#d97706'],
              [1, '#16a34a'],
            ],
            width: 10,
          },
        },
      },
    ],
  }));
}
