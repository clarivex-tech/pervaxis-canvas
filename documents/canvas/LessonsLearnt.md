# Pervaxis.Canvas — Lessons Learnt

Each entry records a principle that changed how we work — derived from real decisions and real mistakes on this project. Every entry states the rule first, then the context behind it.

---

## L001 — Use Vitest fake timers, not Angular `fakeAsync`

**Date:** 2026-05-01
**Phase:** Phase 2 — `canvas-platform-http`
**Rule:** In AnalogJS + Vitest tests, always use `vi.useFakeTimers()` + `vi.advanceTimersByTimeAsync()` for timer-based assertions. Never use Angular's `fakeAsync` / `tick`.

**Why:**
Angular's `fakeAsync` requires a ProxyZone to be active when the test function runs. AnalogJS's `setupTestBed({ zoneless: false })` loads Zone.js but does not wrap individual tests in the ProxyZone the way Angular's Karma/Jest runner does. Calling `fakeAsync()` throws "Expected to be running in 'ProxyZone', but it was not found."

**What to use instead:**
```typescript
it('retries after backoff', async () => {
  vi.useFakeTimers();

  // ... trigger observable ...
  mock.expectOne('/api').flush('err', { status: 500, statusText: 'Error' });

  await vi.advanceTimersByTimeAsync(101); // advance past backoff

  mock.expectOne('/api').flush({ ok: true });
  expect(result).toEqual({ ok: true });

  vi.useRealTimers();
});
```

**Applies to:** Any test in this workspace that needs to advance RxJS `timer()`, `timeout()`, or `debounceTime()`.

---

## L002 — `TestBed.overrideProvider` must be called before TestBed is instantiated

**Date:** 2026-05-01
**Phase:** Phase 2 — `canvas-platform-http`
**Rule:** If a test needs a different provider value from the `beforeEach` default, put that test in its own `describe` block with its own `beforeEach` that registers the override from the start. Never call `TestBed.overrideProvider` inside a test body after `TestBed.inject` has already been called.

**Why:**
Calling `TestBed.overrideProvider` after `TestBed.inject` throws "Cannot override provider when the test module has already been instantiated." Angular's TestBed is compiled the first time any token is injected.

**What to do:**
```typescript
// ✅ Separate describe block with dedicated beforeEach
describe('retryInterceptor — 2-retry config', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([retryInterceptor])),
        provideHttpClientTesting(),
        { provide: CANVAS_HTTP_CONFIG, useValue: { retryAttempts: 2, retryDelayMs: 100, timeoutMs: 30_000 } },
      ],
    });
  });
  // tests here...
});
```

**Applies to:** Any test suite that needs multiple configurations of the same injected token.

---

## L003 — `canvas-mfe-contracts` must be generated before any library that uses shared types

**Date:** 2026-05-01
**Phase:** Phase 2 — upcoming `canvas-platform-auth`
**Rule:** Before implementing any library that needs a cross-library type (e.g. `AuthContext`), generate `canvas-mfe-contracts` first and define the type there. Import it from contracts in all consuming libraries. Never define a shared type locally.

**Why:**
The Canvas compliance rule (`CANVAS_PACKAGES_COMPLIANCE.md`) mandates that all shared interfaces, types, and InjectionTokens live in `@pervaxis/canvas-mfe-contracts`. If `AuthContext` is defined in `canvas-platform-auth`, it creates a contract violation — `canvas-shell-auth` and MFE libraries would need to depend on a platform library just to get a type definition.

**Process:**
1. Ask: "Does any other Canvas library or generated print need this type?"
2. Yes → define in `canvas-mfe-contracts` first, then import in the consuming library
3. No → keep it internal to the library (not exported from `index.ts`)

**Applies to:** Every new shared interface, union type, enum, or InjectionToken across the entire project.

---

## L004 — SonarCloud requires a public repository on the free plan

**Date:** 2026-04-30
**Phase:** Phase 1 — Foundation
**Rule:** The Canvas GitHub repo (`clarivex-tech/pervaxis-canvas`) must remain public. Private repositories require a paid SonarCloud plan.

**Why:**
SonarCloud's free tier only analyses public repositories. The first PR-check CI workflow needed `qualitygate.wait=false` to bootstrap — the quality gate cannot be evaluated on a project that has never been analysed. After the first merge, flip it back to `qualitygate.wait=true`.

**Applies to:** CI configuration and any decisions about repo visibility.

---

## L005 — `@nx/dependency-checks` scans test config files unless explicitly excluded

**Date:** 2026-05-01
**Phase:** Phase 2 — `canvas-platform-http`
**Rule:** When generating publishable libraries, always extend `ignoredFiles` in the library's `eslint.config.mjs` to exclude `vite.config.ts`, `vitest.config.ts`, and `src/test-setup.ts` from the `@nx/dependency-checks` rule.

**Why:**
The lint rule reads all files in the library and flags any `import` that is not listed in `peerDependencies` or `devDependencies`. Test infrastructure imports (`vite`, `@analogjs/vite-plugin-angular`, `@nx/vite`) should not be peer deps of a published library. Excluding them keeps the package manifest clean.

**Template to add to every new publishable library's `eslint.config.mjs`:**
```javascript
ignoredFiles: [
  '{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}',
  '{projectRoot}/vite.config.{ts,mts}',
  '{projectRoot}/vitest.config.{ts,mts}',
  '{projectRoot}/src/test-setup.ts',
],
```

**Applies to:** Every publishable library generated in this workspace.

---

## L006 — Inter-workspace lib builds require `dist` path override in `tsconfig.lib.prod.json`

**Date:** 2026-05-01
**Phase:** Phase 2 — `canvas-platform-auth`
**Rule:** When a publishable library imports from another publishable library in the same workspace, override `paths` in `tsconfig.lib.prod.json` to point at the **built dist output**, not the source. The production build uses `compilationMode: partial` which enforces `rootDir` strictly.

**Why:**
ng-packagr sets `rootDir` to the library's own `src/` directory. Resolving a workspace sibling via a tsconfig path alias that points to `libs/other-lib/src/` brings files from outside `rootDir` into the compilation, causing `TS6059: File is not under rootDir`.

**What to add to `tsconfig.lib.prod.json`:**
```json
{
  "extends": "./tsconfig.lib.json",
  "compilerOptions": {
    "declarationMap": false,
    "paths": {
      "@pervaxis/canvas-mfe-contracts": ["dist/libs/mfe/contracts"]
    }
  },
  "angularCompilerOptions": { "compilationMode": "partial" }
}
```
The dist path is relative to `baseUrl` (workspace root). Always build the dependency first so the dist exists.

**Applies to:** Any publishable Canvas library that imports from `@pervaxis/canvas-mfe-contracts` or any other sibling Canvas lib.

---

## L007 — `@ngrx/signals` v21 does not export `withDevtools` — build a custom bridge

**Date:** 2026-05-01
**Phase:** Phase 2 — `canvas-platform-state`
**Rule:** Do not import `withDevtools` from `@ngrx/signals`. Implement `withCanvasDevTools` manually using `signalStoreFeature`, `withHooks`, `watchState`, and the Redux DevTools Extension global.

**Why:**
`@ngrx/signals/devtools` does not exist in v21.x. The package ships the DevTools integration separately and the import path was not yet stabilised. Attempting to import it throws `Cannot find module '@ngrx/signals/devtools'`.

**Working implementation:**
```typescript
export function withCanvasDevTools(name: string) {
  return signalStoreFeature(
    withHooks((store) => ({
      onInit() {
        const ext = (globalThis as Record<string, unknown>)
          ['__REDUX_DEVTOOLS_EXTENSION__'] as ReduxDevToolsExtension | undefined;
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
```

**Applies to:** Any NgRx Signals store in this workspace that needs Redux DevTools integration.

---

## L008 — Public-API directives need a matching ESLint selector prefix — override the `lib` default

**Date:** 2026-05-01
**Phase:** Phase 2 — `canvas-platform-auth`
**Rule:** When a library exposes structural directives whose selectors form part of the public API (e.g. `*hasPermission`, `*hasRole`), change the `@angular-eslint/directive-selector` prefix in `eslint.config.mjs` from `'lib'` to `['has']` (or whatever the intended prefix is).

**Why:**
The Nx generator scaffolds all libraries with `prefix: 'lib'`. This is correct for internal directives but wrong for directives that consumers use by name. Leaving it as `'lib'` causes a lint error on every directive whose selector does not start with `lib`.

**Pattern:**
```javascript
// eslint.config.mjs — change for the specific library only
'@angular-eslint/directive-selector': [
  'error',
  { type: 'attribute', prefix: ['has'], style: 'camelCase' },
],
```

**Applies to:** Any library that ships public-API directives with a non-`lib` selector prefix.

---

## L009 — `@nx/dependency-checks` short-circuits when a workspace lib is in your imports

**Date:** 2026-05-01
**Phase:** Phase 2 — `canvas-platform-auth`, `canvas-platform-state`
**Rule:** When a publishable library imports from a sibling workspace lib (resolved via tsconfig paths), add all of its `peerDependencies` entries to `ignoredDependencies` in `eslint.config.mjs`.

**Why:**
The `@nx/dependency-checks` scanner resolves imports by following tsconfig path aliases. When it encounters a workspace path alias (e.g. `@pervaxis/canvas-mfe-contracts → libs/mfe/contracts/src/index.ts`), the scanner short-circuits and stops cataloguing **any** imports from that transitive path — meaning all real Angular/RxJS/NgRx imports in the library are also missed. The rule then incorrectly flags every `peerDependency` as "not used".

**Template to add:**
```javascript
ignoredDependencies: [
  '@angular/core',
  '@angular/common',
  '@angular/router',
  '@pervaxis/canvas-mfe-contracts',
  // + any other peerDep that the scanner misses
],
```

This is a workaround — the actual peer dependencies are correct; only the scanner is wrong.

**Applies to:** Any Canvas library that imports from `@pervaxis/canvas-mfe-contracts` or another sibling workspace lib.

---

## L010 — `npx nx reset` required after adding a new library for inferred targets to appear

**Date:** 2026-05-01
**Phase:** Phase 2 — `canvas-platform-error`
**Rule:** After generating a new library, always run `npx nx reset` before attempting `nx test <lib-name>` for the first time. The test target is inferred from `vite.config.mts` by the Nx Vite plugin, but the project graph is cached from before the library existed.

**Why:**
Nx caches the project graph on disk. A freshly generated library's `vite.config.mts` is not visible to the Vite plugin until the cache is invalidated. Without a reset, `nx test <new-lib>` fails with "Cannot find configuration for task".

**Command:** `npx nx reset`

**Applies to:** Every new library generation in this workspace, specifically before the first `nx test` or `nx lint` run.
