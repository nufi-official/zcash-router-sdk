# @zcash-router-sdk/solana-account-mnemonic

Solana account management library with mnemonic support for the Zcash Router SDK. Provides utilities for creating and managing Solana accounts using BIP39 mnemonic phrases.

## Features

- 🔑 **Mnemonic-based accounts** - Create accounts from BIP39 mnemonic phrases
- 💰 **Full Account Functionality** - Balance fetching and transaction signing
- 🎯 **Native SOL Support** - Support for native SOL
- 🌐 **Network Support** - Mainnet support
- ✅ **TypeScript** - Full TypeScript support with type declarations
- 🌍 **Browser Compatible** - Works in Node.js and browsers

## Installation

```bash
pnpm add @zcash-router-sdk/solana-account-mnemonic
```

```bash
npm install @zcash-router-sdk/solana-account-mnemonic
```

```bash
yarn add @zcash-router-sdk/solana-account-mnemonic
```

## Usage

### Create a Full Account

```typescript
import { createSolanaAccountFull } from '@zcash-router-sdk/solana-account-mnemonic';

// Create a full Solana account with balance and transaction support
const account = await createSolanaAccountFull({
  mnemonic: 'your twelve word mnemonic phrase here...',
  accountIndex: 0,
  network: 'mainnet',
  rpcUrl: '', // optional, uses default if not provided
});

// Get the Solana address
const address = await account.getAddress();

// Get balance (in lamports, minus fee reserve)
const balance = await account.getBalance();

// Send SOL to an address
// Amount should be in lamports (base units) as a string
const txHash = await account.sendDeposit({
  address: 'destinationAddress...',
  amount: '1000000000', // 1 SOL in lamports
});
```

### Multiple Accounts from Same Mnemonic

```typescript
// Derive multiple accounts using different indices
const account0 = await createSolanaAccountFull({
  mnemonic: 'your mnemonic...',
  accountIndex: 0,
  network: 'mainnet',
});

const account1 = await createSolanaAccountFull({
  mnemonic: 'your mnemonic...',
  accountIndex: 1,
  network: 'mainnet',
});

const address0 = await account0.getAddress();
const address1 = await account1.getAddress();
// These will be different addresses
```

## API Reference

### Factory Functions

#### `createSolanaAccountFull(params: CreateSolanaAccountFullParams): Promise<AccountFull>`

Creates a full Solana account with balance fetching and transaction signing capabilities.

**Parameters:**
- `mnemonic: string` - BIP39 mnemonic phrase
- `accountIndex: number` - Account index for derivation
- `network: 'mainnet'` - Solana network
- `rpcUrl?: string` - Optional custom RPC URL, uses default if not provided

**Returns:** `Promise<AccountFull>`

### Account Interface

#### `AccountFull` Interface

The account implements the `AccountFull` interface from `@zcash-router-sdk/core`:

```typescript
interface AccountFull {
  readonly type: 'full';
  readonly asset: RouteAsset;
  
  getAddress(): Promise<string>;
  getBalance(): Promise<bigint>;
  assetToBaseUnits(amount: string): bigint;
  sendDeposit(params: { address: string; amount: string }): Promise<string>;
}
```

**Methods:**
- `getAddress(): Promise<string>` - Get the Solana address (base58 encoded)
- `getBalance(): Promise<bigint>` - Get balance in lamports (minus fee reserve)
- `assetToBaseUnits(amount: string): bigint` - Convert SOL amount to lamports
- `sendDeposit(params): Promise<string>` - Send SOL to an address, returns transaction hash

## Key Derivation

This package uses the standard Solana BIP44 derivation path:

```
m/44'/501'/account'/change'
```

- `501` is the Solana coin type
- `account` is the account index you provide
- `change` is always `0` for Solana

## Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Setup

```bash
# Install dependencies (from monorepo root)
pnpm install

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Build the library
pnpm build

# Development mode (watch)
pnpm dev

# Lint code
pnpm lint

# Format code
pnpm format
```

## License

MIT

## Contributing

Contributions are welcome! Please see the [root README](../../README.md) for contribution guidelines.

## Repository

https://github.com/tkviet/zcash-router-sdk
