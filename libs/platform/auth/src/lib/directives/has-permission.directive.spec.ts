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
import { HasPermissionDirective } from './has-permission.directive';

const MOCK_CONTEXT: AuthContext = {
  userId: 'user-001',
  email: 'user@example.com',
  roles: [],
  permissions: ['invoices:read', 'invoices:write'],
  token: 'mock-jwt',
};

@Component({
  template: `<span *hasPermission="'invoices:read'" id="single">visible</span>
             <span *hasPermission="['invoices:read', 'invoices:write']" id="multi">visible</span>`,
  imports: [HasPermissionDirective],
})
class TestHostComponent {}

describe('HasPermissionDirective', () => {
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

  it('shows element when user has the required permission', () => {
    authContextService.setContext(MOCK_CONTEXT);
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#single'))).not.toBeNull();
  });

  it('hides element when user lacks the required permission', () => {
    authContextService.setContext({ ...MOCK_CONTEXT, permissions: [] });
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#single'))).toBeNull();
  });

  it('shows element when user has all required permissions (array)', () => {
    authContextService.setContext(MOCK_CONTEXT);
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#multi'))).not.toBeNull();
  });

  it('hides element when user is missing one of multiple required permissions', () => {
    authContextService.setContext({ ...MOCK_CONTEXT, permissions: ['invoices:read'] });
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
