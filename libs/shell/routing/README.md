# @pervaxis/canvas-shell-routing

Dynamic MFE route registration for Canvas shell host applications.

## What's included

| Export | Description |
|---|---|
| `provideCanvasRouting()` | Registers routing providers |
| `ShellRoutingService` | Adds lazy MFE routes to the Angular router at runtime |
| `CanvasNotFoundComponent` | Default 404 page (token-styled) |
| `CANVAS_MFE_MODULE_LOADER` | Token for the remote module loader function |
| `CANVAS_NOT_FOUND_REDIRECT` | Token to redirect `**` instead of showing 404 component |
| `MfeModuleLoader` | Type for the loader function |

## Usage

### 1. Add to `app.config.ts`

```typescript
import { loadRemoteModule } from '@angular-architects/native-federation';
import { provideCanvasCore } from '@pervaxis/canvas-shell-core';
import { provideCanvasRouting } from '@pervaxis/canvas-shell-routing';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCanvasCore(),
    provideRouter(appRoutes),
    provideCanvasRouting({
      loader: (manifest) =>
        loadRemoteModule(manifest.name, manifest.exposedModule).then(m => m.default),
      notFoundRedirectTo: '/not-found', // optional — omit to use CanvasNotFoundComponent
    }),
  ],
};
```

### 2. Call `registerMfeRoutes()` after manifests load

```typescript
// In your APP_INITIALIZER (after canvas-core initialises):
export function shellInitFactory(): () => Promise<void> {
  const routing = inject(ShellRoutingService);
  const configService = inject(EnvironmentConfigService);
  const manifestLoader = inject(RemoteManifestLoader);

  return async () => {
    await configService.load();
    await manifestLoader.load();
    routing.registerMfeRoutes(); // routes wired — safe to navigate now
  };
}
```

### Route structure after registration

```
/home          ← your static shell routes (preserved)
/orders        ← from MfeManifest { routePath: 'orders' }
/inventory     ← from MfeManifest { routePath: 'inventory' }
/**            ← redirects to /not-found OR renders CanvasNotFoundComponent
```
