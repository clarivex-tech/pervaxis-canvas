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

## Commands

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
├── libs/
│   ├── platform/
│   │   ├── canvas-platform-http/
│   │   ├── canvas-platform-auth/
│   │   ├── canvas-platform-state/
│   │   ├── canvas-platform-error/
│   │   └── canvas-platform-i18n/
│   ├── shell/
│   │   ├── canvas-shell-core/
│   │   ├── canvas-shell-routing/
│   │   ├── canvas-shell-auth/
│   │   └── canvas-shell-layout/
│   ├── mfe/
│   │   ├── canvas-mfe-bootstrap/
│   │   ├── canvas-mfe-contracts/
│   │   └── canvas-mfe-testing/
│   └── components/
│       ├── canvas-components-web/
│       └── canvas-components-mobile/
├── .github/workflows/
│   ├── pr-check.yml       # Lint · Test · Build · SonarCloud on PRs to main
│   ├── deploy.yml         # Branch tracking on main and develop
│   └── publish.yml        # npm publish on version tags
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
