# @pervaxis/canvas-shell-core

Bootstrap and runtime configuration foundation for Canvas shell host applications.

## What's included

| Export | Description |
|---|---|
| `provideCanvasCore()` | Registers all core providers + `APP_INITIALIZER` |
| `EnvironmentConfigService` | Signal-based runtime config loader |
| `RemoteManifestLoader` | MFE registry client with signal cache |
| `buildFederationManifest()` | Converts `MfeManifest[]` → `initFederation()` map |
| `CanvasRuntimeConfig` | Interface for `/assets/config.json` shape |
| `CANVAS_CONFIG_URL` | Token to override the config file URL |

## Usage

### 1. Add to `app.config.ts`

```typescript
import { provideCanvasCore } from '@pervaxis/canvas-shell-core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCanvasCore(),
    // or with a custom config URL:
    // provideCanvasCore({ configUrl: '/env/runtime.json' }),
  ],
};
```

### 2. Create `/assets/config.json`

```json
{
  "apiBaseUrl": "https://api.yourapp.com",
  "registryUrl": "https://api.yourapp.com/registry/remotes",
  "oidcIssuer": "https://auth.yourapp.com",
  "oidcClientId": "shell-client"
}
```

### 3. Wire Native Federation in `main.ts`

```typescript
import { initFederation } from '@angular-architects/native-federation';
import { buildFederationManifest } from '@pervaxis/canvas-shell-core';

// Fetch your manifests (e.g. from registry), then:
await initFederation(buildFederationManifest(manifests));
await bootstrapApplication(AppComponent, appConfig);
```

### 4. Consume config in a component

```typescript
import { EnvironmentConfigService } from '@pervaxis/canvas-shell-core';

@Component({ ... })
export class MyComponent {
  readonly #config = inject(EnvironmentConfigService);
  readonly apiBase = computed(() => this.#config.config()?.apiBaseUrl);
}
```
