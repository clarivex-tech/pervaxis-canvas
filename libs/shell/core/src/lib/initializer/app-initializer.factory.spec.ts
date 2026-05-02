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
import { EnvironmentConfigService } from '../config/environment-config.service';
import { RemoteManifestLoader } from '../manifest/remote-manifest-loader.service';
import { appInitializerFactory } from './app-initializer.factory';

describe('appInitializerFactory', () => {
  let configLoad: ReturnType<typeof vi.fn>;
  let manifestLoad: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    configLoad = vi.fn().mockResolvedValue(undefined);
    manifestLoad = vi.fn().mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [
        { provide: EnvironmentConfigService, useValue: { load: configLoad } },
        { provide: RemoteManifestLoader, useValue: { load: manifestLoad } },
      ],
    });
  });

  it('returns a function', () => {
    const initFn = TestBed.runInInjectionContext(() => appInitializerFactory());
    expect(typeof initFn).toBe('function');
  });

  it('calls configService.load() then manifestLoader.load() in sequence', async () => {
    const callOrder: string[] = [];
    configLoad.mockImplementation(() => {
      callOrder.push('config');
      return Promise.resolve();
    });
    manifestLoad.mockImplementation(() => {
      callOrder.push('manifest');
      return Promise.resolve();
    });

    const initFn = TestBed.runInInjectionContext(() => appInitializerFactory());
    await initFn();

    expect(callOrder).toEqual(['config', 'manifest']);
  });

  it('calls configService.load() exactly once', async () => {
    const initFn = TestBed.runInInjectionContext(() => appInitializerFactory());
    await initFn();
    expect(configLoad).toHaveBeenCalledTimes(1);
  });

  it('calls manifestLoader.load() exactly once', async () => {
    const initFn = TestBed.runInInjectionContext(() => appInitializerFactory());
    await initFn();
    expect(manifestLoad).toHaveBeenCalledTimes(1);
  });

  it('propagates config load errors', async () => {
    configLoad.mockRejectedValue(new Error('config fetch failed'));
    const initFn = TestBed.runInInjectionContext(() => appInitializerFactory());
    await expect(initFn()).rejects.toThrow('config fetch failed');
  });

  it('does not call manifestLoader.load() if config load fails', async () => {
    configLoad.mockRejectedValue(new Error('config fetch failed'));
    const initFn = TestBed.runInInjectionContext(() => appInitializerFactory());
    await expect(initFn()).rejects.toBeDefined();
    expect(manifestLoad).not.toHaveBeenCalled();
  });
});
