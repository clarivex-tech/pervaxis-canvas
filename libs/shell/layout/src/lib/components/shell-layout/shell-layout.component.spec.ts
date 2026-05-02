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
import { ShellLayoutComponent } from './shell-layout.component';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { NavItem } from '../../types/nav-item';

@Component({ standalone: true, template: '' })
class StubComponent {}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', path: '/home' },
];

describe('ShellLayoutComponent', () => {
  let fixture: ComponentFixture<ShellLayoutComponent>;
  let component: ShellLayoutComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellLayoutComponent],
      providers: [
        provideRouter([{ path: '**', component: StubComponent }]),
        {
          provide: BreadcrumbService,
          useValue: { breadcrumbs: signal([]).asReadonly() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellLayoutComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('navItems', navItems);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the root layout div', () => {
    const layout = fixture.nativeElement.querySelector('.canvas-layout');
    expect(layout).toBeTruthy();
  });

  it('should render canvas-sidebar', () => {
    const sidebar = fixture.nativeElement.querySelector('canvas-sidebar');
    expect(sidebar).toBeTruthy();
  });

  it('should render canvas-header', () => {
    const header = fixture.nativeElement.querySelector('canvas-header');
    expect(header).toBeTruthy();
  });

  it('should render a router-outlet', () => {
    const outlet = fixture.nativeElement.querySelector('router-outlet');
    expect(outlet).toBeTruthy();
  });

  it('should start expanded by default', () => {
    expect(component.sidebarCollapsed()).toBe(false);
    const layout = fixture.nativeElement.querySelector('.canvas-layout');
    expect(layout.classList.contains('canvas-layout--sidebar-collapsed')).toBe(false);
  });

  it('should start collapsed when startCollapsed input is true', () => {
    fixture.componentRef.setInput('startCollapsed', true);
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.sidebarCollapsed()).toBe(true);
  });

  it('should toggle sidebar on toggleSidebar()', () => {
    expect(component.sidebarCollapsed()).toBe(false);
    component.toggleSidebar();
    expect(component.sidebarCollapsed()).toBe(true);
    component.toggleSidebar();
    expect(component.sidebarCollapsed()).toBe(false);
  });

  it('should apply sidebar-collapsed class when collapsed', () => {
    component.toggleSidebar();
    fixture.detectChanges();
    const layout = fixture.nativeElement.querySelector('.canvas-layout');
    expect(layout.classList.contains('canvas-layout--sidebar-collapsed')).toBe(true);
  });

  it('should render main element with correct attributes', () => {
    const main = fixture.nativeElement.querySelector('main');
    expect(main).toBeTruthy();
    expect(main.id).toBe('canvas-main-content');
  });
});
