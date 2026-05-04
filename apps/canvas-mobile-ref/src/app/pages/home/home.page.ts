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

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { MobileChartComponent } from '@pervaxis/canvas-components-mobile';
import { MobilePlatformService } from '@pervaxis/canvas-shell-core';
import { NetworkService } from '@pervaxis/canvas-platform-http';
import type { EChartsOption } from 'echarts';

/** Home page demonstrating MobileChartComponent and reactive platform/network signals. */
@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    MobileChartComponent,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Canvas Mobile Ref</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <p>Platform: <strong>{{ platform.platform() }}</strong></p>
      <p>Network: <strong>{{ network.isOnline() ? 'Online' : 'Offline' }}</strong></p>

      <canvas-mobile-chart [options]="chartOptions" height="260px" />

      <ion-button expand="block" routerLink="/auth">Go to Login</ion-button>
    </ion-content>
  `,
})
export class HomePage {
  readonly platform = inject(MobilePlatformService);
  readonly network = inject(NetworkService);

  readonly chartOptions: EChartsOption = {
    title: { text: 'Monthly Sales', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [120, 200, 150, 80, 70, 110] }],
  };
}
