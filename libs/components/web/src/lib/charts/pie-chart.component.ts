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

/** A single slice in the pie chart. */
export interface PieSlice {
  name: string;
  value: number;
  color?: string;
}

/**
 * Pie/donut chart built on top of `CanvasChartComponent`.
 */
@Component({
  selector: 'canvas-pie-chart',
  standalone: true,
  imports: [CanvasChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <canvas-chart [options]="chartOptions()" [darkTheme]="darkTheme()" />
  `,
  styles: [`:host { display: block; width: 100%; height: 100%; }`],
})
export class PieChartComponent {
  /** Pie slices. */
  readonly slices = input<PieSlice[]>([]);

  /** Optional chart title. */
  readonly title = input<string>('');

  /** Set to true to render a donut chart. */
  readonly donut = input<boolean>(false);

  /** Dark theme toggle. */
  readonly darkTheme = input<boolean>(false);

  /** Computed ECharts options object. */
  readonly chartOptions = computed<EChartsOption>(() => ({
    title: this.title() ? { text: this.title(), left: 'center' } : undefined,
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, type: 'scroll' },
    series: [
      {
        type: 'pie',
        radius: this.donut() ? ['40%', '70%'] : '65%',
        center: ['50%', '48%'],
        data: this.slices().map((s) => ({
          name: s.name,
          value: s.value,
          ...(s.color ? { itemStyle: { color: s.color } } : {}),
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0,0,0,0.5)',
          },
        },
      },
    ],
  }));
}
