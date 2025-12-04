# @zcash-router-sdk/zcash-account-mnemonic

Zcash account management library with mnemonic support for the Zcash Router SDK. Provides utilities for creating and managing Zcash accounts (both transparent and shielded) using BIP39 mnemonic phrases.

## Features

- 🔐 **Mnemonic-based accounts** - Create accounts from BIP39 mnemonic phrases
- 🛡️ **Shielded & Transparent** - Support for both shielded (Sapling/Orchard) and transparent addresses
- 💰 **Full Account Management** - Balance fetching, transaction signing, and automatic shielding
- 🌐 **Network Support** - Mainnet and testnet support
- ✅ **TypeScript** - Full TypeScript support with type declarations
- 🌍 **Browser Compatible** - Works in Node.js and browsers with WASM support

## Installation

```bash
pnpm add @zcash-router-sdk/zcash-account-mnemonic
```

```bash
npm install @zcash-router-sdk/zcash-account-mnemonic
```

```bash
yarn add @zcash-router-sdk/zcash-account-mnemonic
```

## Usage

### Initialize WebZjs (Required)

Before creating any accounts, you must initialize the WebZjs WASM modules:

```typescript
import { loadAndInitWebZjs } from '@zcash-router-sdk/zcash-account-mnemonic';

// Initialize WASM modules (call once at app startup)
await loadAndInitWebZjs();
```

### Create a Shielded Account

```typescript
import {
  createZcashShieldedAccount,
  loadAndInitWebZjs,
} from '@zcash-router-sdk/zcash-account-mnemonic';

// Initialize WASM
await loadAndInitWebZjs();

// Create a shielded account
const account = await createZcashShieldedAccount({
  mnemonic: 'your twelve word mnemonic phrase here...',
  accountIndex: 0,
  network: 'main',
  lightwalletdUrl: 'https://zcash-mainnet.chainsafe.dev',
  minConfirmations: 10,
});

// Get the shielded address
const address = await account.getAddress();

// Get balance (in zatoshis, 1 ZEC = 100,000,000 zatoshis)
const balance = await account.getBalance();
```

### Create a Transparent Account

```typescript
import {
  createZcashTransparentAccount,
  loadAndInitWebZjs,
} from '@zcash-router-sdk/zcash-account-mnemonic';

// Initialize WASM
await loadAndInitWebZjs();

// Create a transparent account
const account = await createZcashTransparentAccount({
  mnemonic: 'your twelve word mnemonic phrase here...',
  accountIndex: 0,
  network: 'main',
  lightwalletdUrl: 'https://zcash-mainnet.chainsafe.dev',
  minConfirmations: 10,
});

// Get the transparent address
const address = await account.getAddress();

// Get balance
const balance = await account.getBalance();
```

### Send a Transaction

```typescript
// Send ZEC to an address
// Amount should be in zatoshis (base units) as a string
const txHash = await account.sendDeposit({
  address: 'zs1...', // Destination address
  amount: '100000000', // 1 ZEC in zatoshis
});

console.log('Transaction hash:', txHash);
```

**Note:** The `sendDeposit` method automatically shields transparent funds if needed before sending.

### Convert Amounts

```typescript
// Convert ZEC to zatoshis (base units)
const zatoshis = account.assetToBaseUnits('1.5'); // Returns 150000000n
```

### Reset Wallet State

If you need to clear all wallet state (useful for testing or switching wallets):

```typescript
import { resetZcashWallet } from '@zcash-router-sdk/zcash-account-mnemonic';

resetZcashWallet();
```

## API Reference

### Factory Functions

#### `createZcashAccount(params: CreateZcashAccountParams): Promise<AccountFull>`

Creates a Zcash account with the specified address type.

**Parameters:**
- `mnemonic: string` - BIP39 mnemonic phrase
- `accountIndex: number` - Account index for derivation
- `network: 'main' | 'test'` - Zcash network
- `lightwalletdUrl: string` - Lightwalletd server URL
- `minConfirmations: number` - Minimum confirmations required
- `addressType: 'transparent' | 'shielded'` - Address type

#### `createZcashShieldedAccount(params: CreateZcashShieldedAccountParams): Promise<AccountFull>`

Convenience function to create a shielded account (equivalent to `createZcashAccount` with `addressType: 'shielded'`).

**Parameters:**
- `mnemonic: string` - BIP39 mnemonic phrase
- `accountIndex: number` - Account index for derivation
- `network: 'main' | 'test'` - Zcash network
- `lightwalletdUrl: string` - Lightwalletd server URL
- `minConfirmations: number` - Minimum confirmations required

#### `createZcashTransparentAccount(params: CreateZcashTransparentAccountParams): Promise<AccountFull>`

Convenience function to create a transparent account (equivalent to `createZcashAccount` with `addressType: 'transparent'`).

**Parameters:**
- `mnemonic: string` - BIP39 mnemonic phrase
- `accountIndex: number` - Account index for derivation
- `network: 'main' | 'test'` - Zcash network
- `lightwalletdUrl: string` - Lightwalletd server URL
- `minConfirmations: number` - Minimum confirmations required

### Account Interface

The returned account implements the `AccountFull` interface from `@zcash-router-sdk/core`:

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
- `getAddress(): Promise<string>` - Get the Zcash address (shielded or transparent based on account type)
- `getBalance(): Promise<bigint>` - Get balance in zatoshis (1 ZEC = 100,000,000 zatoshis)
- `assetToBaseUnits(amount: string): bigint` - Convert ZEC amount to zatoshis
- `sendDeposit(params): Promise<string>` - Send ZEC to an address, returns transaction hash. Automatically shields transparent funds if needed.

### Utility Functions

#### `loadAndInitWebZjs(): Promise<void>`

Initializes the WebZjs WASM modules. **Must be called once** before creating any accounts.

#### `resetZcashWallet(): void`

Clears all wallet state including:
- WebWalletManager singleton instance
- All stored birthday blocks in localStorage

### Types

#### `ZcashAddressType`

```typescript
type ZcashAddressType = 'transparent' | 'shielded';
```

#### `ZcashNetwork`

```typescript
type ZcashNetwork = 'main' | 'test';
```

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
