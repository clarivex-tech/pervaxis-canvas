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
