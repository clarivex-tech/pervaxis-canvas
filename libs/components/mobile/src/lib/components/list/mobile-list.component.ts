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
  input,
  output,
} from '@angular/core';
import {
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import type {
  InfiniteScrollCustomEvent,
  RefresherCustomEvent,
} from '@ionic/angular/standalone';

/**
 * Mobile list container wrapping `ion-list` with pull-to-refresh and infinite scroll.
 * Consumers project `ion-item` elements into the default slot.
 */
@Component({
  selector: 'canvas-mobile-list',
  standalone: true,
  imports: [
    IonContent,
    IonList,
    IonRefresher,
    IonRefresherContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ion-content>
      @if (pullToRefresh()) {
        <ion-refresher slot="fixed" (ionRefresh)="onRefresh($event)">
          <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
      }
      <ion-list [lines]="lines()">
        <ng-content />
      </ion-list>
      @if (infiniteScroll()) {
        <ion-infinite-scroll
          [disabled]="infiniteScrollDisabled()"
          (ionInfinite)="onInfinite($event)"
        >
          <ion-infinite-scroll-content
            [loadingText]="loadingText()"
          ></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      }
    </ion-content>
  `,
})
export class MobileListComponent {
  /** Enable pull-to-refresh gesture. */
  readonly pullToRefresh = input<boolean>(false);

  /** Enable infinite scroll at the bottom of the list. */
  readonly infiniteScroll = input<boolean>(false);

  /** Disable the infinite scroll trigger (use after all data is loaded). */
  readonly infiniteScrollDisabled = input<boolean>(false);

  /** Line style for list items. */
  readonly lines = input<'full' | 'inset' | 'none'>('inset');

  /** Loading spinner text for infinite scroll. */
  readonly loadingText = input<string>('Loading…');

  /** Emits when the pull-to-refresh gesture completes. Call `event.target.complete()` when done. */
  readonly refreshed = output<RefresherCustomEvent>();

  /** Emits when the infinite scroll threshold is reached. Call `event.target.complete()` when done. */
  readonly loadMore = output<InfiniteScrollCustomEvent>();

  protected onRefresh(event: Event): void {
    this.refreshed.emit(event as RefresherCustomEvent);
  }

  protected onInfinite(event: Event): void {
    this.loadMore.emit(event as InfiniteScrollCustomEvent);
  }
}
