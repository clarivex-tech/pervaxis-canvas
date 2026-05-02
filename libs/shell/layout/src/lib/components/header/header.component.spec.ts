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
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { HeaderComponent } from './header.component';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { Breadcrumb } from '../../types/nav-item';

@Component({ standalone: true, template: '' })
class StubComponent {}

function makeMockBreadcrumbService(crumbs: Breadcrumb[] = []) {
  const s = signal(crumbs);
  return { breadcrumbs: s.asReadonly() };
}

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([{ path: '**', component: StubComponent }]),
        {
          provide: BreadcrumbService,
          useValue: makeMockBreadcrumbService([
            { label: 'Home', path: '/' },
            { label: 'Dashboard' },
          ]),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a header element', () => {
    const header = fixture.nativeElement.querySelector('header');
    expect(header).toBeTruthy();
  });

  it('should render the sidebar toggle button', () => {
    const btn = fixture.nativeElement.querySelector('.canvas-header__sidebar-toggle');
    expect(btn).toBeTruthy();
    expect(btn.getAttribute('aria-label')).toBe('Toggle sidebar');
  });

  it('should emit sidebarToggle when toggle button is clicked', () => {
    const spy = vi.fn();
    component.sidebarToggle.subscribe(spy);
    const btn = fixture.nativeElement.querySelector('.canvas-header__sidebar-toggle');
    btn.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render breadcrumb nav with aria-label', () => {
    const nav = fixture.nativeElement.querySelector('nav[aria-label="Breadcrumb"]');
    expect(nav).toBeTruthy();
  });

  it('should render breadcrumb items from the service', () => {
    const items = fixture.nativeElement.querySelectorAll('.canvas-header__breadcrumb-item');
    expect(items.length).toBe(2);
  });

  it('should render an anchor for non-last breadcrumb', () => {
    const link = fixture.nativeElement.querySelector('.canvas-header__breadcrumb-link');
    expect(link).toBeTruthy();
    expect(link.textContent.trim()).toBe('Home');
  });

  it('should render a span with aria-current=page for the last breadcrumb', () => {
    const current = fixture.nativeElement.querySelector('[aria-current="page"]');
    expect(current).toBeTruthy();
    expect(current.textContent.trim()).toBe('Dashboard');
  });

  it('should render breadcrumb separators between items', () => {
    const seps = fixture.nativeElement.querySelectorAll('.canvas-header__breadcrumb-sep');
    expect(seps.length).toBe(1);
  });

});

describe('HeaderComponent — empty breadcrumbs', () => {
  it('should render empty breadcrumb list when no crumbs', async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([{ path: '**', component: StubComponent }]),
        { provide: BreadcrumbService, useValue: makeMockBreadcrumbService([]) },
      ],
    }).compileComponents();
    const emptyFixture = TestBed.createComponent(HeaderComponent);
    emptyFixture.detectChanges();
    const items = emptyFixture.nativeElement.querySelectorAll('.canvas-header__breadcrumb-item');
    expect(items.length).toBe(0);
  });
});
