# Pervaxis.Canvas

**Angular platform framework for web and mobile — by [Clarivex Technologies](https://clarivex.tech)**

Canvas is the shared foundation that every Pervaxis product is built on. It provides the full infrastructure layer — authentication, HTTP, state management, error handling, internationalisation, shell hosting, and UI components — so that product teams start from a working platform, not a blank workspace.

---

## What This Repository Is

This is the Nx monorepo for the `@pervaxis/canvas-*` Angular library suite. It produces independently publishable npm packages consumed by every Pervaxis product shell and its micro-frontends.

Canvas is not an application. It is a set of Angular libraries with a strict boundary model:

| Layer | Libraries | Purpose |
|---|---|---|
| **Platform** | `canvas-platform-http`, `canvas-platform-auth`, `canvas-platform-state`, `canvas-platform-error`, `canvas-platform-i18n` | Cross-platform services — web and mobile |
| **Shell** | `canvas-shell-core`, `canvas-shell-routing`, `canvas-shell-auth`, `canvas-shell-layout` | Angular host app framework and MFE orchestration |
| **MFE** | `canvas-mfe-bootstrap`, `canvas-mfe-contracts`, `canvas-mfe-testing` | Micro-frontend bootstrap helpers, shared contracts, and test harnesses |
| **Components** | `canvas-components-web`, `canvas-components-mobile` | UI components — browser (ag-Grid, ECharts) and Ionic mobile |

---

## Technology Stack

| Technology | Version |
|---|---|
| Angular | 18.x |
| Nx | 19.x |
| TypeScript | 5.4+ |
| NgRx Signals | 18.x |
| Ionic | 8.x |
| Native Federation | 18.x |
| Jest | Latest |

---

## Development Standards

- Standalone Angular components only — no NgModules
- `OnPush` change detection on every component
- `inject()` over constructor injection
- Signals for component state, observables for async streams
- No `any` type — strict TypeScript enforced
- 90%+ test coverage target
- All shared types and contracts live in `canvas-mfe-contracts` only

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

### 4. Run E2E tests

```bash
npm run e2e          # Headless Playwright
nx run canvas-shell-e2e:e2e-ui    # Playwright interactive UI
```

---

## Library Commands

```bash
# Install dependencies
npm install

# Build all libraries
nx run-many --target=build --all

# Build affected libraries only
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
│   └── components/           canvas-components-{web,mobile}
├── documents/canvas/         Blueprint, specs, guides, OpenAPI specs, Docker data
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

## CI/CD

| Trigger | Workflow | What runs |
|---|---|---|
| PR → `main` | `pr-check.yml` | Lint, test, build, SonarCloud quality gate |
| Push to `main` / `develop` | `deploy.yml` | Lint, test, build, SonarCloud tracking |
| Tag `v*.*.*` | `publish.yml` | Build + publish packages to GitHub Packages |

Packages are published to the GitHub Packages npm registry under the `@pervaxis` scope.

---

## Commit Convention

```
feat(scope): description
fix(scope): description
refactor(scope): description
test(scope): description
chore(scope): description
```

---

## License

Copyright © 2026 Clarivex Technologies Private Limited. All rights reserved.

This software is proprietary. Unauthorised use, reproduction, or distribution is strictly prohibited. See `LICENSE` for details.
