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
import { DataViewComponent } from './data-view.component';

describe('DataViewComponent', () => {
  let fixture: ComponentFixture<DataViewComponent>;
  let component: DataViewComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the container', () => {
    const container = fixture.nativeElement.querySelector('.canvas-data-view');
    expect(container).toBeTruthy();
  });

  it('should not show loading overlay by default', () => {
    const overlay = fixture.nativeElement.querySelector('.canvas-data-view__overlay');
    expect(overlay).toBeNull();
  });

  it('should show loading overlay when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const overlay = fixture.nativeElement.querySelector('.canvas-data-view__overlay');
    expect(overlay).toBeTruthy();
  });

  it('should apply loading class when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('.canvas-data-view');
    expect(container.classList.contains('canvas-data-view--loading')).toBe(true);
  });

  it('should not show empty state by default', () => {
    const empty = fixture.nativeElement.querySelector('.canvas-data-view__empty');
    expect(empty).toBeNull();
  });

  it('should show empty state when empty is true', () => {
    fixture.componentRef.setInput('empty', true);
    fixture.detectChanges();
    const empty = fixture.nativeElement.querySelector('.canvas-data-view__empty');
    expect(empty).toBeTruthy();
  });

  it('should show default empty text', () => {
    fixture.componentRef.setInput('empty', true);
    fixture.detectChanges();
    const text = fixture.nativeElement.querySelector('.canvas-data-view__empty-text');
    expect(text.textContent.trim()).toBe('No data to display');
  });

  it('should show custom empty text', () => {
    fixture.componentRef.setInput('empty', true);
    fixture.componentRef.setInput('emptyText', 'Nothing here yet');
    fixture.detectChanges();
    const text = fixture.nativeElement.querySelector('.canvas-data-view__empty-text');
    expect(text.textContent.trim()).toBe('Nothing here yet');
  });

  it('should not show empty state when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('empty', true);
    fixture.detectChanges();
    const empty = fixture.nativeElement.querySelector('.canvas-data-view__empty');
    expect(empty).toBeNull();
  });
});
