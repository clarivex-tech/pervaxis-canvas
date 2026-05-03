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

export { MfeTestHarness } from './lib/harness/mfe-test-harness';
export type { MfeTestConfig } from './lib/harness/mfe-test-harness';
export { createMockAuthContext, mockCanvasAuthContext } from './lib/mocks/mock-auth-context.provider';
export { mockCanvasEventBus } from './lib/mocks/mock-event-bus.provider';
export type { MockEventBus } from './lib/mocks/mock-event-bus.provider';
export { mockCanvasSharedState } from './lib/mocks/mock-shared-state.provider';
