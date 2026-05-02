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
import { Observable } from 'rxjs';

/**
 * Envelope for all cross-MFE events published on the event bus.
 * @template T Payload type specific to the event.
 */
export interface CanvasEvent<T = unknown> {
  /** Discriminator string used to subscribe to specific event types. */
  type: string;
  /** Event-specific data. */
  payload: T;
  /** Logical name of the MFE or shell that emitted the event. */
  source: string;
  /** Unix epoch milliseconds when the event was emitted. */
  timestamp: number;
}

/**
 * Typed event bus for decoupled cross-MFE communication.
 * Provided as a singleton by the shell; consumed via `CANVAS_EVENT_BUS`.
 */
export interface EventBus {
  /** Publish an event to all subscribers. */
  publish<T>(event: CanvasEvent<T>): void;
  /** Subscribe to all events matching the given type discriminator. */
  on<T>(type: string): Observable<CanvasEvent<T>>;
}
