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
import { CanvasNotFoundComponent } from './canvas-not-found.component';

describe('CanvasNotFoundComponent', () => {
  let fixture: ComponentFixture<CanvasNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasNotFoundComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(CanvasNotFoundComponent);
    fixture.detectChanges();
  });

  it('renders the 404 code', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.canvas-not-found__code')?.textContent?.trim()).toBe('404');
  });

  it('renders a descriptive message', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.canvas-not-found__message')?.textContent).toContain(
      'could not be found'
    );
  });

  it('contains the canvas-not-found wrapper div', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.canvas-not-found')).not.toBeNull();
  });
});
