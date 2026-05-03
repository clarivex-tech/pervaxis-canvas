# @pervaxis/canvas-components-mobile

Mobile component library for the Pervaxis Canvas platform — Ionic list with pull-to-refresh and infinite scroll, schema-driven mobile form, ECharts mobile chart, and a tab-bar navigation service.

## Installation

Workspace library — no separate install. Declare peerDependencies in the consuming Ionic app:

```json
"@ionic/angular": "^8",
"echarts": "^5"
```

## Setup

Register Ionic in your application providers:

```typescript
import { provideIonicAngular } from '@ionic/angular/standalone';

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular({ mode: 'ios' }),
    // ...
  ],
});
```

## Design Tokens

```scss
@use '@pervaxis/canvas-components-mobile/src/styles/canvas-mobile-tokens' as *;
```

## Components

### `MobileListComponent` (`canvas-mobile-list`)

`ion-list` wrapper with optional pull-to-refresh and infinite scroll.

```html
<canvas-mobile-list
  [pullToRefresh]="true"
  [infiniteScroll]="true"
  [infiniteScrollDisabled]="allLoaded()"
  (refreshed)="onRefresh($event)"
  (loadMore)="onLoadMore($event)"
>
  @for (item of items(); track item.id) {
    <ion-item>
      <ion-label>{{ item.name }}</ion-label>
    </ion-item>
  }
</canvas-mobile-list>
```

### `MobileFormComponent` (`canvas-mobile-form`)

Schema-driven Ionic form (same `FormSchema` contract as the web form engine).

```typescript
const schema: FormSchema = {
  fields: [
    { key: 'name',  type: 'text',   label: 'Name',  validation: { required: true } },
    { key: 'email', type: 'email',  label: 'Email' },
    { key: 'role',  type: 'select', label: 'Role',  options: [{ label: 'Admin', value: 'admin' }] },
  ],
};
```

```html
<canvas-mobile-form [schema]="schema" (formSubmit)="onSubmit($event)" />
```

### `MobileChartComponent` (`canvas-mobile-chart`)

High-DPI ECharts chart optimised for mobile screens.

```html
<canvas-mobile-chart
  [options]="myOptions"
  height="300px"
/>
```

## Navigation Service

`MobileNavService` wraps Ionic's `NavController` for programmatic tab and stack navigation.

```typescript
@Component({ ... })
export class TabsComponent {
  readonly nav = inject(MobileNavService);

  goHome(): void    { this.nav.navigateToTab('/home'); }
  openDetail(): void { this.nav.pushPage('/detail/1'); }
  goBack(): void    { this.nav.popPage(); }
}
```

Provide the service in your shell or feature module:

```typescript
providers: [MobileNavService]
```
