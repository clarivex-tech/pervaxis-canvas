# @pervaxis/canvas-mfe-testing

Test utilities for Canvas MFE remote Angular applications.
Provides mock providers and a `MfeTestHarness` that mounts any MFE component
in isolation with all Canvas shell context tokens pre-wired.

## Installation

```bash
npm install --save-dev @pervaxis/canvas-mfe-testing
```

## API

### `MfeTestHarness`

Mounts a standalone Angular component with all Canvas mock providers pre-configured.

```typescript
const harness = await MfeTestHarness.create(OrdersComponent, {
  authContext: { userId: 'u-1', roles: ['admin'], permissions: ['orders:write'] },
  sharedState: { theme: 'dark' },
});

expect(harness.component.canEdit()).toBe(true);
harness.detectChanges();
expect(harness.nativeElement.querySelector('button')).toBeTruthy();
```

### `mockCanvasAuthContext(context?)`

Provides a mock `CANVAS_AUTH_CONTEXT` signal. Pass `null` for unauthenticated (default).

```typescript
TestBed.configureTestingModule({
  providers: [
    mockCanvasAuthContext({ roles: ['admin'] }),
  ],
});
```

### `mockCanvasEventBus()`

Provides an in-memory `MockEventBus`. Use `publishedEvents` to assert what was emitted.

```typescript
TestBed.configureTestingModule({
  providers: [mockCanvasEventBus()],
});
const bus = TestBed.inject(CANVAS_EVENT_BUS) as MockEventBus;
bus.publish({ type: 'nav', payload: '/orders', source: 'orders-mfe', timestamp: Date.now() });
expect(bus.publishedEvents).toHaveLength(1);
```

### `mockCanvasSharedState(state?)`

Provides a mock `CANVAS_SHARED_STATE` value. Defaults to `null`.

```typescript
TestBed.configureTestingModule({
  providers: [mockCanvasSharedState({ locale: 'en', theme: 'light' })],
});
```

### `createMockAuthContext(overrides?)`

Creates a fully-populated `AuthContext` fixture with sensible defaults.

```typescript
const ctx = createMockAuthContext({ userId: 'u-99', roles: ['superadmin'] });
```
