# Pervaxis.Canvas

**Angular platform framework for web and mobile — by [Clarivex Technologies](https://clarivex.tech)**

Canvas is the shared foundation that every Pervaxis product is built on. It provides the
full infrastructure layer — authentication, HTTP, state management, error handling,
internationalisation, shell hosting, and UI components — so that product teams start from
a working platform, not a blank workspace.

---

## What This Repository Is

This is the Nx monorepo for the `@pervaxis/canvas-*` Angular library suite. It produces
independently publishable npm packages consumed by every Pervaxis product shell and its
micro-frontends (MFEs).

Canvas is **not an application**. It is a set of Angular libraries with a strict boundary
model plus a sample domain library showing print developers the correct patterns.

---

## Library Reference

### Platform Libraries

| Package | Path | Purpose |
|---|---|---|
| `@pervaxis/canvas-platform-http` | `libs/platform/http` | HttpClient interceptor stack: retry, timeout, correlation ID, error normalisation |
| `@pervaxis/canvas-platform-auth` | `libs/platform/auth` | `AuthContextService`, `HasPermissionDirective`, `HasRoleDirective`, `authGuard`, `permissionGuard` |
| `@pervaxis/canvas-platform-state` | `libs/platform/state` | NgRx Signals store helpers, shared state service, Redux DevTools bridge |
| `@pervaxis/canvas-platform-error` | `libs/platform/error` | Global error handler, `ErrorBoundaryComponent` |
| `@pervaxis/canvas-platform-i18n` | `libs/platform/i18n` | Transloco configuration, `CanvasTranslocoLoader`, `LocaleService` |

### Shell Libraries

| Package | Path | Purpose |
|---|---|---|
| `@pervaxis/canvas-shell-core` | `libs/shell/core` | Bootstrap helpers, runtime config, MFE host registry |
| `@pervaxis/canvas-shell-routing` | `libs/shell/routing` | Dynamic route registration from MFE manifests |
| `@pervaxis/canvas-shell-auth` | `libs/shell/auth` | OIDC flow, JWT interceptor, silent token refresh |
| `@pervaxis/canvas-shell-layout` | `libs/shell/layout` | Root layout, navigation shell, sidebar, breadcrumbs |

### MFE Libraries

| Package | Path | Purpose |
|---|---|---|
| `@pervaxis/canvas-mfe-contracts` | `libs/mfe/contracts` | Shared interfaces, InjectionTokens, event bus types |
| `@pervaxis/canvas-mfe-bootstrap` | `libs/mfe/bootstrap` | Standalone MFE bootstrap helpers |
| `@pervaxis/canvas-mfe-testing` | `libs/mfe/testing` | MFE test harness and mock providers for unit tests |

### Component Libraries

| Package | Path | Purpose |
|---|---|---|
| `@pervaxis/canvas-components-web` | `libs/components/web` | `PageComponent`, `DataViewComponent`, `SectionComponent`, `FormEngineComponent`, `CanvasGridComponent`, chart components |
| `@pervaxis/canvas-components-mobile` | `libs/components/mobile` | Ionic wrappers for iOS/Android |

### Sample Domain Library

| Package | Path | Purpose |
|---|---|---|
| `@pervaxis/canvas-domain-customer` | `libs/domain/customer` | Reference CRUD implementation for print developers |

---

## Technology Stack

| Technology | Version |
|---|---|
| Angular | 21.x |
| Nx | 22.x |
| TypeScript | 5.9+ |
| NgRx Signals | 21.x |
| Ionic | 8.x |
| ag-Grid Community | 33.x |
| ECharts | 5.x |
| Transloco | 8.x |
| Vitest | 4.x |
| Storybook | 10.x |
| Playwright | 1.x |

---

## Prerequisites

| Tool | Minimum version |
|---|---|
| Node.js | 20 LTS |
| npm | 10+ |
| Docker Desktop | Any recent version |

---

## Local Development Setup

### 1. Install dependencies

```bash
npm install
npx playwright install   # Browser binaries for E2E (one-time)
```

### 2. Start backing services

```bash
docker compose up -d
```

| Service | URL | Purpose |
|---|---|---|
| Keycloak | http://localhost:8080 | OIDC identity provider (admin / admin) |
| Canvas Registry | http://localhost:3100 | MFE registry API mock |
| Mock API | http://localhost:3000 | json-server backend stubs |

**First-time only:** Create a dev user in the Keycloak `canvas` realm.
See `documents/canvas/localstack-guide.md` for the full setup walkthrough.

### 3. Serve the reference apps

```bash
nx serve canvas-shell-ref     # Shell host   → http://localhost:4200
nx serve canvas-mfe-ref       # MFE remote   → http://localhost:4201
nx serve canvas-mobile-ref    # Mobile app   → http://localhost:4202
```

### 4. Run Storybook

```bash
nx run canvas-components-web:storybook   # → http://localhost:4400
```

### 5. Run E2E tests

```bash
npm run e2e                             # Headless Playwright
nx run canvas-shell-e2e:e2e-ui         # Interactive Playwright UI
```

---

## Common Commands

```bash
# Build all libraries
nx run-many --target=build --all

# Build only what changed
nx affected --target=build

# Run all tests
nx run-many --target=test --all

# Run tests with coverage
nx run-many --target=test --all --coverage

# Lint all
nx run-many --target=lint --all

# Interactive dependency graph
nx graph

# Generate a new library
nx g @nx/angular:library --name=canvas-{name} --directory=libs/{category}
```

---

## Repository Structure

```
pervaxis-canvas/
├── apps/
│   ├── canvas-shell-ref/     Shell host reference app (port 4200)
│   ├── canvas-mfe-ref/       Products MFE remote (port 4201)
│   └── canvas-mobile-ref/    Ionic mobile reference app (port 4202)
├── e2e/
│   └── canvas-shell-e2e/     Playwright E2E test suite
├── libs/
│   ├── platform/             canvas-platform-{http,auth,state,error,i18n}
│   ├── shell/                canvas-shell-{core,routing,auth,layout}
│   ├── mfe/                  canvas-mfe-{bootstrap,contracts,testing}
│   ├── components/           canvas-components-{web,mobile}
│   └── domain/
│       └── customer/         Reference domain implementation for print devs
├── documents/canvas/
│   ├── Blueprint.md          Development roadmap and phase tracker
│   ├── Specifications.md     Technical specifications
│   ├── LessonsLearnt.md      Engineering principles from real experience
│   ├── Challenges.md         Technical obstacles and their resolutions
│   ├── PRINT_DEVELOPER_GUIDE.md  How to build domain modules
│   └── DOMAIN_CONVENTIONS.md    Coding rules for domain/print developers
├── docker-compose.yml        OIDC + registry + API dev stack
├── .github/workflows/
│   ├── pr-check.yml          Lint · Test · Build · SonarCloud on PRs
│   ├── deploy.yml            Branch tracking on main and develop
│   ├── publish.yml           npm publish on version tags
│   ├── ios.yml               iOS Capacitor build
│   └── android.yml           Android Capacitor build
├── nx.json
├── tsconfig.base.json
└── sonar-project.properties
```

---

## Development Standards

- **Standalone components** — `standalone: true` always; no NgModules
- **OnPush everywhere** — `changeDetection: ChangeDetectionStrategy.OnPush`
- **Signals for state** — NgRx Signals; no classic actions/reducers for local state
- **`inject()` not constructor** — use `inject()` in standalone components
- **No `any`** — TypeScript strict mode enforced
- **90%+ coverage** — enforced in CI via Vitest v8 + SonarCloud
- **Contracts in one place** — all shared types live in `@pervaxis/canvas-mfe-contracts`
- **i18n always** — no hardcoded strings; all labels go through `transloco`

---

## For Print Developers

Print developers build domain modules (e.g. `canvas-domain-customer`) on top of the
Canvas platform libraries. See the dedicated guides:

| Guide | Purpose |
|---|---|
| `documents/canvas/PRINT_DEVELOPER_GUIDE.md` | Step-by-step walkthrough with code examples |
| `documents/canvas/DOMAIN_CONVENTIONS.md` | Naming, structure, and coding rules |
| `libs/domain/customer/` | Reference implementation — copy and adapt |

**Quick checklist for a new domain library:**

1. Generate with `nx g @nx/angular:library --name=canvas-domain-<noun> --directory=libs/domain/<noun>`
2. Add path alias to `tsconfig.base.json`
3. Define models in `src/lib/models/<noun>.model.ts`
4. Write `<Noun>ApiService` using `HttpClient`
5. Write `<Noun>Store` using `signalStore`
6. Write List, Detail, Form pages using Canvas components
7. Wire routes with `authGuard` + `permissionGuard`
8. Add i18n keys to `src/assets/i18n/en.<noun>.json`
9. Write unit tests — 90%+ coverage required
10. Register lcov path in `sonar-project.properties`

---

## CI/CD

| Trigger | Workflow | What runs |
|---|---|---|
| PR → `main` | `pr-check.yml` | Lint, test, build, SonarCloud quality gate |
| Push to `main` / `develop` | `deploy.yml` | Lint, test, build, SonarCloud tracking |
| Tag `v*.*.*` | `publish.yml` | Build + publish packages to GitHub Packages |
| iOS release | `ios.yml` | Capacitor iOS build and archive |
| Android release | `android.yml` | Capacitor Android build and APK/AAB |

Packages are published to the GitHub Packages npm registry under the `@pervaxis` scope.

---

## Commit Convention

```
feat(scope): description
fix(scope): description
docs(scope): description
refactor(scope): description
test(scope): description
```

Scopes follow the library name suffix: `platform-http`, `shell-auth`, `components-web`,
`domain-customer`, etc.

---

## Contributing

1. Branch from `develop`: `git checkout -b feature/Phase-<N>-<description>`
2. Follow `.claude/CLAUDE.md` and `.claude/guides/GIT_WORKFLOW.md`
3. Open a PR against `develop` — all CI checks must pass before merge
4. SonarCloud quality gate must be green (90%+ coverage, 0 critical issues)

---

## License

Copyright © 2026 Clarivex Technologies Private Limited. All rights reserved.

This software is proprietary. Unauthorised use, reproduction, or distribution is strictly
prohibited. See `LICENSE` for details.
