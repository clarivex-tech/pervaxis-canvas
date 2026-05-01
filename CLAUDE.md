# Pervaxis Canvas — Claude Development Guide

This is the Nx workspace for the Pervaxis Canvas Angular platform framework.

For full development instructions see: `.claude/CLAUDE.md`

## Quick Reference

- **Build all:** `nx run-many --target=build --all`
- **Test all:** `nx run-many --target=test --all`
- **Lint all:** `nx run-many --target=lint --all`
- **Affected only:** `nx affected --target=build`

## Key Rules

- Standalone Angular components only — no NgModules
- `OnPush` change detection on every component
- `inject()` over constructor injection
- All shared types live in `@pervaxis/canvas-mfe-contracts` only
- No `any` type — TypeScript strict is enforced

## Guides

- `.claude/CLAUDE.md` — Full development guide
- `.claude/guides/GIT_WORKFLOW.md` — Branch strategy and PR process
- `.claude/guides/ci-sonarcloud-setup.md` — CI and SonarCloud setup
- `.claude/guides/CANVAS_PACKAGES_COMPLIANCE.md` — Shared contracts compliance
