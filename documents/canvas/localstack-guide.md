# LocalStack and Local Development Guide

This guide explains how to run the full Pervaxis Canvas stack locally for development and
integration testing — including the OIDC provider, MFE registry, and mock API.

---

## Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Docker Desktop | 4.x+ | Container runtime |
| Node.js | 20.x LTS | Nx workspace |
| npm | 10.x | Package management |
| npx playwright install | — | E2E browser binaries |

---

## Quick Start

```bash
# 1. Install workspace deps
npm install

# 2. Start backing services (Keycloak, registry, API)
docker compose up -d

# 3. Serve the shell host
nx serve canvas-shell-ref

# 4. Serve the MFE remote (separate terminal)
nx serve canvas-mfe-ref

# 5. Serve the mobile reference app (separate terminal)
nx serve canvas-mobile-ref
```

| App | URL |
|---|---|
| canvas-shell-ref | http://localhost:4200 |
| canvas-mfe-ref | http://localhost:4201 |
| canvas-mobile-ref | http://localhost:4202 |
| Keycloak admin | http://localhost:8080/admin |
| Registry API | http://localhost:3100 |
| Mock API | http://localhost:3000 |

---

## Keycloak Setup

### Import realm on first run

Docker Compose automatically imports the realm on startup via `--import-realm`.
The realm config is at `documents/canvas/keycloak-realm.json`.

### Create a dev user (one-time)

1. Open http://localhost:8080/admin (admin / admin)
2. Select the **canvas** realm → Users → Add User
3. Username: `dev@canvas.local`
4. Set a temporary password: `dev-password` (Credentials tab → uncheck temporary)
5. Assign roles under the **canvas-shell-ref** client

---

## Registry Mock with json-server

The registry mock is powered by [`json-server`](https://github.com/typicode/json-server).

**Data file** — `documents/canvas/registry-db.json`:
```json
{
  "remotes": [
    {
      "id": "products-mfe",
      "name": "products-mfe",
      "remoteEntry": "http://localhost:4201/remoteEntry.json",
      "exposedModule": "./Module",
      "routePath": "products",
      "permissions": []
    }
  ]
}
```

**Routes file** — `documents/canvas/registry-routes.json` maps the json-server REST endpoints
to the Canvas registry API contract:
```json
{
  "/api/registry/:customerId/remotes": "/remotes"
}
```

### Reload registry without restart

Edit `documents/canvas/registry-db.json` — json-server watches the file and hot-reloads.

---

## LocalStack (AWS services)

If your Canvas print uses AWS services (S3 for assets, SQS for events), run LocalStack
alongside the standard stack:

```bash
docker compose -f docker-compose.yml -f docker-compose.localstack.yml up -d
```

> `docker-compose.localstack.yml` is a future addition for Phase 9 (Forge Integration).
> LocalStack is not required for basic Canvas library development.

---

## Running E2E Tests

```bash
# Install Playwright browsers (once)
npx playwright install

# Make sure all services + apps are running (see Quick Start above), then:
nx run canvas-shell-e2e:e2e

# Or run with Playwright UI
nx run canvas-shell-e2e:e2e-ui
```

---

## Environment Variables

All runtime config for the reference apps is in their `src/assets/config.json`.
No `.env` files are needed — the Docker Compose services use hard-coded local ports.

| Config key | Default (local) | Description |
|---|---|---|
| `apiBaseUrl` | `http://localhost:3000` | Mock backend API |
| `registryApiUrl` | `http://localhost:3100` | Canvas Registry |
| `registryCustomerId` | `dev-customer` | Scoped customer namespace |
| `oidcIssuer` | `http://localhost:8080/realms/canvas` | Keycloak realm |
| `oidcClientId` | `canvas-shell-ref` | Registered OIDC client |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Keycloak startup slow | Wait 60s for the JVM to warm up; check `docker compose logs keycloak` |
| CORS errors from registry | Ensure `http://localhost:4200` is in Keycloak's `Web origins` for the client |
| MFE fails to load | Confirm `nx serve canvas-mfe-ref` is running on port 4201 |
| E2E tests fail auth | Ensure the dev user exists in Keycloak and is not locked |
