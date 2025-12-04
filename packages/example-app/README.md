# Zcash Router SDK - Example App

A React example application demonstrating the usage of the Zcash Router SDK for routing assets to and from Zcash.

## Features

- **Route to Zcash**: Swap assets from Solana (SOL) to Zcash (ZEC)
- **Route from Zcash**: Swap assets from Zcash to Solana
- Real-time swap status tracking
- Clean, modern UI with Material-UI and Tailwind CSS

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

## Getting Started

### 1. Install Dependencies

From the root of the monorepo:

```bash
pnpm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `example-app` directory:

```bash
VITE_LIGHTWALLETD_URL=https://zcash-mainnet.chainsafe.dev
```

### 3. Run the Development Server

```bash
cd packages/example-app
pnpm dev
```

Or from the root:

```bash
pnpm --filter @zcash-router-sdk/example-app run dev
```

The app will be available at `http://localhost:3000`

## Usage

### Route to Zcash

1. **Enter Solana Mnemonic**: Your BIP39 mnemonic phrase (12 or 24 words)
2. **Enter Zcash Mnemonic**: Destination Zcash account mnemonic
3. **Enter Amount**: Amount of SOL to swap
4. **Click "Swap to Zcash"**: Initiates the cross-chain swap

The app will display real-time progress through the swap stages.

### Route from Zcash

1. **Enter Zcash Mnemonic**: Your Zcash account mnemonic
2. **Enter Solana Mnemonic**: Destination Solana account mnemonic
3. **Enter Amount**: Amount of ZEC to swap
4. **Click "Swap from Zcash"**: Initiates the cross-chain swap

## Architecture

### Components

- **App.tsx**: Main application entry point
- **App.mui.tsx**: Material-UI version of the app
- **App.minimal.tsx**: Minimal version without UI framework
- **RouteToZecForm**: Form component for swapping to Zcash
- **RouteFromZecForm**: Form component for swapping from Zcash
- **SwapStatus**: Reusable status display component

### Dependencies

- **@zcash-router-sdk/core**: Core swap and routing functionality
- **@zcash-router-sdk/solana-account-mnemonic**: Solana account management with mnemonic support
- **@zcash-router-sdk/zcash-account-mnemonic**: Zcash account management with mnemonic support
- **React 18**: UI framework
- **Vite**: Build tool and dev server with WASM support plugins
- **Material-UI**: UI component library (optional)
- **Tailwind CSS**: Utility-first CSS framework

### Technical Notes

- WASM support is enabled via `vite-plugin-wasm` and `vite-plugin-top-level-await` to support the Zcash cryptographic libraries
- The Zcash packages use `@chainsafe/webzjs-wallet` which requires WASM
- Node.js polyfills are configured for browser compatibility

## Building for Production

```bash
pnpm build
```

The production build will be output to the `dist/` directory.

## Preview Production Build

```bash
pnpm preview
```

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors

## License

MIT
