import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Test environment
    environment: 'node',

    // Global test utilities
    globals: true,

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        '**/*.config.ts',
        '**/*.d.ts',
      ],
    },

    // Test file patterns
    include: ['tests/**/*.{test,spec}.ts'],

    // Watch mode options
    watchExclude: ['**/node_modules/**', '**/dist/**'],

    // Timeout for tests (in ms)
    testTimeout: 10000,
  },
});
