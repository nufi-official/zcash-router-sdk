import { defineConfig } from 'vitest/config';
export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
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
        include: ['tests/**/*.{test,spec}.ts'],
        watchExclude: ['**/node_modules/**', '**/dist/**'],
        testTimeout: 10000,
    },
});
//# sourceMappingURL=vitest.config.js.map