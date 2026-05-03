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
import { PageComponent } from './page.component';

describe('PageComponent', () => {
  let fixture: ComponentFixture<PageComponent>;
  let component: PageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Test Page');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the page title', () => {
    const title = fixture.nativeElement.querySelector('.canvas-page__title');
    expect(title.textContent.trim()).toBe('Test Page');
  });

  it('should not render subtitle when not provided', () => {
    const subtitle = fixture.nativeElement.querySelector('.canvas-page__subtitle');
    expect(subtitle).toBeNull();
  });

  it('should render subtitle when provided', () => {
    fixture.componentRef.setInput('subtitle', 'A subtitle');
    fixture.detectChanges();
    const subtitle = fixture.nativeElement.querySelector('.canvas-page__subtitle');
    expect(subtitle).toBeTruthy();
    expect(subtitle.textContent.trim()).toBe('A subtitle');
  });

  it('should render the page header element', () => {
    const header = fixture.nativeElement.querySelector('.canvas-page__header');
    expect(header).toBeTruthy();
  });

  it('should render the page content area', () => {
    const content = fixture.nativeElement.querySelector('.canvas-page__content');
    expect(content).toBeTruthy();
  });
});
