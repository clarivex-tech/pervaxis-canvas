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
import { NavigationComponent } from './navigation.component';
import { NavItem } from '../../types/nav-item';

@Component({ standalone: true, template: '' })
class StubComponent {}

const mockItems: NavItem[] = [
  { id: 'home', label: 'Home', path: '/home', icon: 'home' },
  { id: 'reports', label: 'Reports', path: '/reports' },
  { id: 'disabled', label: 'Disabled', path: '/disabled', disabled: true },
  {
    id: 'settings',
    label: 'Settings',
    children: [
      { id: 'profile', label: 'Profile', path: '/settings/profile' },
    ],
  },
];

describe('NavigationComponent', () => {
  let fixture: ComponentFixture<NavigationComponent>;
  let component: NavigationComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationComponent],
      providers: [provideRouter([{ path: '**', component: StubComponent }])],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', mockItems);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a nav element with aria-label', () => {
    const nav = fixture.nativeElement.querySelector('nav');
    expect(nav).toBeTruthy();
    expect(nav.getAttribute('aria-label')).toBe('Main navigation');
  });

  it('should render all top-level nav items', () => {
    const items = fixture.nativeElement.querySelectorAll('.canvas-nav__item');
    expect(items.length).toBeGreaterThanOrEqual(mockItems.length);
  });

  it('should render an anchor for items with a path', () => {
    const link = fixture.nativeElement.querySelector('a.canvas-nav__link');
    expect(link).toBeTruthy();
  });

  it('should render a span for items without a path', () => {
    const span = fixture.nativeElement.querySelector('span.canvas-nav__link--no-route');
    expect(span).toBeTruthy();
  });

  it('should add disabled class on disabled items', () => {
    const disabledItems = fixture.nativeElement.querySelectorAll('.canvas-nav__item--disabled');
    expect(disabledItems.length).toBeGreaterThan(0);
  });

  it('should render icon span when icon is provided', () => {
    const icon = fixture.nativeElement.querySelector('.canvas-nav__icon');
    expect(icon).toBeTruthy();
    expect(icon.textContent.trim()).toBe('home');
  });

  it('should render child items', () => {
    const children = fixture.nativeElement.querySelectorAll('.canvas-nav__item--child');
    expect(children.length).toBeGreaterThan(0);
  });

  it('should render empty nav when items is empty', () => {
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();
    const listItems = fixture.nativeElement.querySelectorAll('.canvas-nav__item');
    expect(listItems.length).toBe(0);
  });

  it('should default items to empty array', () => {
    const emptyFixture = TestBed.createComponent(NavigationComponent);
    emptyFixture.detectChanges();
    expect(emptyFixture.componentInstance.items()).toEqual([]);
  });
});
