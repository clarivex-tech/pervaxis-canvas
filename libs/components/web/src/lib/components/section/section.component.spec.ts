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
import { SectionComponent } from './section.component';

describe('SectionComponent', () => {
  let fixture: ComponentFixture<SectionComponent>;
  let component: SectionComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the section element', () => {
    const section = fixture.nativeElement.querySelector('.canvas-section');
    expect(section).toBeTruthy();
  });

  it('should not render header when no title provided', () => {
    const header = fixture.nativeElement.querySelector('.canvas-section__header');
    expect(header).toBeNull();
  });

  it('should render header when title is set', () => {
    fixture.componentRef.setInput('title', 'My Section');
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('.canvas-section__header');
    expect(header).toBeTruthy();
  });

  it('should render title text', () => {
    fixture.componentRef.setInput('title', 'My Section');
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('.canvas-section__title');
    expect(title.textContent.trim()).toBe('My Section');
  });

  it('should not render description when not provided', () => {
    fixture.componentRef.setInput('title', 'Section');
    fixture.detectChanges();
    const desc = fixture.nativeElement.querySelector('.canvas-section__description');
    expect(desc).toBeNull();
  });

  it('should render description when provided', () => {
    fixture.componentRef.setInput('title', 'Section');
    fixture.componentRef.setInput('description', 'Some description text');
    fixture.detectChanges();
    const desc = fixture.nativeElement.querySelector('.canvas-section__description');
    expect(desc).toBeTruthy();
    expect(desc.textContent.trim()).toBe('Some description text');
  });

  it('should render body area', () => {
    const body = fixture.nativeElement.querySelector('.canvas-section__body');
    expect(body).toBeTruthy();
  });

  it('should set aria-label when title provided', () => {
    fixture.componentRef.setInput('title', 'Aria Section');
    fixture.detectChanges();
    const section = fixture.nativeElement.querySelector('section');
    expect(section.getAttribute('aria-label')).toBe('Aria Section');
  });
});
