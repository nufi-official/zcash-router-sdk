# Asset Route SDK Monorepo

A monorepo containing TypeScript SDKs for asset routing. Built with pnpm workspaces, supporting both ESM and CommonJS, and compatible with Node.js and browsers.

## 📦 Packages

- [`@asset-route-sdk/core`](./packages/core) - Core asset routing SDK

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (Install with `npm install -g pnpm`)

### Installation

```bash
# Install dependencies for all packages
pnpm install

# Build all packages
pnpm build

# Run tests for all packages
pnpm test
```

## 🛠️ Development

### Available Scripts

Run these commands from the root directory:

```bash
# Build all packages
pnpm build

# Development mode (watch)
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Lint all packages
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm format:check

# Type check all packages
pnpm typecheck

# Clean build artifacts
pnpm clean
```

### Working with Individual Packages

```bash
# Build a specific package
pnpm --filter @asset-route-sdk/core build

# Test a specific package
pnpm --filter @asset-route-sdk/core test

# Run dev mode for a specific package
pnpm --filter @asset-route-sdk/core dev
```

### Adding a New Package

1. Create a new directory in `packages/`:
   ```bash
   mkdir packages/new-package
   ```

2. Create a `package.json` with the name `@asset-route-sdk/new-package`

3. Add your source code and configuration files

4. Install dependencies from the root:
   ```bash
   pnpm install
   ```

### Inter-package Dependencies

To use one package within another:

```json
{
  "dependencies": {
    "@asset-route-sdk/core": "workspace:*"
  }
}
```

## 📁 Project Structure

```
asset-route-sdk/
├── packages/
│   └── core/                  # Core asset routing package
│       ├── src/
│       ├── tests/
│       ├── package.json
│       └── README.md
├── .eslintrc.cjs              # Shared ESLint config
├── .prettierrc                # Shared Prettier config
├── pnpm-workspace.yaml        # pnpm workspace config
├── package.json               # Root package with workspace scripts
└── README.md
```

## 🧪 Testing

All packages use Vitest for testing. Tests are located in the `tests/` directory of each package.

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch
```

## 📝 Code Quality

This monorepo uses:
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Vitest** for testing

Configuration files are shared across all packages from the root directory.

## 🔧 Build System

- **tsup** - Fast bundler built on esbuild
- **TypeScript** - Type checking and declarations
- **pnpm** - Fast, efficient package manager with workspace support

## 📦 Publishing

To publish a package:

1. Navigate to the package directory:
   ```bash
   cd packages/core
   ```

2. Update the version in `package.json`

3. Run the prepublish checks:
   ```bash
   pnpm run prepublishOnly
   ```

4. Publish to npm:
   ```bash
   pnpm publish
   ```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT

## 🔗 Links

- [Repository](https://github.com/tkviet/asset-route-sdk)
- [Issues](https://github.com/tkviet/asset-route-sdk/issues)
