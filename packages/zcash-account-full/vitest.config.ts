import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use jsdom for better Node.js API compatibility
    environment: 'jsdom',

    // Setup files to run before tests
    setupFiles: ['./vitest.setup.ts'],

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
    include: ['**/*.{test,spec}.ts'],

    // Timeout for tests (in ms)
    testTimeout: 10000,
  },
});
