# Asset Route SDK - Example App

A React example application demonstrating the usage of the Asset Route SDK for cross-chain asset routing.

## Features

- **Route to Zcash**: Swap assets from Solana (SOL) to Zcash (ZEC)
- **Route from Zcash**: Coming soon - swap from Zcash to other chains
- Real-time swap status tracking
- Clean, modern UI with Tailwind CSS

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Valid API credentials for the Defuse Protocol One-Click API

## Getting Started

### 1. Install Dependencies

From the example package directory:

```bash
pnpm install
```

Or from the root of the monorepo:

```bash
pnpm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and provide:
- `VITE_LIGHTWALLETD_URL`: Zcash lightwalletd server URL
- API credentials (configured in core package)

### 3. Run the Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## Usage

### Route to Zcash Form

1. **Select Source Asset**: Currently only SOL (Solana) is supported
2. **Enter Solana Mnemonic**: Your BIP39 mnemonic phrase (12 or 24 words)
3. **Enter Zcash Mnemonic**: Destination Zcash account mnemonic
4. **Enter Amount**: Amount of SOL to swap
5. **Click "Swap to Zcash"**: Initiates the cross-chain swap

The form will display real-time progress through these stages:
- Deposit Sent
- Deposit Confirmed
- Processing Swap
- Swap Complete

## Development Status

### ⚠️ Current Limitations

1. **Wallet Integration Not Implemented**
   - The `sendDeposit` function needs integration with a real Solana wallet SDK
   - Currently throws an error when attempting to send transactions
   - TODO: Integrate with Phantom, Solflare, or other Solana wallet

2. **API Configuration Required**
   - JWT token and API base URL must be configured in `@asset-route-sdk/core`
   - See `packages/core/src/swapApi/application/index.ts`

3. **Test Environment Only**
   - Do not use with real funds on mainnet
   - Use test mnemonics only

### 🔜 Coming Soon

- Route from Zcash form
- Multiple asset support
- Real wallet integration
- Balance display
- Transaction history

## Architecture

### Components

- **App.tsx**: Main application layout with two-column grid
- **RouteToZecForm.tsx**: Form for swapping to Zcash
- **SwapStatus.tsx**: Reusable status display component

### Dependencies

- **@asset-route-sdk/core**: Core swap functionality
- **@asset-route-sdk/solana-hot-address-only**: Solana account management
- **@asset-route-sdk/zcash-account-mnemonic**: Zcash account management with mnemonic support
- **React 18**: UI framework
- **Vite**: Build tool and dev server with WASM support plugins
- **Tailwind CSS**: Styling
- **TypeScript**: Type safety

### Technical Notes

- WASM support is enabled via `vite-plugin-wasm` and `vite-plugin-top-level-await` to support the Zcash cryptographic libraries
- The Zcash packages use `@chainsafe/webzjs-wallet` which requires WASM

## Building for Production

```bash
pnpm build
```

The production build will be output to the `dist/` directory.

## Preview Production Build

```bash
pnpm preview
```

## License

MIT
