# @pervaxis/canvas-shell-layout

Root shell layout for Pervaxis Canvas — CSS Grid wrapper with collapsible sidebar, header (breadcrumbs + sidebar toggle), and a `RouterOutlet`-backed main content area.

All visual tokens are CSS custom properties; print-level themes simply override them at `:root`.

## Installation

This is a workspace library — no separate install needed.

## Usage

```typescript
import { provideCanvasLayout } from '@pervaxis/canvas-shell-layout';
import { ShellLayoutComponent } from '@pervaxis/canvas-shell-layout';

// 1. Register providers
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideCanvasLayout(),
  ],
});

// 2. Use in the root route
const routes: Routes = [
  {
    path: '',
    component: ShellLayoutComponent,
    children: [/* your MFE routes */],
    data: { breadcrumb: 'Home' },
  },
];
```

```html
<!-- app.component.html -->
<canvas-shell-layout [navItems]="navItems">
  <button canvas-header-actions>Profile</button>
</canvas-shell-layout>
```

## API

### `provideCanvasLayout()`

Registers `BreadcrumbService` into the Angular DI environment.

### `ShellLayoutComponent`

| Input | Type | Default | Description |
|---|---|---|---|
| `navItems` | `NavItem[]` | `[]` | Items rendered in the sidebar navigation |
| `startCollapsed` | `boolean` | `false` | Whether the sidebar begins collapsed |

Content projection slot: `[canvas-header-actions]` — placed in the header's action area.

### `HeaderComponent`

| Output | Description |
|---|---|
| `sidebarToggle` | Emits `void` when the hamburger button is clicked |

### `SidebarComponent`

| Input | Type | Default | Description |
|---|---|---|---|
| `collapsed` | `boolean` | `false` | Whether the sidebar is collapsed |
| `navItems` | `NavItem[]` | `[]` | Navigation items |

| Output | Description |
|---|---|
| `toggled` | Emits `void` when the toggle chevron is clicked |

### `NavigationComponent`

| Input | Type | Default | Description |
|---|---|---|---|
| `items` | `NavItem[]` | `[]` | Top-level nav items (supports one level of children) |

### `BreadcrumbService`

| Member | Type | Description |
|---|---|---|
| `breadcrumbs` | `Signal<Breadcrumb[]>` | Current breadcrumb trail (read-only) |

Built from `data['breadcrumb']` on each activated route snapshot.

## CSS Custom Properties

All properties have sensible defaults and can be overridden per-print:

```css
:root {
  /* Sidebar */
  --canvas-sidebar-width: 240px;
  --canvas-sidebar-collapsed-width: 56px;
  --canvas-sidebar-bg: #fff;
  --canvas-sidebar-border: 1px solid rgba(0,0,0,0.12);
  --canvas-sidebar-transition: 200ms ease;

  /* Header */
  --canvas-header-height: 56px;
  --canvas-header-bg: #fff;
  --canvas-header-border: 1px solid rgba(0,0,0,0.12);

  /* Navigation */
  --canvas-nav-item-padding: 0.625rem 1rem;
  --canvas-nav-active-bg: rgba(0,0,0,0.1);
  --canvas-nav-active-color: inherit;
  --canvas-nav-child-indent: 2.5rem;

  /* Breadcrumbs */
  --canvas-breadcrumb-font-size: 0.875rem;
  --canvas-breadcrumb-link-color: inherit;

  /* Main content */
  --canvas-main-padding: 1.5rem;
  --canvas-main-bg: #f5f5f5;
}
```

## Types

```typescript
interface NavItem {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  children?: NavItem[];
  disabled?: boolean;
}

interface Breadcrumb {
  label: string;
  path?: string;
}
```
