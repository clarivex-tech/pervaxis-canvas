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

import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { NavController } from '@ionic/angular/standalone';
import { MobileNavService } from './mobile-nav.service';

describe('MobileNavService', () => {
  let service: MobileNavService;
  let navCtrlMock: { navigateRoot: ReturnType<typeof vi.fn>; navigateForward: ReturnType<typeof vi.fn>; pop: ReturnType<typeof vi.fn>; navigateBack: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    navCtrlMock = {
      navigateRoot:    vi.fn().mockResolvedValue(true),
      navigateForward: vi.fn().mockResolvedValue(true),
      pop:             vi.fn().mockResolvedValue(true),
      navigateBack:    vi.fn().mockResolvedValue(true),
    };

    TestBed.configureTestingModule({
      providers: [
        MobileNavService,
        { provide: NavController, useValue: navCtrlMock },
      ],
    });

    service = TestBed.inject(MobileNavService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should have empty activeTab by default', () => {
    expect(service.activeTab()).toBe('');
  });

  it('navigateToTab should update activeTab signal', () => {
    service.navigateToTab('/home');
    expect(service.activeTab()).toBe('/home');
  });

  it('navigateToTab should call NavController.navigateRoot', () => {
    service.navigateToTab('/home');
    expect(navCtrlMock.navigateRoot).toHaveBeenCalledWith('/home', expect.any(Object));
  });

  it('pushPage should call NavController.navigateForward', () => {
    service.pushPage('/detail/1');
    expect(navCtrlMock.navigateForward).toHaveBeenCalledWith('/detail/1', expect.any(Object));
  });

  it('popPage should call NavController.pop', () => {
    service.popPage();
    expect(navCtrlMock.pop).toHaveBeenCalled();
  });

  it('popToRoot should call NavController.navigateBack', () => {
    service.popToRoot();
    expect(navCtrlMock.navigateBack).toHaveBeenCalledWith('/', expect.any(Object));
  });
});
