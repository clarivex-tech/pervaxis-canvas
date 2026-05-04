# Pervaxis.Canvas — Session Log

A running record of what was built each session, key decisions made, and what comes next.

---

## Session 1 — 2026-04-30

**Branch:** `feature/Phase-I`
**Phase:** Phase 1 — Foundation
**PR:** #1

**Completed:**
- Nx workspace scaffold with Angular 18, strict TypeScript, ESLint flat config
- `tsconfig.base.json` path aliases for all 14 planned libraries
- `sonar-project.properties` and `.github/workflows/pr-check.yml`
- GitHub Packages npm registry configuration
- `.claude/CLAUDE.md`, `.claude/guides/GIT_WORKFLOW.md`, `CANVAS_PACKAGES_COMPLIANCE.md`
- `documents/canvas/Blueprint.md`, `Specifications.md`, `overview.md`

**Key decisions:**
- Vitest + AnalogJS over Jest — better ESM/signal support, faster cold starts
- Standalone components only — no NgModules anywhere in the codebase
- All shared types in `canvas-mfe-contracts` only — enforced by ESLint module boundaries

---

## Session 2 — 2026-05-01

**Branch:** `feature/Phase-II`
**Phase:** Phase 2 — Platform Libraries
**PRs:** #3, #5

**Completed (26/26 tasks):**
- `canvas-mfe-contracts` — shared types, InjectionTokens, event bus contracts
- `canvas-platform-http` — retry interceptor, timeout interceptor, error normaliser
- `canvas-platform-auth` — AuthContextService, HasPermissionDirective, HasRoleDirective, CANVAS_TOKEN_STORAGE
- `canvas-platform-state` — NgRx Signals configuration, withCanvasDevTools bridge
- `canvas-platform-error` — GlobalErrorHandler, ErrorBoundaryComponent, CanvasErrorService
- `canvas-platform-i18n` — Transloco configuration, LocaleSwitcherComponent

**Key decisions:**
- `vi.useFakeTimers()` over Angular `fakeAsync` — ProxyZone not available in AnalogJS/Vitest (L001)
- `withCanvasDevTools` custom implementation — `@ngrx/signals/devtools` does not exist in v21 (L007)
- `tsconfig.lib.prod.json` dist path override for sibling workspace lib builds (L006)
- `ignoredDependencies` in eslint for libraries that import from workspace path aliases (L009)

**Challenges resolved:** C001–C010

---

## Session 3 — 2026-05-02

**Branch:** `feature/Phase-III`
**Phase:** Phase 3 — Shell Libraries
**PR:** #7

**Completed (16/16 tasks):**
- `canvas-shell-core` — bootstrap, runtime config loader, MFE host, RemoteManifestLoaderService, AppInitializerFactory, FederationBootstrap
- `canvas-shell-routing` — DynamicRouteRegistrar, MFE route registration from manifests
- `canvas-shell-auth` — OIDC flow (angular-oauth2-oidc), JWT interceptor, silent refresh, CapacitorOidcService stub
- `canvas-shell-layout` — RootLayoutComponent, NavigationComponent, SidebarComponent, BreadcrumbComponent

**Key decisions:**
- `@angular/router` added as explicit peerDependency — Nx dependency-checks requires it even for transitive Angular deps when workspace path aliases are used
- Shell libraries depend on each other in a strict layered order: core → routing → auth → layout

---

## Session 4 — 2026-05-02

**Branch:** `feature/Phase-IV`
**Phase:** Phase 4 — MFE Libraries
**PR:** #9

**Completed (12/12 tasks):**
- `canvas-mfe-bootstrap` — standalone MFE bootstrap helpers, provideCanvasMfe(), zone configuration
- `canvas-mfe-contracts` — extended with MFE lifecycle events, RemoteManifest type, CANVAS_MFE_CONFIG token
- `canvas-mfe-testing` — MfeTestHarness, mock shell providers, MockAuthContextService

---

## Session 5 — 2026-05-03 (morning)

**Branch:** `feature/Phase-V`
**Phase:** Phase 5 — Component Libraries
**PR:** #11

**Completed (20/20 tasks):**
- `canvas-components-web`:
  - Design tokens and SCSS mixins
  - PageComponent, SectionComponent, DataViewComponent
  - FormEngineComponent + CanvasFormControlComponent (schema-driven)
  - CanvasGridComponent (ag-Grid v33) + TextCellEditorComponent + BadgeCellRendererComponent
  - CanvasChartComponent (ECHARTS_INIT DI token) + Bar/Line/Pie/GaugeChartComponent
  - 50 tests passing
- `canvas-components-mobile`:
  - Mobile design tokens
  - MobileListComponent (pull-to-refresh, infinite scroll)
  - MobileFormComponent (same FormSchema contract as web)
  - MobileChartComponent (MOBILE_ECHARTS_INIT DI token)
  - MobileNavService (NavController wrapper)
  - 36 tests passing

**Key decisions:**
- ECHARTS_INIT DI token pattern — `vi.mock()` cannot intercept dynamic `await import()` (L011)
- `function Stub()` for constructor polyfills — `vi.fn()` is not constructable (L012)
- `server.deps.inline` + `deps.inline` both required for `@ionic/core` ESM/CJS hybrid (L013)
- Migrated `@nx/vite:test` → `@nx/vitest:test` executor (L014)

**Challenges resolved:** C011–C014

---

## Session 6 — 2026-05-03 (afternoon/evening)

**Branch:** `feature/Phase-VI`
**Phase:** Phase 6 — Mobile (Ionic/Capacitor) Integration
**PR:** #13

**Completed:**
- `canvas-shell-core` — PushNotificationService, DeepLinkService, MobilePlatformService
- `canvas-platform-auth` — CANVAS_TOKEN_STORAGE with Keychain/EncryptedSharedPreferences on native via `@capacitor/preferences`
- `canvas-platform-http` — NetworkService + offlineInterceptor (reactive online/offline signal)
- `canvas-shell-auth` — CapacitorOidcService (OIDC code flow via Capacitor Browser), CANVAS_BROWSER_OPEN DI token
- `apps/canvas-mobile-ref` — Full Ionic Angular reference app (HomePage, LoginPage, AppComponent wiring all services)
- `.github/workflows/ios.yml` — iOS CI pipeline (build + xcpretty)
- `.github/workflows/android.yml` — Android CI pipeline (Gradle assembleDebug)
- `documents/canvas/capacitor-compatibility.md` — plugin matrix, offline strategy, secure storage guide
- 170 tests passing across 4 affected libraries

**CI fix cascade (8 fixes across 4 commits):**
1. Missing Capacitor `peerDependencies` in 4 library `package.json` files
2. Missing `type:app` constraint in `eslint.config.mjs`
3. Unused `beforeEach` import in `offline.interceptor.spec.ts`
4. `@capacitor/android`/`@capacitor/ios` not installed before `cap sync`
5. `passWithNoTests: true` missing in `canvas-mobile-ref` vitest config
6. `@capacitor/android@^6.0.0` version pin (v8 requires core ^8, workspace has v6)
7. Java 17 → 21 for Android (Capacitor 6 requires Java 21)
8. `gem install xcpretty` explicit step for iOS (not pre-installed on macOS runners)

**All 4 CI checks green on PR #13.**

**Key decisions:**
- All Capacitor plugins declared as `peerDependencies` — enforced by `@nx/dependency-checks` (L015)
- `type:app` depConstraint required for any app in this workspace (L016)
- Capacitor platform packages installed in CI, not in root `package.json` (L017)

**Challenges resolved:** C015–C020

**Outstanding (tracked in Phase 10):**
- SonarCloud shows 0% coverage — need `reporter: ['lcov']` in all library vite configs (L021)

---

## What's Next

**Phase 7 — Registry Service** (`feature/Phase-VII`)
- `canvas-registry` — central service registry, plugin registration, runtime capability discovery
- See `Blueprint.md` Phase 7 for full checklist
