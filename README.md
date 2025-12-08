# Zcash Router SDK Monorepo

A monorepo containing TypeScript SDKs for routing assets to and from Zcash. Built with pnpm workspaces, supporting both ESM and CommonJS, and compatible with Node.js and browsers.

## 🎯 Production-Grade Mainnet Demo

**Live demos:**
- [https://zcash.nu.fi](https://zcash.nu.fi) - Full demo with mnemonic input (build of [`packages/example-app`](./packages/example-app))
- [https://zcash-hackathon.nu.fi](https://zcash-hackathon.nu.fi) - NUFI wallet integration

These are **fully functional, production-grade implementations**:

- ✅ **Live blockchain integration** - Real swaps on Solana and Zcash mainnet
- ✅ **End-to-end transactions** - Complete deposit to withdrawal flow
- ✅ **Professional UI** - Modern interface with real-time status tracking

## 🏗️ Architecture

The SDK is designed with a modular architecture that separates concerns and makes it easy to extend support for new assets and wallet types:

### Core Package

The [`@zcash-router-sdk/core`](./packages/core) package handles all the logic for managing swaps to and from Zcash. Built on [NEAR intents](https://www.near.org/intents), it provides:
- Swap orchestration and state management
- Integration with swap APIs
- Quote fetching and execution tracking
- Status monitoring and event callbacks

### Account Packages

Account packages implement the `AccountFull` and `AccountAddressOnly` interfaces defined in the core package, providing blockchain-specific functionality:

- **[`@zcash-router-sdk/zcash-account-mnemonic`](./packages/zcash-account-mnemonic)** - Zcash account management with mnemonic support
  - Supports signing of shielded transactions
  - Manages Zcash wallet state and synchronization
  - Handles transparent and shielded addresses

- **[`@zcash-router-sdk/solana-account-mnemonic`](./packages/solana-account-mnemonic)** - Solana account management with mnemonic support
  - Native SOL balance fetching and transaction signing
  - Mnemonic-based key derivation

### Extensibility

The architecture makes it easy to add new packages for:
- **Other blockchain assets** (Ethereum, Bitcoin, etc.)
- **Hardware wallets** (Ledger, Trezor, etc.)
- **Extension wallets** (MetaMask, Phantom, etc.)
- **Other key management methods** (WIF, private keys, etc.)

Simply implement the `AccountFull` or `AccountAddressOnly` interface from the core package, and your new account type will work seamlessly with the swap routing logic.

## 📦 Packages

- [`@zcash-router-sdk/core`](./packages/core) - Core swap and routing logic
- [`@zcash-router-sdk/zcash-account-mnemonic`](./packages/zcash-account-mnemonic) - Zcash account management with mnemonic support
- [`@zcash-router-sdk/solana-account-mnemonic`](./packages/solana-account-mnemonic) - Solana account management with mnemonic support
- [`example-app`](./packages/example-app) - Example React application demonstrating SDK usage

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

### Running the Example App

The [`example-app`](./packages/example-app) is a React application that demonstrates how to use the Zcash Router SDK. It includes:

- **Route to Zcash**: Swap assets from Solana (SOL) to Zcash (ZEC)
- **Route from Zcash**: Swap assets from Zcash to Solana
- Real-time swap status tracking
- Clean, modern UI with Material-UI and Tailwind CSS

To run the example app:

```bash
# From the root directory
pnpm --filter @zcash-router-sdk/example-app run dev

# Or navigate to the example-app directory
cd packages/example-app
pnpm dev
```

The app will be available at `http://localhost:3000`. See the [example-app README](./packages/example-app/README.md) for more details.

## 🎯 Production-Grade Demo

This is a **fully functional, production-ready implementation**:

- ✅ **Live blockchain integration** - Real swaps on Solana and Zcash mainnet
- ✅ **End-to-end transactions** - Complete deposit to withdrawal flow
- ✅ **Modular architecture** - Extensible SDK design for adding new chains
- ✅ **Professional UI** - Modern interface with real-time status tracking
- ✅ **Comprehensive error handling** - Graceful failure recovery
- ✅ **Full type safety** - TypeScript throughout with comprehensive testing

Not a mockup or prototype - this actually works.

[🎥 View Live Demo](#) | [💻 Try It Yourself](#running-the-example-app)

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
pnpm --filter @zcash-router-sdk/core build

# Test a specific package
pnpm --filter @zcash-router-sdk/core test

# Run dev mode for a specific package
pnpm --filter @zcash-router-sdk/core dev

# Run the example app
pnpm --filter @zcash-router-sdk/example-app run dev
```

### Adding a New Account Package

To add support for a new blockchain or wallet type:

1. Create a new directory in `packages/`:
   ```bash
   mkdir packages/new-account-package
   ```

2. Create a `package.json` with the name `@zcash-router-sdk/new-account-package`:
   ```json
   {
     "name": "@zcash-router-sdk/new-account-package",
     "version": "0.1.0",
     "dependencies": {
       "@zcash-router-sdk/core": "workspace:*"
     }
   }
   ```

3. Implement the `AccountFull` or `AccountAddressOnly` interface from `@zcash-router-sdk/core`:
   ```typescript
   import type { AccountFull } from '@zcash-router-sdk/core';
   
   export class NewAccount implements AccountFull {
     readonly type = 'full' as const;
     readonly asset: RouteAsset;
     
     async getAddress(): Promise<string> { /* ... */ }
     async getBalance(): Promise<bigint> { /* ... */ }
     assetToBaseUnits(amount: string): bigint { /* ... */ }
     async sendDeposit(params: { address: string; amount: string }): Promise<string> { /* ... */ }
   }
   ```

4. Install dependencies from the root:
   ```bash
   pnpm install
   ```

5. Your new account type will now work with `routeToZcash()` and `routeFromZcash()` functions!

### Inter-package Dependencies

To use one package within another:

```json
{
  "dependencies": {
    "@zcash-router-sdk/core": "workspace:*"
  }
}
```

## 📁 Project Structure

```
zcash-router-sdk/
├── packages/
│   ├── core/                      # Core swap and routing logic
│   ├── zcash-account-mnemonic/    # Zcash account management
│   ├── solana-account-mnemonic/   # Solana account management
│   └── example-app/               # Example React app
├── .eslintrc.cjs                  # Shared ESLint config
├── .prettierrc                    # Shared Prettier config
├── pnpm-workspace.yaml            # pnpm workspace config
├── package.json                   # Root package with workspace scripts
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

- [Repository](https://github.com/tkviet/zcash-router-sdk)
- [Issues](https://github.com/tkviet/zcash-router-sdk/issues)
