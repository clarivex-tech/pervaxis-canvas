# Capacitor Plugin Compatibility Matrix

**Canvas Version:** 1.0.0  
**Last Updated:** 2026-05-03

---

## Core Requirements

| Package | Version | Notes |
|---|---|---|
| `@capacitor/core` | `^6.0.0` | Required for all native features |
| `@ionic/angular` | `^8.8.5` | Ionic Angular components |

---

## Canvas Platform Services → Capacitor Plugins

| Canvas Service | Plugin | Version | iOS Min | Android Min |
|---|---|---|---|---|
| `MobilePlatformService` | `@capacitor/core` | `^6.0.0` | iOS 13 | API 22 |
| `DeepLinkService` | `@capacitor/app` | `^6.0.0` | iOS 13 | API 22 |
| `PushNotificationService` | `@capacitor/push-notifications` | `^6.0.0` | iOS 13 | API 22 |
| `CapacitorOidcService` | `@capacitor/browser` + `@capacitor/app` | `^6.0.0` | iOS 13 | API 22 |
| `NetworkService` (native) | `@capacitor/network` | `^6.0.0` | iOS 13 | API 22 |
| `CapacitorTokenStorage` | `@capacitor/preferences` | `^6.0.0` | iOS 13 | API 22 |

---

## Platform Support

| Platform | Support Level | Notes |
|---|---|---|
| iOS 16+ | Full | Tested in CI |
| iOS 14–15 | Expected | Not CI-tested; Capacitor 6 supports iOS 13+ |
| iOS 13 | Minimum | Capacitor 6 minimum |
| Android API 34 (14) | Full | Tested in CI |
| Android API 26–33 | Expected | Not CI-tested |
| Android API 22 | Minimum | Capacitor 6 minimum |
| Web (PWA) | Full | All services degrade gracefully |

---

## Push Notifications — Native Setup

### iOS

1. Enable **Push Notifications** capability in Xcode under `Signing & Capabilities`.
2. Create an APNs key in Apple Developer portal and configure in Firebase Console (or your push provider).
3. In `AppDelegate.swift`, call `application.registerForRemoteNotifications()` — Capacitor handles this automatically when the plugin is registered.

### Android

1. Add `google-services.json` to `apps/canvas-mobile-ref/android/app/`.
2. Ensure `google-services` plugin is applied in `android/build.gradle`.
3. Push notifications use FCM automatically via the Capacitor plugin.

---

## OIDC Deep Link Setup

To use `CapacitorOidcService` on native:

1. Register a custom URL scheme (e.g. `myapp://`) in `capacitor.config.ts`:

```typescript
const config: CapacitorConfig = {
  plugins: {
    App: {
      appUrlScheme: 'myapp',
    },
  },
};
```

2. Add the scheme to your OIDC provider's allowed redirect URIs: `myapp://callback`

3. Configure `CanvasAuthConfig.redirectUri` with the scheme URL.

### iOS — Custom Scheme

Add to `ios/App/App/Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>myapp</string>
    </array>
  </dict>
</array>
```

### Android — Custom Scheme

Add to `android/app/src/main/AndroidManifest.xml` inside the main `<activity>`:

```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="myapp" android:host="callback" />
</intent-filter>
```

---

## Offline Handling Strategy

`NetworkService` provides a reactive `isOnline` signal that all components can consume:

```typescript
readonly network = inject(NetworkService);

// Template
{{ network.isOnline() ? 'Online' : 'Working offline' }}
```

`offlineInterceptor` blocks all HTTP requests when offline with a `NETWORK_OFFLINE` `CanvasHttpError`.

**Recommended pattern for offline-first screens:**
1. Cache API responses in `@capacitor/preferences` on successful fetch.
2. On error with `code === 'NETWORK_OFFLINE'`, read from cache and display stale indicator.
3. Re-fetch when `network.isOnline()` transitions to `true` using an `effect()`.

---

## Secure Token Storage

`CANVAS_TOKEN_STORAGE` automatically selects the right implementation:

| Platform | Storage | Security |
|---|---|---|
| Web | `sessionStorage` | Cleared on tab close; in-memory only |
| iOS | `@capacitor/preferences` → Keychain | Encrypted; survives app restart |
| Android | `@capacitor/preferences` → EncryptedSharedPreferences | AES-256 encrypted |

To force Capacitor storage (e.g. on a hybrid app with PWA + native):

```typescript
// app.config.ts
providers: [
  provideCapacitorTokenStorage(),
]
```
