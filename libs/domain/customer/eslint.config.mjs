import nx from '@nx/eslint-plugin';
import baseConfig from '../../../eslint.config.mjs';

export default [
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: [
            '{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}',
            '{projectRoot}/vite.config.{ts,mts}',
            '{projectRoot}/vitest.config.{ts,mts}',
            '{projectRoot}/src/test-setup.ts',
          ],
          ignoredDependencies: [
            '@angular/common',
            '@angular/core',
            '@angular/forms',
            '@angular/router',
            '@pervaxis/canvas-components-web',
            '@pervaxis/canvas-platform-auth',
            '@jsverse/transloco',
            '@ngrx/signals',
            'ag-grid-community',
            'rxjs',
          ],
        },
      ],
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'customer', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'customer', style: 'kebab-case' },
      ],
    },
  },
  {
    files: ['**/*.html'],
    rules: {},
  },
  {
    // Stub components/directives in test files don't need to follow production selector rules
    files: ['**/*.spec.ts'],
    rules: {
      '@angular-eslint/component-selector': 'off',
      '@angular-eslint/directive-selector': 'off',
    },
  },
];
