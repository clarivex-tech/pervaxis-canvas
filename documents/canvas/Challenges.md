# Pervaxis.Canvas — Challenges

Each entry documents a specific technical obstacle encountered during development — the symptom, the root cause, and the resolution. Use this as a project-specific runbook before diving into debugging.

---

## C001 — `fakeAsync` throws "Expected to be running in ProxyZone"

**Date:** 2026-05-01
**Phase:** Phase 2 — `canvas-platform-http`
**Library:** `canvas-platform-http` test suite
**Symptom:** Tests using Angular's `fakeAsync()` wrapper failed immediately with:
```
Error: Expected to be running in 'ProxyZone', but it was not found.
```

**Root Cause:**
Angular's `fakeAsync` helper (from `@angular/core/testing`) requires each test to execute inside an active ProxyZone. In Angular's Karma or Jest Zone runner, a ProxyZone is created automatically around each test. AnalogJS's `@analogjs/vitest-angular` sets up Zone.js (`zoneless: false`) but does not create a ProxyZone for each Vitest test. Adding `zone.js/testing` to the setup file made Zone.js available but still did not wrap tests in a ProxyZone, so `fakeAsync` continued to fail.

**Resolution:**
Replaced all `fakeAsync` / `tick` calls with Vitest's native fake timer API:
```typescript
vi.useFakeTimers();
await vi.advanceTimersByTimeAsync(ms);
vi.useRealTimers();
```
Vitest's fake timers patch `setTimeout` / `setInterval` at the global level, which RxJS's `timer()` and `timeout()` operators use internally. This works correctly in the AnalogJS Vitest environment.

**See also:** L001 in `LessonsLearnt.md`

---

## C002 — `Zone is not defined` when importing `zone.js/testing` before `zone.js` core

**Date:** 2026-05-01
**Phase:** Phase 2 — `canvas-platform-http`
**Library:** `canvas-platform-http` test setup
**Symptom:** After adding `import 'zone.js/testing'` to `test-setup.ts`, all 5 test suites failed with:
```
ReferenceError: Zone is not defined
    at rollupTesting (zone-testing.js:1988:15)
```

**Root Cause:**
`zone.js/testing` calls `rollupTesting(Zone)` at module evaluation time, which requires the `Zone` global to already exist. In the original setup, `@analogjs/vitest-angular/setup-testbed` loaded Zone.js core as a side effect. When `zone.js/testing` was inserted before that import in source order, ES module evaluation ran `zone.js/testing` before Zone.js core had defined the `Zone` global.

**Resolution:**
Adding an explicit `import 'zone.js'` before `import 'zone.js/testing'` resolved the `Zone is not defined` error. However, `fakeAsync` still failed with the ProxyZone error (C001), so this approach was ultimately abandoned in favour of Vitest fake timers. The test-setup was reverted to its original state without any zone testing import.

**Current test-setup.ts:**
```typescript
import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';

setupTestBed({ zoneless: false });
```

---

## C003 — `TestBed.overrideProvider` fails after first `TestBed.inject` call

**Date:** 2026-05-01
**Phase:** Phase 2 — `canvas-platform-http`
**Library:** `canvas-platform-http` retry interceptor tests
**Symptom:** A test that called `TestBed.overrideProvider(CANVAS_HTTP_CONFIG, { useValue: {...} })` threw:
```
Error: Cannot override provider when the test module has already been instantiated.
Make sure you are not using `inject` before `overrideProvider`.
```

**Root Cause:**
Angular's TestBed compiles (instantiates) the test module the first time any token is injected — typically in `beforeEach` via `TestBed.inject(HttpClient)`. After that point, `overrideProvider` is rejected. The failing test tried to override the config after the module was already compiled by the shared `beforeEach`.

**Resolution:**
Extracted the test requiring a different config into its own `describe` block with a dedicated `beforeEach` that provides the desired config value from the start — no override needed.

**See also:** L002 in `LessonsLearnt.md`

---

## C004 — Nx lint flags vite/analogjs imports as missing `peerDependencies`

**Date:** 2026-05-01
**Phase:** Phase 2 — `canvas-platform-http`
**Library:** `canvas-platform-http` (publishable)
**Symptom:** `nx lint canvas-platform-http` failed with:
```
The "canvas-platform-http" project uses the following packages, but they are missing from "peerDependencies":
  - rxjs
  - vite
  - @analogjs/vite-plugin-angular
  - @nx/vite
```

**Root Cause:**
The `@nx/dependency-checks` ESLint rule scans **all** files in the library including `vite.config.mts` and `src/test-setup.ts`. These test-infrastructure files import `vite`, `@analogjs/vite-plugin-angular`, and `@nx/vite` — packages that should never be in a published library's `peerDependencies`. The rule also correctly flagged `rxjs` as missing from `peerDependencies`.

**Resolution:**
Two changes to `libs/platform/http/eslint.config.mjs`:
1. Added `rxjs: ">=7.8.0"` to `peerDependencies` in `package.json` (correct — consumers must provide rxjs)
2. Added test/config files to `ignoredFiles` in the `@nx/dependency-checks` rule so vite tooling is not scanned

**See also:** L005 in `LessonsLearnt.md`

---

## C005 — SonarCloud quality gate blocks first PR merge

**Date:** 2026-04-30
**Phase:** Phase 1 — Foundation
**Symptom:** The `pr-check.yml` workflow with `qualitygate.wait=true` would block the very first PR because SonarCloud has no baseline to compare against on a brand-new project — the quality gate cannot pass when no prior analysis exists.

**Root Cause:**
SonarCloud's quality gate evaluation requires a baseline analysis. On a project with no prior scans, there is nothing to diff against, so the gate either times out or fails.

**Resolution:**
Set `qualitygate.wait=false` in `pr-check.yml` for the first merge to bootstrap the SonarCloud project with an initial analysis. After that first merge, flip back to `qualitygate.wait=true` so subsequent PRs are properly gated. See `.claude/guides/ci-sonarcloud-setup.md` for step-by-step instructions.

---

## C006 — ng-packagr `TS6059: File is not under rootDir` when importing from a sibling workspace lib

**Date:** 2026-05-01
**Phase:** Phase 2 — `canvas-platform-auth`
**Library:** `canvas-platform-auth` build
**Symptom:** `npx nx build canvas-platform-auth` failed with:
```
TS6059: File '...libs/mfe/contracts/src/lib/interfaces/auth-context.interface.ts'
is not under 'rootDir' '...libs/platform/auth/src'.
```

**Root Cause:**
ng-packagr's production build (`compilationMode: partial`) enforces that all compiled files must be inside `rootDir` (the library's own `src/` folder). The tsconfig path alias `@pervaxis/canvas-mfe-contracts` resolved to `libs/mfe/contracts/src/` via `tsconfig.base.json`, pulling files from outside `rootDir` into the compilation.

**Resolution:**
Added a `paths` override in `libs/platform/auth/tsconfig.lib.prod.json` that remaps `@pervaxis/canvas-mfe-contracts` to the **pre-built dist output** (`dist/libs/mfe/contracts`) instead of the source tree. TypeScript resolves the dist via its `package.json` typings field, which stays outside the auth lib's `rootDir`.

**Pattern to apply to every new publishable lib that imports a sibling Canvas lib:**
```json
// tsconfig.lib.prod.json
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

**See also:** L006 in `LessonsLearnt.md`

---

## C007 — `Cannot find module '@ngrx/signals/devtools'` in v21

**Date:** 2026-05-01
**Phase:** Phase 2 — `canvas-platform-state`
**Library:** `canvas-platform-state`
**Symptom:** Importing `withDevtools` from `@ngrx/signals/devtools` caused:
```
Cannot find module '@ngrx/signals/devtools' or its corresponding type declarations.
```

**Root Cause:**
`@ngrx/signals` v21.1.0 does not ship a `devtools` sub-entry-point. The package was released before that integration was stabilised, so `withDevtools` simply does not exist in this version.

**Resolution:**
Implemented `withCanvasDevTools(name)` as a custom `signalStoreFeature` that bridges to the Redux DevTools Extension global (`__REDUX_DEVTOOLS_EXTENSION__`) using `withHooks.onInit`, `getState`, and `watchState` — all of which are available in v21.

**File:** `libs/platform/state/src/lib/devtools/devtools.ts`
**See also:** L007 in `LessonsLearnt.md`

---

## C008 — `@nx/dependency-checks` flags all peerDependencies as "not used" when a workspace lib is imported

**Date:** 2026-05-01
**Phase:** Phase 2 — `canvas-platform-auth`, `canvas-platform-state`
**Libraries:** `canvas-platform-auth`, `canvas-platform-state`
**Symptom:** `nx lint canvas-platform-auth` reported every peerDependency as missing or unused:
```
The "canvas-platform-auth" project uses the following packages, but they are missing from "peerDependencies":
  - @angular/core
  - @angular/router
  - @pervaxis/canvas-mfe-contracts
```
...despite all three being correctly listed in `package.json`.

**Root Cause:**
The `@nx/dependency-checks` scanner follows tsconfig path aliases to resolve imports. When it hits `@pervaxis/canvas-mfe-contracts → libs/mfe/contracts/src/index.ts`, it enters a workspace-local resolution path and short-circuits — abandoning the scan for all further imports in that file and its descendants. This causes the scanner to not register `@angular/core`, `@angular/router`, or `@pervaxis/canvas-mfe-contracts` as "used", even though they clearly are.

**Resolution:**
Added all affected packages to `ignoredDependencies` in the library's `eslint.config.mjs`. This suppresses the false-positive without removing the actual peerDependency entries from `package.json`.

**See also:** L009 in `LessonsLearnt.md`

---

## C009 — `@angular-eslint/directive-selector` rejects public-API selector names

**Date:** 2026-05-01
**Phase:** Phase 2 — `canvas-platform-auth`
**Library:** `canvas-platform-auth`
**Symptom:** Lint failed on `HasPermissionDirective` and `HasRoleDirective`:
```
The selector of the directive "HasPermissionDirective" should be prefixed with "lib" (https://angular.io/guide/styleguide#style-02-08)
```

**Root Cause:**
The Nx generator sets `prefix: 'lib'` for all directive selectors. The auth library's public-API directives are named `*hasPermission` and `*hasRole` — the intended consumer-facing selectors start with `has`, not `lib`.

**Resolution:**
Changed the `@angular-eslint/directive-selector` prefix in `libs/platform/auth/eslint.config.mjs` from `'lib'` to `['has']`. This scopes the change to the auth library only, so other libraries retain their `lib` prefix.

**See also:** L008 in `LessonsLearnt.md`

---

## C010 — New library's inferred `test` target not found until Nx cache is cleared

**Date:** 2026-05-01
**Phase:** Phase 2 — `canvas-platform-error`
**Library:** `canvas-platform-error`
**Symptom:** Immediately after generating the library and running `nx test canvas-platform-error`:
```
NX  Cannot find configuration for task canvas-platform-error:test
```

**Root Cause:**
The `test` target for Angular libraries with a `vite.config.mts` is **inferred** by the `@nx/vite/plugin` (not declared in `project.json`). The Nx project graph is cached on disk from before the new library existed. The fresh `vite.config.mts` is not scanned until the cache is invalidated, so the inferred `test` target is absent.

**Resolution:**
```bash
npx nx reset
```
After the reset, `nx show project canvas-platform-error` correctly listed the inferred `test` target and `nx test canvas-platform-error --coverage` ran normally.

**See also:** L010 in `LessonsLearnt.md`
