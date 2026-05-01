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
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthContext } from '@pervaxis/canvas-mfe-contracts';
import { AuthContextService } from '../auth-context/auth-context.service';
import { HasRoleDirective } from './has-role.directive';

const MOCK_CONTEXT: AuthContext = {
  userId: 'user-001',
  email: 'user@example.com',
  roles: ['admin', 'viewer'],
  permissions: [],
  token: 'mock-jwt',
};

@Component({
  template: `<section *hasRole="'admin'" id="single">admin</section>
             <section *hasRole="['admin', 'viewer']" id="multi">multi</section>`,
  imports: [HasRoleDirective],
})
class TestHostComponent {}

describe('HasRoleDirective', () => {
  let authContextService: AuthContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    authContextService = TestBed.inject(AuthContextService);
  });

  it('hides element when user is not authenticated', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#single'))).toBeNull();
  });

  it('shows element when user has the required role', () => {
    authContextService.setContext(MOCK_CONTEXT);
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#single'))).not.toBeNull();
  });

  it('hides element when user lacks the required role', () => {
    authContextService.setContext({ ...MOCK_CONTEXT, roles: ['viewer'] });
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#single'))).toBeNull();
  });

  it('shows element when user has all required roles (array)', () => {
    authContextService.setContext(MOCK_CONTEXT);
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#multi'))).not.toBeNull();
  });

  it('hides element when user is missing one of multiple required roles', () => {
    authContextService.setContext({ ...MOCK_CONTEXT, roles: ['admin'] });
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#multi'))).toBeNull();
  });

  it('reactively hides element after context is cleared', () => {
    authContextService.setContext(MOCK_CONTEXT);
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#single'))).not.toBeNull();

    authContextService.clearContext();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#single'))).toBeNull();
  });
});
