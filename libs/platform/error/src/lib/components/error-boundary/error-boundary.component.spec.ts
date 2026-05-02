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
import { Component, TemplateRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CANVAS_ERROR_CONFIG } from '../../tokens/error-config.token';
import { CanvasErrorService } from '../../services/canvas-error.service';
import { StructuredError } from '../../types/canvas-error.types';
import { ErrorBoundaryComponent } from './error-boundary.component';

@Component({
  standalone: true,
  imports: [ErrorBoundaryComponent],
  template: `
    <canvas-error-boundary>
      <span class="content">Normal content</span>
    </canvas-error-boundary>
  `,
})
class HostComponent {}

@Component({
  standalone: true,
  imports: [ErrorBoundaryComponent],
  template: `
    <canvas-error-boundary [fallback]="errorTpl">
      <span class="content">Normal content</span>
    </canvas-error-boundary>

    <ng-template #errorTpl let-error>
      <span class="custom-fallback">{{ error?.message }}</span>
    </ng-template>
  `,
})
class HostWithFallbackComponent {
  readonly errorTpl = viewChild.required<TemplateRef<unknown>>('errorTpl');
}

const MOCK_ERROR: StructuredError = { message: 'Test error', timestamp: 1 };

describe('ErrorBoundaryComponent', () => {
  let service: CanvasErrorService;

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    TestBed.configureTestingModule({
      providers: [
        { provide: CANVAS_ERROR_CONFIG, useValue: { enableConsoleLog: false, remoteEndpoint: '' } },
      ],
    });
    service = TestBed.inject(CanvasErrorService);
  });

  afterEach(() => vi.restoreAllMocks());

  describe('default (no fallback input)', () => {
    let fixture: ComponentFixture<HostComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(HostComponent);
      fixture.detectChanges();
    });

    it('renders projected content when there is no error', () => {
      expect(fixture.debugElement.query(By.css('.content'))).not.toBeNull();
    });

    it('hides projected content and shows default fallback when an error is reported', () => {
      service.report(MOCK_ERROR);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.content'))).toBeNull();
      expect(fixture.debugElement.query(By.css('.canvas-error-boundary'))).not.toBeNull();
    });

    it('renders the default fallback message', () => {
      service.report(MOCK_ERROR);
      fixture.detectChanges();

      const text = fixture.nativeElement.textContent as string;
      expect(text).toContain('Something went wrong');
    });

    it('restores content after reset() is called', () => {
      service.report(MOCK_ERROR);
      fixture.detectChanges();

      const retryBtn = fixture.debugElement.query(By.css('button'));
      retryBtn.nativeElement.click();
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.content'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('.canvas-error-boundary'))).toBeNull();
    });
  });

  describe('with custom fallback template', () => {
    let fixture: ComponentFixture<HostWithFallbackComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(HostWithFallbackComponent);
      fixture.detectChanges();
    });

    it('renders custom fallback with the error as $implicit context', () => {
      service.report(MOCK_ERROR);
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('.custom-fallback'));
      expect(el).not.toBeNull();
      expect(el.nativeElement.textContent).toContain('Test error');
    });

    it('does not render the default fallback when a custom one is provided', () => {
      service.report(MOCK_ERROR);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.canvas-error-boundary'))).toBeNull();
    });
  });
});
