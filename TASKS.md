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

## Phase 4 — MFE Libraries (next)

- [ ] canvas-mfe-contracts
- [ ] canvas-mfe-bootstrap
- [ ] canvas-mfe-testing
