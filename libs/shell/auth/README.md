# @pervaxis/canvas-shell-auth

OIDC authentication for Canvas shell host applications, built on `angular-oauth2-oidc`.

## What's included

| Export | Description |
|---|---|
| `provideCanvasAuth()` | Registers all auth providers + `APP_INITIALIZER` |
| `ShellAuthService` | OIDC lifecycle: configure, login, logout, context sync |
| `jwtInterceptor` | `HttpInterceptorFn` — injects `Authorization: Bearer` header |
| `CanvasAuthConfig` | Config interface for `provideCanvasAuth()` |
| `CANVAS_AUTH_CONFIG` | Injection token for the resolved config |

## Usage

### 1. Add to `app.config.ts`

```typescript
import { provideCanvasCore } from '@pervaxis/canvas-shell-core';
import { provideCanvasAuth, jwtInterceptor } from '@pervaxis/canvas-shell-auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCanvasCore(),
    // Wire jwtInterceptor explicitly so order relative to other interceptors is clear
    provideHttpClient(withFetch(), withInterceptors([jwtInterceptor])),
    provideCanvasAuth({
      issuer: 'https://auth.example.com',
      clientId: 'shell-client',
      // redirectUri defaults to window.location.origin
      // scope defaults to 'openid profile email'
      // silentRefresh defaults to true
    }),
  ],
};
```

### 2. Trigger login from a component

```typescript
@Component({ ... })
export class LoginComponent {
  readonly #auth = inject(ShellAuthService);
  login() { this.#auth.login(); }
}
```

### 3. Logout

```typescript
this.#auth.logout();
// Clears AuthContextService + redirects to OIDC end-session endpoint
```

### 4. Custom JWT claims mapping

```typescript
provideCanvasAuth({
  issuer: 'https://auth.example.com',
  clientId: 'shell-client',
  rolesClaim: 'realm_access.roles', // your IdP's roles claim
  permissionsClaim: 'resource_access.permissions',
})
```

## Authentication flow

```
Browser          Shell App        OAuthService        IdP
   │                │                  │               │
   │  navigate /    │                  │               │
   │────────────────►                  │               │
   │                │  configure()     │               │
   │                │─────────────────►│               │
   │                │  loadDiscovery() │               │
   │                │─────────────────►│──── GET /.well-known ──►│
   │                │                  │◄─── discovery ─────────│
   │                │  login()         │               │
   │                │─────────────────►│               │
   │◄──── redirect to IdP ────────────────────────────►│
   │◄──── redirect back with code ─────────────────────│
   │                │  tryLogin()      │               │
   │                │─────────────────►│──── POST /token ───────►│
   │                │                  │◄─── access_token ───────│
   │                │  syncContext()   │               │
   │                │◄─────────────────│               │
```
