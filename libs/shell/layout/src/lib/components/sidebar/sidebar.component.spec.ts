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
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar.component';
import { NavItem } from '../../types/nav-item';

@Component({ standalone: true, template: '' })
class StubComponent {}

const mockNavItems: NavItem[] = [
  { id: 'dash', label: 'Dashboard', path: '/dashboard' },
];

describe('SidebarComponent', () => {
  let fixture: ComponentFixture<SidebarComponent>;
  let component: SidebarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [provideRouter([{ path: '**', component: StubComponent }])],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('navItems', mockNavItems);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render an aside element', () => {
    const aside = fixture.nativeElement.querySelector('aside');
    expect(aside).toBeTruthy();
  });

  it('should default to expanded state', () => {
    const aside = fixture.nativeElement.querySelector('aside');
    expect(aside.classList.contains('canvas-sidebar--collapsed')).toBe(false);
  });

  it('should apply collapsed class when collapsed input is true', () => {
    fixture.componentRef.setInput('collapsed', true);
    fixture.detectChanges();
    const aside = fixture.nativeElement.querySelector('aside');
    expect(aside.classList.contains('canvas-sidebar--collapsed')).toBe(true);
  });

  it('should set aria-expanded=false when collapsed', () => {
    fixture.componentRef.setInput('collapsed', true);
    fixture.detectChanges();
    const aside = fixture.nativeElement.querySelector('aside');
    expect(aside.getAttribute('aria-expanded')).toBe('false');
  });

  it('should set aria-expanded=true when not collapsed', () => {
    fixture.componentRef.setInput('collapsed', false);
    fixture.detectChanges();
    const aside = fixture.nativeElement.querySelector('aside');
    expect(aside.getAttribute('aria-expanded')).toBe('true');
  });

  it('should emit toggled when toggle button is clicked', () => {
    const toggledSpy = vi.fn();
    component.toggled.subscribe(toggledSpy);
    const button = fixture.nativeElement.querySelector('.canvas-sidebar__toggle');
    button.click();
    expect(toggledSpy).toHaveBeenCalledTimes(1);
  });

  it('should show "Collapse sidebar" aria-label when expanded', () => {
    fixture.componentRef.setInput('collapsed', false);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.canvas-sidebar__toggle');
    expect(button.getAttribute('aria-label')).toBe('Collapse sidebar');
  });

  it('should show "Expand sidebar" aria-label when collapsed', () => {
    fixture.componentRef.setInput('collapsed', true);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.canvas-sidebar__toggle');
    expect(button.getAttribute('aria-label')).toBe('Expand sidebar');
  });

  it('should render canvas-navigation inside the sidebar', () => {
    const nav = fixture.nativeElement.querySelector('canvas-navigation');
    expect(nav).toBeTruthy();
  });
});
