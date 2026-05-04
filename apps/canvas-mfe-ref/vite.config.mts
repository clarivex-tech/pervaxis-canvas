/// <reference types="vitest" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/canvas-mfe-ref',
  plugins: [angular(), nxViteTsPaths()],
  test: {
    name: 'canvas-mfe-ref',
    globals: true,
    passWithNoTests: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reporter: ['lcov', 'text'],
      reportsDirectory: '../../coverage/apps/canvas-mfe-ref',
    },
  },
  define: {
    'import.meta.vitest': undefined,
  },
});
