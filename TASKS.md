# Pervaxis Canvas — Task Tracker

## Phase 3 — Shell Libraries ✅ Completed 2026-05-02

### canvas-shell-core
- [x] EnvironmentConfigService (signal-based, loads `/assets/config.json`) ✅
- [x] RemoteManifestLoader (signal-based, fetches MfeManifest[]) ✅
- [x] appInitializerFactory (APP_INITIALIZER, chains config + manifest load) ✅
- [x] buildFederationManifest helper ✅
- [x] provideCanvasCore() entry point ✅
- [x] Tests: 33 tests, 100% coverage ✅
- [x] Build: zero warnings ✅

### canvas-shell-routing
- [x] ShellRoutingService (registerMfeRoutes via CANVAS_MFE_MODULE_LOADER token) ✅
- [x] CanvasNotFoundComponent (CSS token-styled 404) ✅
- [x] provideCanvasRouting() entry point ✅
- [x] Tests: 17 tests, 100% coverage ✅
- [x] Build: zero warnings ✅

### canvas-shell-auth
- [x] ShellAuthService (OIDC via angular-oauth2-oidc, silent refresh, login/logout) ✅
- [x] jwtInterceptor (functional, injects Bearer token) ✅
- [x] provideCanvasAuth() entry point ✅
- [x] Tests: 23 tests, 100% coverage ✅
- [x] Build: zero warnings ✅

### canvas-shell-layout
- [x] NavItem + Breadcrumb types ✅
- [x] BreadcrumbService (NavigationEnd listener, route data['breadcrumb']) ✅
- [x] NavigationComponent (RouterLink/RouterLinkActive, nested children) ✅
- [x] SidebarComponent (collapsible, toggle output) ✅
- [x] HeaderComponent (breadcrumbs, sidebar toggle, content projection) ✅
- [x] ShellLayoutComponent (CSS Grid, sidebarCollapsed signal, RouterOutlet) ✅
- [x] provideCanvasLayout() entry point ✅
- [x] Tests: 47 tests, 100% coverage ✅
- [x] Build: zero warnings ✅

---

## Phase 5 — Component Libraries ✅ Completed 2026-05-03

### canvas-components-web
- [x] Design tokens (`_canvas-tokens.scss`) + SCSS mixins (`_canvas-mixins.scss`) ✅
- [x] `PageComponent` (title, subtitle, header-actions slot) ✅
- [x] `SectionComponent` (card with optional title, description, actions slot) ✅
- [x] `DataViewComponent` (loading overlay, empty state) ✅
- [x] Form types + validators (`form-types.ts`, `form-validators.ts`) ✅
- [x] `CanvasFormControlComponent` (single reactive control renderer) ✅
- [x] `FormEngineComponent` (schema-driven full form with submit) ✅
- [x] `CanvasGridComponent` (ag-Grid v33 wrapper with Canvas theme defaults) ✅
- [x] `TextCellEditorComponent` (inline ag-Grid text editor) ✅
- [x] `BadgeCellRendererComponent` (colour-coded badge renderer) ✅
- [x] `CanvasChartComponent` (ECharts base with `ECHARTS_INIT` DI token + ResizeObserver) ✅
- [x] `BarChartComponent`, `LineChartComponent`, `PieChartComponent`, `GaugeChartComponent` ✅
- [x] `tsconfig.base.json` path alias `@pervaxis/canvas-components-web` ✅
- [x] Tests: 50 tests, all passing ✅
- [x] Lint: zero errors ✅

### canvas-components-mobile
- [x] Mobile design tokens (`_canvas-mobile-tokens.scss`) ✅
- [x] `MobileListComponent` (ion-list + pull-to-refresh + infinite scroll) ✅
- [x] `MobileFormComponent` (Ionic form with same `FormSchema` contract) ✅
- [x] `MobileChartComponent` (ECharts mobile wrapper with `MOBILE_ECHARTS_INIT` token) ✅
- [x] `MobileNavService` (NavController wrapper — tab nav + stack push/pop) ✅
- [x] `tsconfig.base.json` path alias `@pervaxis/canvas-components-mobile` ✅
- [x] Tests: 36 tests, all passing ✅
- [x] Lint: zero errors ✅

---

## Phase 6 — Mobile (Ionic) Integration ✅ Completed 2026-05-03

### canvas-shell-core additions
- [x] `MobilePlatformService` — detects iOS/Android/web via Capacitor at bootstrap ✅
- [x] `PushNotificationService` — Capacitor Push Notifications wrapper with permission flow ✅
- [x] `DeepLinkService` — Capacitor App `appUrlOpen` → Angular Router ✅
- [x] Tests: 17 new tests (48 total in canvas-shell-core) ✅

### canvas-platform-auth additions
- [x] `CanvasTokenStorage` interface + `CANVAS_TOKEN_STORAGE` InjectionToken ✅
- [x] `WebTokenStorage` (sessionStorage) + `CapacitorTokenStorage` (Keychain/EncryptedSharedPreferences) ✅
- [x] `provideCapacitorTokenStorage()` helper ✅
- [x] Tests: 6 new tests (47 total in canvas-platform-auth) ✅

### canvas-shell-auth additions
- [x] `CapacitorOidcService` — OIDC flow via Capacitor Browser on native, redirect on web ✅
- [x] `CANVAS_BROWSER_OPEN` InjectionToken (swappable in tests) ✅
- [x] Tests: 6 new tests (29 total in canvas-shell-auth) ✅

### canvas-platform-http additions
- [x] `NetworkService` — reactive `isOnline` signal (Capacitor Network on native, `navigator.onLine` on web) ✅
- [x] `offlineInterceptor` — blocks HTTP requests with `NETWORK_OFFLINE` `CanvasHttpError` when offline ✅
- [x] Tests: 9 new tests (46 total in canvas-platform-http) ✅

### canvas-mobile-ref reference app
- [x] `apps/canvas-mobile-ref/` — full Ionic Angular app consuming all Canvas platform libs ✅
- [x] `AppComponent` — initialises DeepLinkService and PushNotificationService ✅
- [x] `HomePage` — MobileChartComponent, platform/network signal display ✅
- [x] `LoginPage` — CapacitorOidcService login flow ✅
- [x] `capacitor.config.ts` — AppId, webDir, PushNotifications config ✅

### CI pipelines
- [x] `.github/workflows/ios.yml` — macOS, Capacitor sync, CocoaPods, xcodebuild ✅
- [x] `.github/workflows/android.yml` — ubuntu, Capacitor sync, Gradle assembleDebug ✅

### Documentation
- [x] `documents/canvas/capacitor-compatibility.md` — plugin matrix, setup guides, offline + storage strategy ✅

---

## Phase 7 — Registry Service ✅ Completed 2026-05-04

### canvas-shell-core additions
- [x] `RegistryConfig` + `RegistryResponse` interfaces + `CANVAS_REGISTRY_CONFIG` InjectionToken (`registry.types.ts`) ✅
- [x] `RegistryClientService` — GET/POST/DELETE API client with signal-based caching, `retry(2)`, and `/assets/registry.json` fallback ✅
- [x] `CanvasRuntimeConfig` extended with `registryApiUrl` + `registryCustomerId` fields ✅
- [x] `appInitializerFactory` updated — `RegistryClientService.loadRemotes()` runs in parallel with `RemoteManifestLoader.load()` ✅
- [x] `provideCanvasCore()` registers `RegistryClientService` in the DI tree ✅
- [x] `index.ts` exports `RegistryClientService`, `CANVAS_REGISTRY_CONFIG`, `RegistryConfig`, `RegistryResponse` ✅
- [x] Tests: 15 new tests (64 total in canvas-shell-core), all passing ✅
- [x] Build: zero warnings ✅

### Documentation
- [x] `documents/canvas/registry-api.yaml` — OpenAPI 3.0 spec for the Canvas Registry REST API ✅
- [x] `apps/canvas-mobile-ref/src/assets/registry.json` — static fallback example for local dev ✅

---

## Phase 4 — MFE Libraries ✅ Completed 2026-05-03

### canvas-mfe-contracts
- [x] MfeManifest + RouteContract interfaces ✅
- [x] AuthContext interface ✅
- [x] CanvasEvent + EventBus interfaces ✅
- [x] CANVAS_AUTH_CONTEXT, CANVAS_EVENT_BUS, CANVAS_SHARED_STATE InjectionTokens ✅
- [x] Tests: 6 tests, 100% coverage ✅
- [x] Build: zero warnings ✅

### canvas-mfe-bootstrap
- [x] bootstrapMfe() — NF-compatible bootstrap factory ✅
- [x] buildRemoteEntryConfig() — typed federation config descriptor ✅
- [x] MfeAuthContextService — signal-based auth context consumer ✅
- [x] provideMfeBootstrap() — MFE environment providers entry point ✅
- [x] MFE_NAME InjectionToken ✅
- [x] Tests: 37 tests, 100% coverage ✅
- [x] Build: zero warnings ✅

### canvas-mfe-testing
- [x] MfeTestHarness — mounts MFE in isolation with all Canvas mock providers ✅
- [x] mockCanvasAuthContext() + createMockAuthContext() ✅
- [x] mockCanvasEventBus() + MockEventBus interface ✅
- [x] mockCanvasSharedState() ✅
- [x] Tests: 28 tests, 100% coverage ✅
- [x] Build: zero warnings ✅
