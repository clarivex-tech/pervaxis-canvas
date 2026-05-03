/// <reference types="vitest" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular({ tsconfig: 'apps/canvas-mobile-ref/tsconfig.spec.json' })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['apps/canvas-mobile-ref/src/test-setup.ts'],
    include: ['apps/canvas-mobile-ref/src/**/*.spec.ts'],
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
