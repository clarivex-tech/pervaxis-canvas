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
import { CanvasChartComponent, ECHARTS_INIT, EChartsInstance } from './canvas-chart.component';

// ResizeObserver polyfill for jsdom — must be a regular function so 'new' works.
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
function ResizeObserverPolyfill(this: ResizeObserver): void { void this; }
ResizeObserverPolyfill.prototype.observe = mockObserve;
ResizeObserverPolyfill.prototype.disconnect = mockDisconnect;
ResizeObserverPolyfill.prototype.unobserve = vi.fn();
globalThis.ResizeObserver = ResizeObserverPolyfill as unknown as typeof ResizeObserver;

describe('CanvasChartComponent', () => {
  let fixture: ComponentFixture<CanvasChartComponent>;
  let component: CanvasChartComponent;
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
      imports: [CanvasChartComponent],
      providers: [
        { provide: ECHARTS_INIT, useValue: mockInitFn },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CanvasChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the chart container element', () => {
    const container = fixture.nativeElement.querySelector('.canvas-chart__container');
    expect(container).toBeTruthy();
  });

  it('should default options to empty object', () => {
    expect(component.options()).toEqual({});
  });

  it('should default darkTheme to false', () => {
    expect(component.darkTheme()).toBe(false);
  });

  it('should call echarts init on ngOnInit', async () => {
    await component.ngOnInit();
    expect(mockInitFn).toHaveBeenCalled();
  });

  it('should call setOption with provided options', async () => {
    fixture.componentRef.setInput('options', { title: { text: 'Test' } });
    await component.ngOnInit();
    expect(mockSetOption).toHaveBeenCalled();
  });

  it('should expose the chart instance after initialisation', async () => {
    await component.ngOnInit();
    expect(component.getInstance()).not.toBeNull();
  });

  it('should dispose the chart instance on ngOnDestroy', async () => {
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
