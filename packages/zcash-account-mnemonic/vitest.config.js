import { defineConfig } from 'vitest/config';
export default defineConfig({
    test: {
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.ts'],
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
        include: ['**/*.{test,spec}.ts'],
        testTimeout: 10000,
    },
});
//# sourceMappingURL=vitest.config.js.map