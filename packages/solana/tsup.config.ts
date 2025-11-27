import { defineConfig } from 'tsup';

export default defineConfig({
  // Entry points
  entry: ['src/index.ts'],

  // Output formats
  format: ['cjs', 'esm'],

  // Generate TypeScript declaration files
  dts: true,

  // Code splitting for better tree-shaking
  splitting: true,

  // Generate sourcemaps
  sourcemap: true,

  // Clean output directory before build
  clean: true,

  // Minify output
  minify: false, // Set to true for production builds

  // Target environments
  target: 'es2020',

  // Platform-specific settings
  platform: 'neutral', // Works in both Node.js and browser

  // Tree-shaking
  treeshake: true,

  // Bundle external dependencies
  // Set to false if you want to keep them as external
  noExternal: [],

  // Shims for Node.js built-ins when targeting browser
  shims: true,

  // Output file names
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.mjs',
    };
  },

  // Environment variables
  env: {
    NODE_ENV: 'production',
  },
});
