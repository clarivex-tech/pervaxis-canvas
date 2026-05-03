# @pervaxis/canvas-mfe-bootstrap

Bootstrap utilities for Canvas MFE remote Angular applications.

## Installation

```bash
npm install @pervaxis/canvas-mfe-bootstrap
```

## API

### `bootstrapMfe(component, appConfig?)`

Creates a Native Federation compatible bootstrap factory for an MFE remote.

```typescript
// remoteEntry.ts
import { bootstrapMfe } from '@pervaxis/canvas-mfe-bootstrap';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

export const bootstrap = bootstrapMfe(AppComponent, appConfig);
```

### `provideMfeBootstrap(config)`

Registers all Canvas MFE providers into the Angular DI tree.

```typescript
// app.config.ts (MFE remote)
import { ApplicationConfig } from '@angular/core';
import { provideMfeBootstrap } from '@pervaxis/canvas-mfe-bootstrap';

export const appConfig: ApplicationConfig = {
  providers: [
    provideMfeBootstrap({ name: 'orders-mfe' }),
  ],
};
```

### `MfeAuthContextService`

Signal-based access to the authenticated user context provided by the shell.

```typescript
@Component({ ... })
export class OrdersComponent {
  readonly #auth = inject(MfeAuthContextService);

  canEdit = computed(() => this.#auth.hasPermission('orders:write'));
  userName = this.#auth.userId;
}
```

### `buildRemoteEntryConfig(name, exposes)`

Builds a typed Native Federation remote configuration descriptor.

```typescript
// federation.config.js
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');
const { buildRemoteEntryConfig } = require('@pervaxis/canvas-mfe-bootstrap');

const remote = buildRemoteEntryConfig('orders-mfe', {
  './Component': './src/app/app.component.ts',
});

module.exports = withNativeFederation({
  ...remote,
  shared: { ...shareAll({ singleton: true, strictVersion: true }) },
});
```

### `MFE_NAME`

`InjectionToken<string>` bound to the MFE's logical name by `provideMfeBootstrap()`.

```typescript
readonly mfeName = inject(MFE_NAME); // 'orders-mfe'
```
