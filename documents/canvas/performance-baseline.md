# Pervaxis Canvas — Performance Baseline

**Date:** 2026-05-04
**Environment:** Local development (MacBook M3 Pro, Chrome 124, no throttling)
**Apps measured:** canvas-shell-ref, canvas-mfe-ref, canvas-mobile-ref

---

## Web — Lighthouse Scores (canvas-shell-ref)

Lighthouse scores for the shell host app on the `/dashboard` route after OIDC login.
Run with `npx lighthouse http://localhost:4200/dashboard --output json`.

| Metric | Target | Baseline |
|---|---|---|
| Performance | ≥ 85 | _Pending — requires production build + OIDC bypass_ |
| Accessibility | ≥ 90 | _Pending_ |
| Best Practices | ≥ 90 | _Pending_ |
| SEO | ≥ 80 | _Pending_ |
| First Contentful Paint | ≤ 1.5 s | _Pending_ |
| Time to Interactive | ≤ 3.0 s | _Pending_ |
| Total Blocking Time | ≤ 200 ms | _Pending_ |
| Largest Contentful Paint | ≤ 2.5 s | _Pending_ |

> **How to capture:** Run `nx build canvas-shell-ref --configuration production`,
> serve the `dist/apps/canvas-shell-ref` folder with `npx http-server -p 4200`,
> then run Lighthouse.

---

## Web — Bundle Size (canvas-shell-ref production build)

| Chunk | Target | Baseline |
|---|---|---|
| Initial bundle (main.js) | ≤ 500 kB gzipped | _Pending_ |
| Lazy routes combined | ≤ 200 kB gzipped | _Pending_ |
| Total initial | ≤ 700 kB gzipped | _Pending_ |

> Angular build budget configured at 2 MB warning / 5 MB error in `project.json`.
> Activate `sourceMap: true` + use `npx source-map-explorer` to identify heavy imports.

---

## MFE Remote — canvas-mfe-ref

| Metric | Target | Baseline |
|---|---|---|
| Remote entry size | ≤ 50 kB gzipped | _Pending — NF build required_ |
| Time to first interaction (after shell loads remote) | ≤ 1.0 s | _Pending_ |

---

## Mobile — App Startup Time (canvas-mobile-ref)

Measured from Capacitor app launch to first render on a physical device.

| Platform | Target | Baseline |
|---|---|---|
| iOS 17 (iPhone 15) | ≤ 2.0 s cold start | _Pending — requires native build_ |
| Android 14 (Pixel 7) | ≤ 2.5 s cold start | _Pending — requires native build_ |

> **How to measure iOS:** `xcodebuild` + Instruments → App Launch template.
> **How to measure Android:** Android Studio Profiler → App Startup.

---

## Goals for Phase 10

Once SonarCloud and CI publishing are in place (Phase 10), performance checks will be
automated as part of the PR pipeline:

- Lighthouse CI (`@lhci/cli`) runs on every PR to `develop`
- Bundle size tracked via `bundlesize` or Angular's built-in budget warnings
- Mobile startup time tracked via Detox/Appium (deferred to post-Phase-8)

---

## Re-measuring

Update this file after each significant dependency bump or architecture change.
Tag the date and the build SHA in each update so regressions are traceable.
