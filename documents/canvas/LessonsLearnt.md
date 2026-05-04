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

---

## L011 — `vi.mock()` cannot intercept dynamic `await import()` inside component methods

**Date:** 2026-05-03
**Phase:** Phase 5 — `canvas-components-web` (ECharts)
**Rule:** Never rely on `vi.mock('some-module')` to intercept a dynamic `await import('some-module')` call inside an async component method. Use a DI token instead so tests can inject a mock factory.

**Why:**
`vi.mock()` hoists to the top of the test file and intercepts static ES module imports. It does **not** intercept `await import(...)` calls that happen inside async functions at runtime — those execute after the module graph is already resolved. The component's `ngOnInit` called `await import('echarts')` at runtime, which bypassed the mock entirely.

**Pattern:**
```typescript
// Define a DI token
export const ECHARTS_INIT = new InjectionToken<typeof import('echarts').init>('ECHARTS_INIT');

// Component uses the token
const init = inject(ECHARTS_INIT);

// Tests provide a mock via the token — no vi.mock() needed
{ provide: ECHARTS_INIT, useValue: mockInitFn }
```

**Applies to:** Any component that lazy-loads a heavy library via dynamic import (ECharts, ag-Grid, etc.).

---

## L012 — `vi.fn().mockImplementation()` returns a non-constructable function — use `function Stub()` for class polyfills

**Date:** 2026-05-03
**Phase:** Phase 5 — `canvas-components-web`
**Rule:** When polyfilling a browser constructor (e.g. `ResizeObserver`) in tests, define it as a plain `function Stub() {}` with methods on its prototype. Never use `vi.fn()` — arrow functions and `vi.fn()` return values cannot be called with `new`.

**Why:**
`vi.fn()` wraps the mock in an arrow function under the hood. Arrow functions do not have a `prototype` property in the way regular functions do, so `new vi.fn()` throws `TypeError: X is not a constructor`.

**Pattern:**
```typescript
function ResizeObserverStub(cb: ResizeObserverCallback) { this._cb = cb; }
ResizeObserverStub.prototype.observe = vi.fn();
ResizeObserverStub.prototype.unobserve = vi.fn();
ResizeObserverStub.prototype.disconnect = vi.fn();
(globalThis as any).ResizeObserver = ResizeObserverStub;
```

**Applies to:** Any test that needs a constructor polyfill for a browser API not available in jsdom.

---

## L013 — `@ionic/core` CJS/ESM hybrid requires explicit inlining in both `server.deps` and `deps` in Vitest config

**Date:** 2026-05-03
**Phase:** Phase 5 — `canvas-components-mobile`
**Rule:** When testing any library that imports from `@ionic/core` or `@ionic/angular`, configure **both** `test.server.deps.inline` and `test.deps.inline` to include all `@ionic/*` and `@capacitor/*` packages.

**Why:**
`@ionic/core` ships as a CJS package that contains ESM files internally (a hybrid format). Vitest's default module resolver cannot handle this combination in the jsdom environment — it fails with `SyntaxError: Cannot use import statement in a CommonJS module`. Inlining forces Vitest to bundle and transform the package through its own pipeline instead of Node's native require.

**Config to add:**
```typescript
test: {
  server: { deps: { inline: ['@ionic/core', '@ionic/angular', /@ionic/, '@capacitor/core', /@capacitor/] } },
  deps:   { inline: [/@ionic/, /@capacitor/] },
}
```

**Applies to:** Every library that imports Ionic or Capacitor packages in its source or tests.

---

## L014 — Use `@nx/vitest:test` executor, not the deprecated `@nx/vite:test`

**Date:** 2026-05-03
**Phase:** Phase 5 — `canvas-components-mobile`
**Rule:** Always generate new libraries with the `@nx/vitest:test` executor. If an existing library uses `@nx/vite:test`, migrate it.

**Why:**
`@nx/vite:test` is deprecated and will be removed in Nx 23. CI prints a deprecation warning on every run. The replacement `@nx/vitest:test` is a drop-in change in `project.json` — the options are identical.

**Migration:**
```json
// project.json — change executor only
"test": {
  "executor": "@nx/vitest:test"
}
```

---

## L015 — Capacitor plugin packages must be listed in `peerDependencies` of any library that imports them

**Date:** 2026-05-03
**Phase:** Phase 6 — Mobile integration
**Rule:** Whenever a Canvas library imports from `@capacitor/core`, `@capacitor/network`, `@capacitor/preferences`, `@capacitor/app`, or `@capacitor/push-notifications`, those packages must be listed in `peerDependencies` in the library's `package.json`.

**Why:**
The `@nx/dependency-checks` ESLint rule inspects all source imports and cross-references them against `peerDependencies`. Capacitor packages are external runtime dependencies — they must be declared as peer deps, not assumed to be provided by the workspace. Omitting them produces a lint error that blocks CI.

**Applies to:** `canvas-platform-auth`, `canvas-platform-http`, `canvas-shell-core`, `canvas-shell-auth`, and any future library that integrates with Capacitor.

---

## L016 — Nx apps need an explicit `type:app` depConstraint in `eslint.config.mjs` to import libraries

**Date:** 2026-05-03
**Phase:** Phase 6 — `canvas-mobile-ref`
**Rule:** When adding an Nx application to the workspace, always add a matching `sourceTag: 'type:app'` entry to the `depConstraints` array in the root `eslint.config.mjs`. Without it, the `@nx/enforce-module-boundaries` rule blocks all library imports from that app.

**Why:**
`@nx/enforce-module-boundaries` evaluates every import against the `depConstraints` array. If none of the project's tags match any `sourceTag` in the config, the rule applies the default deny-all policy — the project cannot import from any library. The app's `project.json` had `"tags": ["type:app", "scope:mobile"]` but neither tag had a matching `sourceTag` constraint in `eslint.config.mjs`.

**Entry to add:**
```javascript
{
  sourceTag: 'type:app',
  onlyDependOnLibsWithTags: ['scope:contracts', 'scope:platform', 'scope:shell', 'scope:mfe', 'scope:components'],
}
```

**Applies to:** Every application added to this workspace.

---

## L017 — `@capacitor/android` and `@capacitor/ios` are not workspace dependencies — install them explicitly in CI before `cap sync`

**Date:** 2026-05-03
**Phase:** Phase 6 — Android/iOS CI
**Rule:** In CI workflows that run `npx cap sync android` or `npx cap sync ios`, add an explicit `npm install @capacitor/android@^6.0.0` / `npm install @capacitor/ios@^6.0.0 --legacy-peer-deps` step **before** the `cap add`/`cap sync` step.

**Why:**
`npx cap sync` requires the platform package to be installed in `node_modules`. These packages are intentionally excluded from the root `package.json` because they are native artifacts, not consumed by the Angular build. The CI runner's `npm ci` does not install them. Without a prior `npm install`, `cap add android` exits with "Could not find the android platform."

**Version pinning:** Pin to the same major version as `@capacitor/core` in the workspace. Installing without a version specifier fetches the latest (v8 at time of writing), which requires `@capacitor/core@^8` and breaks the peer dependency resolution if the workspace is on v6.

---

## L018 — Capacitor 6 Android requires Java 21 — not Java 17

**Date:** 2026-05-03
**Phase:** Phase 6 — Android CI
**Rule:** Set `java-version: '21'` in the `actions/setup-java` step for any CI workflow that runs an Android Gradle build against a Capacitor 6 project.

**Why:**
The Android project generated by `npx cap add android` with Capacitor 6 sets `sourceCompatibility = JavaVersion.VERSION_21` in the Gradle build files. Compiling with Java 17 (the previous default) causes Gradle to exit with `error: invalid source release: 21`.

---

## L019 — `xcpretty` is not pre-installed on macOS GitHub runners — install it explicitly

**Date:** 2026-05-03
**Phase:** Phase 6 — iOS CI
**Rule:** Add `gem install xcpretty` as an explicit CI step before any `xcodebuild ... | xcpretty` command. Do not rely on `bundler-cache: true` unless a `Gemfile` exists in the working directory.

**Why:**
The macOS GitHub runner does not have `xcpretty` pre-installed. `bundler-cache: true` on `ruby/setup-ruby` only installs gems from a `Gemfile` — without one it is a no-op. Running `xcodebuild | xcpretty` with `xcpretty` absent causes the pipe to fail immediately with exit code 127 (command not found). Also use `set -o pipefail` so the pipeline's exit code reflects xcodebuild's result, not xcpretty's.

---

## L020 — Vitest exits with code 1 when no test files are found — add `passWithNoTests: true` for app projects

**Date:** 2026-05-03
**Phase:** Phase 6 — `canvas-mobile-ref`
**Rule:** Add `passWithNoTests: true` to the `test` config in `vite.config.mts` for any Nx application project that does not have unit test files.

**Why:**
Vitest exits with a non-zero exit code by default when the `include` glob matches no files. App projects (as opposed to library projects) often have no unit tests — their behaviour is covered by E2E tests. Without `passWithNoTests: true`, the `nx run-many --target=test` step fails the entire CI run even though there is nothing wrong.

---

## L021 — SonarCloud shows 0% coverage unless `reporter: ['lcov']` is set in Vitest coverage config

**Date:** 2026-05-03
**Phase:** Phase 6 / Phase 10 — SonarCloud integration
**Rule:** Add `coverage: { provider: 'v8', reporter: ['lcov', 'text'] }` to every library's `vite.config.mts`. Without the `lcov` reporter, running `nx test --coverage` only produces terminal text output — no `lcov.info` files are written, so SonarCloud reads nothing and reports 0%.

**Why:**
SonarCloud's coverage ingestion reads LCOV format files at the paths configured in `sonar.javascript.lcov.reportPaths`. Vitest's `--coverage` CLI flag enables coverage collection but uses the `text` reporter by default (terminal only). Unless `reporter: ['lcov']` is explicitly set, no `lcov.info` file is ever written to disk.

**Config to add to every `vite.config.mts`:**
```typescript
test: {
  coverage: {
    provider: 'v8',
    reporter: ['lcov', 'text'],
    reportsDirectory: '../../coverage/libs/<category>/<name>',
  },
}
```

**Status:** Tests exist and pass at 90%+ per library. This is a reporter config task tracked in Phase 10.

---

## L022 — CI failures cascade — each layer hides the next; fix methodically from the top

**Date:** 2026-05-03
**Phase:** Phase 6 — PR 13 CI
**Rule:** When multiple CI checks fail simultaneously, fix one layer at a time starting with lint/build, then test, then native toolchain. Never attempt to guess what is behind a deeper failure until the shallower one is cleared — the next layer only becomes visible after the previous one is resolved.

**Why:**
PR 13 had 8 distinct failures across 4 CI jobs, none of which were visible simultaneously. Fixing missing `peerDependencies` revealed the missing ESLint constraint. Fixing that revealed the missing Capacitor install step. Fixing that revealed the version mismatch. Fixing that revealed the Java version. Each commit cleared one layer and exposed the next. Trying to fix them all speculatively without reading each error message would have introduced more confusion than it resolved.
