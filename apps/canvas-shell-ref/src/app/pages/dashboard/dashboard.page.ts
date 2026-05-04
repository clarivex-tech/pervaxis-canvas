/**
 ************************************************************************
 * Copyright (C) 2026 Clarivex Technologies Private Limited
 * All Rights Reserved.
 *
 * NOTICE: All intellectual and technical concepts contained
 * herein are proprietary to Clarivex Technologies Private Limited
 * and may be covered by Indian and Foreign Patents,
 * patents in process, and are protected by trade secret or
 * copyright law. Dissemination of this information or reproduction
 * of this material is strictly forbidden unless prior written
 * permission is obtained from Clarivex Technologies Private Limited.
 *
 * Product:   Pervaxis Platform
 * Website:   https://clarivex.tech
 ************************************************************************
 */

import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageComponent, SectionComponent, DataViewComponent } from '@pervaxis/canvas-components-web';
import { AuthContextService } from '@pervaxis/canvas-platform-auth';
import { RegistryClientService, RemoteManifestLoader } from '@pervaxis/canvas-shell-core';
import { MfeManifest } from '@pervaxis/canvas-mfe-contracts';

/**
 * Shell host dashboard page.
 * Displays authenticated user info, loaded MFE remotes, and quick navigation.
 */
@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageComponent, SectionComponent, DataViewComponent],
  template: `
    <canvas-page title="Dashboard" subtitle="Canvas Shell Reference Application">
      <canvas-section title="Welcome" description="Authenticated shell host">
        <p>Signed in as: <strong>{{ userId() }}</strong></p>
        <p>Roles: {{ roles().join(', ') || 'none' }}</p>
      </canvas-section>

      <canvas-section title="Registered MFE Remotes">
        <canvas-data-view [loading]="false" [empty]="remotes().length === 0" emptyMessage="No remotes loaded — check registry config.">
          @for (remote of remotes(); track remote.name) {
            <div class="remote-card">
              <strong>{{ remote.name }}</strong>
              <span class="remote-path">{{ remote.routePath }}</span>
              <a [routerLink]="['/', remote.routePath]" class="remote-link">Open →</a>
            </div>
          }
        </canvas-data-view>
      </canvas-section>
    </canvas-page>
  `,
  styles: [`
    .remote-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border: 1px solid var(--canvas-color-border);
      border-radius: var(--canvas-radius-md);
      margin-bottom: 0.5rem;
      background: var(--canvas-color-surface);
    }
    .remote-path { color: var(--canvas-color-text-muted); font-size: 0.875rem; flex: 1; }
    .remote-link { color: var(--canvas-color-primary); text-decoration: none; font-size: 0.875rem; }
  `],
})
export class DashboardPage {
  readonly #auth = inject(AuthContextService);
  readonly #registry = inject(RegistryClientService);
  readonly #manifest = inject(RemoteManifestLoader);

  readonly userId = computed(() => this.#auth.context()?.userId ?? 'anonymous');
  readonly roles = computed(() => this.#auth.roles());

  /** Combined list from registry client + legacy manifest loader. */
  readonly remotes = computed<MfeManifest[]>(() => [
    ...this.#registry.remotes(),
    ...this.#manifest.manifests(),
  ]);
}
