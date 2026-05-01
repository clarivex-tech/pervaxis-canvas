# Pervaxis.Canvas — Development Blueprint

**Version:** 1.0.0
**Date:** 2026-04-30
**Status:** In Progress

---

## Progress Summary

| Phase | Tasks | Done | Left | Started | Completed |
|---|---|---|---|---|---|
| Phase 1 — Foundation | 12 | 12 | 0 | 2026-04-30 | 2026-04-30 |
| Phase 2 — Platform Libraries | 18 | 17 | 1 | 2026-05-01 | — |
| Phase 3 — Shell Libraries | 16 | 0 | 16 | — | — |
| Phase 4 — MFE Libraries | 12 | 0 | 12 | — | — |
| Phase 5 — Component Libraries | 20 | 0 | 20 | — | — |
| Phase 6 — Mobile (Ionic) | 14 | 0 | 14 | — | — |
| Phase 7 — Registry Service | 8 | 0 | 8 | — | — |
| Phase 8 — Reference Apps | 10 | 0 | 10 | — | — |
| Phase 9 — Forge Integration | 14 | 0 | 14 | — | — |
| Phase 10 — CI/CD and Publishing | 10 | 0 | 10 | — | — |
| **Total** | **134** | **18** | **116** | | |

---

## Phase 1 — Foundation and Repository Setup

**Started:** 2026-04-30 &nbsp;&nbsp; **Completed:** 2026-04-30 ✅

> Goal: Nx workspace created, build pipeline working, all package scaffolds in place.

- [x] Create `pervaxis-canvas` GitHub repository under `clarivex-tech` organisation ✅
- [x] Initialise Nx workspace (Angular 21.2.9, Nx 22.7.1) ✅
- [x] Configure `nx.json` with caching, affected, and task pipeline settings ✅
- [x] Set up `tsconfig.base.json` with strict settings ✅
- [x] Configure ESLint with Canvas module boundary rules ✅
- [x] Configure Prettier with project-wide format rules ✅
- [x] Set up `RELEASE_NOTES.md` and semantic versioning workflow ✅
- [x] Configure `package.json` workspace root (`@pervaxis/canvas`) ✅
- [x] Add `.github/workflows/pr-check.yml` (lint, test, build on PR) ✅
- [x] Add `.github/workflows/deploy.yml` and `publish.yml` ✅
- [x] Add `CLAUDE.md` and `.claude/` guides ✅
- [x] Add GitHub secrets — `SONAR_TOKEN` and `NPM_TOKEN` (manual step via GitHub UI) ✅

---

## Phase 2 — Platform Libraries

**Started:** 2026-05-01 &nbsp;&nbsp; **Completed:** —

> Goal: Core platform services that work on both web and mobile surfaces.

### `@pervaxis/canvas-platform-http`
- [x] Base HTTP client with configurable base URL and headers ✅
- [x] Retry interceptor with exponential backoff (configurable attempts) ✅
- [x] Timeout interceptor (configurable per request) ✅
- [x] Correlation ID interceptor (generates and injects `X-Correlation-Id`) ✅
- [x] Error normaliser interceptor (maps HTTP errors to structured error types) ✅
- [x] Unit tests — 90%+ coverage ✅ (94.73%, 37 tests)

### `@pervaxis/canvas-platform-auth`
- [x] `AuthContextService` — exposes current user, roles, permissions as signals ✅
- [x] `hasPermission` structural directive ✅
- [x] `hasRole` structural directive ✅
- [x] `AuthGuard` — route guard for authenticated routes ✅
- [x] `PermissionGuard` — route guard for permission-gated routes ✅
- [x] Unit tests — 90%+ coverage ✅ (100%, 41 tests)

### `@pervaxis/canvas-platform-state`
- [x] NgRx Signals store base configuration ✅
- [x] Redux DevTools integration (development only) ✅ (`withCanvasDevTools` store feature)
- [x] Shared state slice interface for cross-MFE state ✅ (`SharedState` interface + `SharedStateService`)
- [x] InjectionToken for shared store access ✅ (`CANVAS_SHARED_STATE` via `provideCanvasState()`)
- [x] Unit tests — 90%+ coverage ✅ (100%, 18 tests)

### `@pervaxis/canvas-platform-error`
- [ ] Global error handler (`ErrorHandler` implementation)
- [ ] Structured error logging to console + optional remote endpoint
- [ ] `ErrorBoundaryComponent` — wraps content, catches render errors gracefully
- [ ] Unit tests — 90%+ coverage

### `@pervaxis/canvas-platform-i18n`
- [ ] Transloco configuration factory
- [ ] Lazy translation file loader (per-feature JSON files)
- [ ] Locale switching service
- [ ] Fallback locale handling
- [ ] Unit tests — 90%+ coverage

---

## Phase 3 — Shell Libraries (Web)

**Started:** — &nbsp;&nbsp; **Completed:** —

> Goal: Full shell host framework for Angular Module Federation host apps.

### `@pervaxis/canvas-shell-core`
- [ ] App initialiser factory (`APP_INITIALIZER`) — loads config before bootstrap
- [ ] Runtime environment config service (reads from `/assets/config.json`)
- [ ] Module Federation host bootstrap helper
- [ ] Remote manifest loader — fetches and caches remote entry URLs
- [ ] Unit tests — 90%+ coverage

### `@pervaxis/canvas-shell-routing`
- [ ] Dynamic route registration service — adds MFE routes at runtime
- [ ] Lazy route loader using Native Federation `loadRemoteModule`
- [ ] Route not found handler with configurable fallback
- [ ] Unit tests — 90%+ coverage

### `@pervaxis/canvas-shell-auth`
- [ ] OIDC client setup via `angular-oauth2-oidc`
- [ ] Silent refresh configuration
- [ ] JWT interceptor (injects `Authorization: Bearer` header)
- [ ] Token expiry handler with auto-refresh
- [ ] Logout service — clears tokens, redirects to OIDC end session endpoint
- [ ] Unit tests — 90%+ coverage

### `@pervaxis/canvas-shell-layout`
- [ ] `ShellLayoutComponent` — root layout with nav, sidebar, header, content area
- [ ] `NavigationComponent` — driven by MFE manifest route data
- [ ] `SidebarComponent` — collapsible, supports nested menu items
- [ ] `HeaderComponent` — user profile, notifications slot, theme toggle
- [ ] `BreadcrumbService` — auto-generates breadcrumbs from active route tree
- [ ] Unit tests — 90%+ coverage

---

## Phase 4 — MFE Libraries (Web)

**Started:** — &nbsp;&nbsp; **Completed:** —

> Goal: Contracts and bootstrap utilities enabling MFE remote apps to integrate with the shell.

### `@pervaxis/canvas-mfe-contracts`
- [ ] `MfeManifest` interface — name, remoteEntry, exposedModule, routePath, permissions
- [ ] `AuthContext` interface — userId, roles, permissions, token
- [ ] `EventBus` typed event definitions — cross-MFE communication events
- [ ] `CANVAS_AUTH_CONTEXT` InjectionToken
- [ ] `CANVAS_EVENT_BUS` InjectionToken
- [ ] `CANVAS_SHARED_STATE` InjectionToken
- [ ] Unit tests — 90%+ coverage

### `@pervaxis/canvas-mfe-bootstrap`
- [ ] Standalone MFE Angular app bootstrap helper
- [ ] Native Federation remote configuration factory
- [ ] Auth context consumer — reads token from shell via InjectionToken
- [ ] Unit tests — 90%+ coverage

### `@pervaxis/canvas-mfe-testing`
- [ ] `MfeTestHarness` — mounts MFE in isolation with mock shell context
- [ ] Mock `AuthContext` provider
- [ ] Mock `EventBus` provider
- [ ] Mock `SharedState` provider
- [ ] Unit tests — 90%+ coverage

---

## Phase 5 — Component Libraries

**Started:** — &nbsp;&nbsp; **Completed:** —

> Goal: Reusable UI components for web and mobile surfaces.

### `@pervaxis/canvas-components-web`
- [ ] Design tokens — colours, spacing, typography, shadows (CSS custom properties)
- [ ] SCSS mixins and utility classes generated from tokens
- [ ] `CanvasGridComponent` — ag-Grid wrapper with Canvas theming and default config
- [ ] Custom ag-Grid cell editors — text, date, select, number
- [ ] Custom ag-Grid cell renderers — status badge, action buttons, currency
- [ ] `CanvasChartComponent` — base ECharts directive with resize observer
- [ ] `BarChartComponent`, `LineChartComponent`, `PieChartComponent`, `GaugeChartComponent`
- [ ] Dynamic form engine — schema-driven form generation from JSON config
- [ ] Typed form controls — input, select, date picker, autocomplete, file upload
- [ ] Cross-field and async validators
- [ ] `PageComponent` — page wrapper with title, subtitle, breadcrumb slot, actions slot
- [ ] `SectionComponent` — collapsible section with header and content
- [ ] `DataViewComponent` — list/grid/table view switcher
- [ ] Storybook 8 setup — all components documented with stories
- [ ] Unit tests — 90%+ coverage

### `@pervaxis/canvas-components-mobile`
- [ ] Mobile design tokens — aligned with web tokens, adjusted for touch surfaces
- [ ] Ionic wrapper components matching web component API surface
- [ ] `MobileListComponent` — ion-list wrapper with pull-to-refresh, infinite scroll
- [ ] `MobileFormComponent` — Ionic form wrapper with same schema engine as web
- [ ] `MobileChartComponent` — ECharts mobile-optimised wrapper
- [ ] Mobile navigation service — tab bar and stack navigation helpers

---

## Phase 6 — Mobile (Ionic) Integration

**Started:** — &nbsp;&nbsp; **Completed:** —

> Goal: Mobile surface fully integrated with Canvas platform and capable of running in generated prints.

- [ ] Ionic Angular integration layer in `canvas-shell-core` — detects mobile platform at bootstrap
- [ ] Capacitor setup guide and base configuration for generated prints
- [ ] Capacitor Secure Storage plugin integration in `canvas-platform-auth`
- [ ] OIDC redirect handling via Capacitor Browser plugin
- [ ] Push notification service in `canvas-platform` (Capacitor Push Notifications)
- [ ] Deep link handling service (Capacitor App plugin)
- [ ] Mobile-specific HTTP configuration (SSL pinning support, offline detection)
- [ ] `canvas-mobile-ref` reference app — full Ionic app consuming all platform libs
- [ ] iOS build and test pipeline in CI
- [ ] Android build and test pipeline in CI
- [ ] Capacitor plugin compatibility matrix documented
- [ ] Offline state handling strategy documented and implemented
- [ ] Unit tests for all mobile-specific services — 90%+ coverage
- [ ] Detox or Appium E2E test setup for reference mobile app

---

## Phase 7 — Registry Service

**Started:** — &nbsp;&nbsp; **Completed:** —

> Goal: Central runtime registry that tells each shell which MFEs to load.

- [ ] Define registry API contract (OpenAPI spec)
- [ ] `GET /api/registry/{customerId}/remotes` — returns MFE manifest list for customer
- [ ] `POST /api/registry/{customerId}/remotes` — registers a new MFE for a customer
- [ ] `DELETE /api/registry/{customerId}/remotes/{name}` — removes MFE from customer
- [ ] `registry.json` — static fallback for local development and LocalStack
- [ ] Shell integration — `canvas-shell-core` calls registry on bootstrap
- [ ] Registry client in `canvas-shell-core` with caching and retry
- [ ] Unit tests — 90%+ coverage

---

## Phase 8 — Reference Applications

**Started:** — &nbsp;&nbsp; **Completed:** —

> Goal: Prove all Canvas packages work together end-to-end in realistic apps.

- [ ] `canvas-shell-ref` — full Angular 18 shell host with auth, layout, dynamic MFE loading
- [ ] `canvas-mfe-ref` — full Angular 18 MFE remote registered in shell-ref
- [ ] `canvas-mobile-ref` — full Ionic app consuming platform libs, auth, and mobile components
- [ ] End-to-end test suite covering shell → MFE navigation flow
- [ ] End-to-end test suite covering auth flow (OIDC login → token → protected route)
- [ ] End-to-end test suite covering mobile auth and navigation
- [ ] Performance baseline documented (Lighthouse scores for web, app startup time for mobile)
- [ ] LocalStack integration guide for local development
- [ ] Docker Compose file for running OIDC provider + registry locally
- [ ] README with complete local development setup instructions

---

## Phase 9 — Forge Integration

**Started:** — &nbsp;&nbsp; **Completed:** —

> Goal: Pervaxis.Forge can generate fully working prints from Canvas templates.

- [ ] Scaffold `pervaxis-forge` repository
- [ ] `forge new {name} --type angular-shell` — generates full print with web + mobile
- [ ] `forge generate mfe-remote --name {module}` — adds MFE remote to existing print
- [ ] `forge generate domain-module --name {module}` — adds domain lib to print
- [ ] `forge generate crud-screen --entity {name}` — generates list + form + store + service
- [ ] `forge push --repo {org}/{repo}` — creates GitHub repo and pushes generated print
- [ ] `forge upgrade` — bumps Canvas package versions in an existing print
- [ ] `forge registry add-store {store} --mall {shell-repo}` — registers MFE in shell registry
- [ ] `forge.json` schema — records Canvas version and generator history in every print
- [ ] Auto-generated `CLAUDE.md` in every print — scopes Claude CLI to domain libs only
- [ ] Forge web UI — form-based interface replacing CLI for non-developer use
- [ ] Launchpad — customer onboarding wizard (name + module selection → full stack generated)
- [ ] Forge unit tests covering all generators
- [ ] Forge integration tests — generate a print, build it, verify it compiles

---

## Phase 10 — CI/CD and Publishing

**Started:** — &nbsp;&nbsp; **Completed:** —

> Goal: All packages published to GitHub Packages, CI enforcing quality on every PR.

- [ ] `pr-check.yml` — lint, test, build, SonarCloud on every PR (affected only)
- [ ] `publish.yml` — publish all libs to GitHub Packages on version tag push
- [ ] SonarCloud project configured for `pervaxis-canvas`
- [ ] Quality gate — 90%+ coverage enforced on PRs
- [ ] Automated `RELEASE_NOTES.md` update on tag
- [ ] Dependabot configured for weekly dependency updates
- [ ] npm package provenance enabled (GitHub Packages attestation)
- [ ] `canvas-versions.json` in Forge — maps Forge version to tested Canvas package versions
- [ ] Published package smoke test — CI installs published packages and builds a minimal print
- [ ] Documentation site generated from Storybook and deployed on publish

---

## Definition of Done

A phase is complete when:

1. All checklist items are checked
2. All new public APIs have JSDoc documentation
3. Unit test coverage is at or above 90% for all new libs
4. All packages build cleanly with zero warnings
5. Changes reviewed and merged to `main` via PR
6. `RELEASE_NOTES.md` updated

---

## Estimated Effort Reference

| Phase | Estimated Effort |
|---|---|
| Phase 1 — Foundation | 3–5 days |
| Phase 2 — Platform Libraries | 5–7 days |
| Phase 3 — Shell Libraries | 5–7 days |
| Phase 4 — MFE Libraries | 3–4 days |
| Phase 5 — Component Libraries | 10–14 days |
| Phase 6 — Mobile (Ionic) | 7–10 days |
| Phase 7 — Registry Service | 3–4 days |
| Phase 8 — Reference Apps | 5–7 days |
| Phase 9 — Forge Integration | 10–14 days |
| Phase 10 — CI/CD and Publishing | 3–4 days |
| **Total** | **54–76 days** |

Estimates assume one senior full-stack developer. Parallel work across phases reduces wall-clock time significantly.
