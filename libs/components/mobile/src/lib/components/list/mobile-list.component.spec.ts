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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { MobileListComponent } from './mobile-list.component';

describe('MobileListComponent', () => {
  let fixture: ComponentFixture<MobileListComponent>;
  let component: MobileListComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileListComponent],
      providers: [provideIonicAngular()],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render ion-content', () => {
    const el = fixture.nativeElement.querySelector('ion-content');
    expect(el).toBeTruthy();
  });

  it('should render ion-list', () => {
    const el = fixture.nativeElement.querySelector('ion-list');
    expect(el).toBeTruthy();
  });

  it('should default pullToRefresh to false', () => {
    expect(component.pullToRefresh()).toBe(false);
  });

  it('should default infiniteScroll to false', () => {
    expect(component.infiniteScroll()).toBe(false);
  });

  it('should not render ion-refresher by default', () => {
    const el = fixture.nativeElement.querySelector('ion-refresher');
    expect(el).toBeNull();
  });

  it('should render ion-refresher when pullToRefresh is true', () => {
    fixture.componentRef.setInput('pullToRefresh', true);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('ion-refresher');
    expect(el).toBeTruthy();
  });

  it('should not render ion-infinite-scroll by default', () => {
    const el = fixture.nativeElement.querySelector('ion-infinite-scroll');
    expect(el).toBeNull();
  });

  it('should render ion-infinite-scroll when infiniteScroll is true', () => {
    fixture.componentRef.setInput('infiniteScroll', true);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('ion-infinite-scroll');
    expect(el).toBeTruthy();
  });

  it('should emit refreshed event on ion-refresher ionRefresh', () => {
    fixture.componentRef.setInput('pullToRefresh', true);
    fixture.detectChanges();

    const emitted: Event[] = [];
    component.refreshed.subscribe((e) => emitted.push(e));

    const refresher = fixture.nativeElement.querySelector('ion-refresher');
    refresher.dispatchEvent(new CustomEvent('ionRefresh', { bubbles: true }));

    expect(emitted.length).toBe(1);
  });

  it('should emit loadMore event on ion-infinite-scroll ionInfinite', () => {
    fixture.componentRef.setInput('infiniteScroll', true);
    fixture.detectChanges();

    const emitted: Event[] = [];
    component.loadMore.subscribe((e) => emitted.push(e));

    const scroll = fixture.nativeElement.querySelector('ion-infinite-scroll');
    scroll.dispatchEvent(new CustomEvent('ionInfinite', { bubbles: true }));

    expect(emitted.length).toBe(1);
  });
});
