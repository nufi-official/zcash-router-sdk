# @zcash-router-sdk/core

A TypeScript SDK for Zcash routing that supports both ESM and CommonJS, and runs in Node.js and browsers.

## Features

- ✅ **TypeScript** - Full TypeScript support with type declarations
- ✅ **Dual Format** - Supports both ESM and CommonJS
- ✅ **Browser Compatible** - Works in Node.js and browsers
- ✅ **Tree-shakeable** - Optimized for bundle size
- ✅ **Fully Tested** - Comprehensive test coverage with Vitest
- ✅ **Modern Tooling** - Built with tsup, ESLint, and Prettier

## Installation

```bash
npm install @zcash-router-sdk/core
```

```bash
yarn add @zcash-router-sdk/core
```

```bash
pnpm add @zcash-router-sdk/core
```

## Usage

### Basic Usage

```typescript
import { AssetRouteSDK } from '@zcash-router-sdk/core';

// Create an instance
const sdk = new AssetRouteSDK({
  baseUrl: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'X-API-Key': 'your-api-key',
  },
});

// Route an asset
const result = await sdk.route('/assets/image.png');

if (result.success) {
  console.log('Asset routed successfully:', result.data);
} else {
  console.error('Routing failed:', result.error);
}
```

### Using the Factory Function

```typescript
import { createAssetRouteSDK } from '@zcash-router-sdk/core';

const sdk = createAssetRouteSDK({
  baseUrl: 'https://api.example.com',
});
```

### Updating Configuration

```typescript
// Update the base URL
sdk.updateConfig({ baseUrl: 'https://new-api.example.com' });

// Add or update headers
sdk.updateConfig({
  headers: {
    'X-Another-Header': 'value',
  },
});

// Get current configuration
const config = sdk.getConfig();
console.log('Current config:', config);
```

### CommonJS Usage

```javascript
const { AssetRouteSDK } = require('@zcash-router-sdk/core');

const sdk = new AssetRouteSDK({
  baseUrl: 'https://api.example.com',
});
```

### Browser Usage

```html
<script type="module">
  import { AssetRouteSDK } from 'https://unpkg.com/@zcash-router-sdk/core';

  const sdk = new AssetRouteSDK({
    baseUrl: 'https://api.example.com',
  });
</script>
```

## API Reference

### `AssetRouteSDK`

The main SDK class.

#### Constructor

```typescript
new AssetRouteSDK(config: AssetRouteConfig)
```

**Parameters:**
- `config.baseUrl` (string, required) - Base URL for asset routing
- `config.timeout` (number, optional) - Request timeout in milliseconds (default: 5000)
- `config.headers` (Record<string, string>, optional) - Custom headers

#### Methods

##### `route(path: string): Promise<AssetRouteResult>`

Routes an asset request.

**Parameters:**
- `path` - The asset path to route

**Returns:** Promise resolving to `AssetRouteResult`

##### `getConfig(): Readonly<Required<AssetRouteConfig>>`

Gets the current configuration.

**Returns:** A readonly copy of the current configuration

##### `updateConfig(config: Partial<AssetRouteConfig>): void`

Updates the configuration. Headers are merged with existing headers.

**Parameters:**
- `config` - Partial configuration to update

### `createAssetRouteSDK(config: AssetRouteConfig): AssetRouteSDK`

Factory function to create a new SDK instance.

### Types

#### `AssetRouteConfig`

```typescript
interface AssetRouteConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}
```

#### `AssetRouteResult`

```typescript
interface AssetRouteResult {
  success: boolean;
  data?: unknown;
  error?: string;
}
```

## Development

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Build the library
npm run build

# Development mode (watch)
npm run dev

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run typecheck
```

### Project Structure

```
zcash-router-sdk/
├── src/
│   ├── index.ts          # Main entry point
│   └── types.ts          # Type definitions
├── tests/
│   └── index.test.ts     # Test files
├── dist/                 # Build output (generated)
│   ├── index.cjs         # CommonJS build
│   ├── index.mjs         # ESM build
│   ├── index.d.cts       # CommonJS types
│   └── index.d.mts       # ESM types
├── tsconfig.json         # TypeScript config (dev)
├── tsconfig.build.json   # TypeScript config (build)
├── tsup.config.ts        # Build configuration
├── vitest.config.ts      # Test configuration
├── .eslintrc.cjs         # ESLint configuration
└── .prettierrc           # Prettier configuration
```

## Publishing

Before publishing to npm:

1. Update the version in `package.json`
2. Run the prepublish checks:
   ```bash
   npm run prepublishOnly
   ```
3. Publish to npm:
   ```bash
   npm publish
   ```

The `prepublishOnly` script automatically runs type checking, tests, and builds before publishing.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.