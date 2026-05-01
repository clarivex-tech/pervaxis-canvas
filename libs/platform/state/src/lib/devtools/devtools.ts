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
import { getState, signalStoreFeature, StateSource, watchState, withHooks } from '@ngrx/signals';

/** Minimal typing for the Redux DevTools Extension global. */
interface ReduxDevToolsExtension {
  connect(config: { name: string }): ReduxDevToolsConnection;
}

interface ReduxDevToolsConnection {
  init(state: unknown): void;
  send(action: { type: string }, state: unknown): void;
}

/**
 * NgRx Signals store feature that bridges the store to the Redux DevTools
 * browser extension.
 *
 * **Only use in development builds.** Guard with `isDevMode()` in the shell's
 * `app.config.ts` to prevent shipping DevTools code to production.
 *
 * @param name Display name shown in the DevTools panel.
 *
 * @example
 * ```typescript
 * export const FeatureStore = signalStore(
 *   { providedIn: 'root' },
 *   withState({ count: 0 }),
 *   ...(isDevMode() ? [withCanvasDevTools('FeatureStore')] : []),
 * );
 * ```
 */
export function withCanvasDevTools(name: string) {
  return signalStoreFeature(
    withHooks((store) => ({
      onInit() {
        const ext = (globalThis as Record<string, unknown>)[
          '__REDUX_DEVTOOLS_EXTENSION__'
        ] as ReduxDevToolsExtension | undefined;

        if (!ext) return;

        const conn = ext.connect({ name });
        conn.init(getState(store as unknown as StateSource<Record<string, unknown>>));

        watchState(
          store as unknown as StateSource<Record<string, unknown>>,
          (state) => conn.send({ type: `[${name}] Update` }, state)
        );
      },
    }))
  );
}
