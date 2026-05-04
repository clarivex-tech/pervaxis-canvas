/// <reference types="vitest" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { resolve } from 'path';

export default defineConfig({
  root: __dirname,
  plugins: [angular(), nxViteTsPaths()],
  test: {
    globals: true,
    passWithNoTests: true,
    environment: 'jsdom',
    setupFiles: [resolve(__dirname, 'src/test-setup.ts')],
    include: ['src/**/*.spec.ts'],
    reporters: ['default'],
    server: {
      deps: {
        inline: ['@ionic/core', '@ionic/angular', /@ionic/, '@capacitor/core', /@capacitor/],
      },
    },
    deps: {
      inline: [/@ionic/, /@capacitor/],
    },
  },
  define: {
    'import.meta.vitest': undefined,
  },
});
