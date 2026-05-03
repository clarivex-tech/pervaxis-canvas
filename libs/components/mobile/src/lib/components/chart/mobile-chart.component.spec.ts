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
import { vi } from 'vitest';
import { MobileChartComponent, MOBILE_ECHARTS_INIT } from './mobile-chart.component';
import { EChartsInstance } from '../../../types/echarts-types';

// ResizeObserver polyfill for jsdom
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
function ResizeObserverPolyfill(this: ResizeObserver): void { void this; }
ResizeObserverPolyfill.prototype.observe = mockObserve;
ResizeObserverPolyfill.prototype.disconnect = mockDisconnect;
ResizeObserverPolyfill.prototype.unobserve = vi.fn();
globalThis.ResizeObserver = ResizeObserverPolyfill as unknown as typeof ResizeObserver;

describe('MobileChartComponent', () => {
  let fixture: ComponentFixture<MobileChartComponent>;
  let component: MobileChartComponent;
  let mockSetOption: ReturnType<typeof vi.fn>;
  let mockDispose: ReturnType<typeof vi.fn>;
  let mockResize: ReturnType<typeof vi.fn>;
  let mockInitFn: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    mockSetOption = vi.fn();
    mockDispose = vi.fn();
    mockResize = vi.fn();

    const mockInstance: EChartsInstance = {
      setOption: mockSetOption,
      resize: mockResize,
      dispose: mockDispose,
    };

    mockInitFn = vi.fn(() => mockInstance);

    await TestBed.configureTestingModule({
      imports: [MobileChartComponent],
      providers: [
        { provide: MOBILE_ECHARTS_INIT, useValue: mockInitFn },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render chart container', () => {
    const el = fixture.nativeElement.querySelector('.canvas-mobile-chart__container');
    expect(el).toBeTruthy();
  });

  it('should default options to empty object', () => {
    expect(component.options()).toEqual({});
  });

  it('should default height to 240px', () => {
    expect(component.height()).toBe('240px');
  });

  it('should call echarts init on ngOnInit', async () => {
    await component.ngOnInit();
    expect(mockInitFn).toHaveBeenCalled();
  });

  it('should expose the chart instance after initialisation', async () => {
    await component.ngOnInit();
    expect(component.getInstance()).not.toBeNull();
  });

  it('should dispose chart on ngOnDestroy', async () => {
    await component.ngOnInit();
    component.ngOnDestroy();
    expect(mockDispose).toHaveBeenCalled();
    expect(component.getInstance()).toBeNull();
  });

  it('should disconnect ResizeObserver on ngOnDestroy', async () => {
    await component.ngOnInit();
    component.ngOnDestroy();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
