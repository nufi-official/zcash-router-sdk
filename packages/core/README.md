# @zcash-router-sdk/core

Core swap and routing SDK for the Zcash Router SDK. Provides functionality for routing assets to and from Zcash, managing swap quotes, and tracking swap status.

## Features

- 🔄 **Asset Routing** - Route assets to and from Zcash
- 💱 **Swap Management** - Get quotes, execute swaps, and track status
- 📊 **Status Tracking** - Real-time swap status updates with event callbacks
- ✅ **TypeScript** - Full TypeScript support with type declarations
- 🌍 **Browser Compatible** - Works in Node.js and browsers

## Installation

```bash
pnpm add @zcash-router-sdk/core
```

```bash
npm install @zcash-router-sdk/core
```

```bash
yarn add @zcash-router-sdk/core
```

## Usage

### Route to Zcash

```typescript
import {
  routeToZcash,
  type SwapStateChangeEvent,
} from '@zcash-router-sdk/core';
import { createSolanaAccountFull } from '@zcash-router-sdk/solana-account-mnemonic';
import { createZcashShieldedAccount } from '@zcash-router-sdk/zcash-account-mnemonic';

// Create source account (e.g., Solana)
const sourceAccount = await createSolanaAccountFull({
  mnemonic: 'your solana mnemonic...',
  accountIndex: 0,
  network: 'mainnet',
});

// Create destination Zcash account
const zcashAccount = await createZcashShieldedAccount({
  mnemonic: 'your zcash mnemonic...',
  accountIndex: 0,
  network: 'main',
  lightwalletdUrl: 'https://zcash-mainnet.chainsafe.dev',
  minConfirmations: 10,
});

// Route assets to Zcash
await routeToZcash({
  sourceAccount,
  zcashAccount,
  amount: '1.5', // Amount in source asset units
  onSwapStatusChange: (event) => {
    console.log('Swap status:', event.status);
    if (event.status === 'DEPOSIT_SENT') {
      console.log('Transaction hash:', event.txHash);
    }
    if (event.status === 'SUCCESS') {
      console.log('Swap completed successfully!');
    }
  },
});
```

### Route from Zcash

```typescript
import {
  routeFromZcash,
  type SwapStateChangeEvent,
} from '@zcash-router-sdk/core';
import { createSolanaAccountFull } from '@zcash-router-sdk/solana-account-mnemonic';
import { createZcashShieldedAccount } from '@zcash-router-sdk/zcash-account-mnemonic';

// Create Zcash source account
const zcashAccount = await createZcashShieldedAccount({
  mnemonic: 'your zcash mnemonic...',
  accountIndex: 0,
  network: 'main',
  lightwalletdUrl: 'https://zcash-mainnet.chainsafe.dev',
  minConfirmations: 10,
});

// Create destination account (e.g., Solana)
const destinationAccount = await createSolanaAccountFull({
  mnemonic: 'your solana mnemonic...',
  accountIndex: 0,
  network: 'mainnet',
});

// Route assets from Zcash
await routeFromZcash({
  zcashAccount,
  destinationAccount,
  amount: '1.5', // Amount in ZEC
  onSwapStatusChange: (event) => {
    console.log('Swap status:', event.status);
  },
});
```

### Get Swap API Assets

```typescript
import { getSwapApiAssets } from '@zcash-router-sdk/core';

// Get all available assets for swapping
const assets = await getSwapApiAssets();
console.log('Available assets:', assets);
```

### Get Swap Quote

```typescript
import { getSwapQuote } from '@zcash-router-sdk/core';

// Get a quote for a swap
const quote = await getSwapQuote({
  dry: true, // Set to false to get a real quote
  senderAddress: 'sourceAddress...',
  recipientAddress: 'destinationAddress...',
  originAsset: 'assetId1',
  destinationAsset: 'assetId2',
  amount: '1000000000', // Amount in base units
  slippageTolerance: 100, // Slippage tolerance in basis points (100 = 1%)
});
```

## API Reference

### Routing Functions

#### `routeToZcash(params): Promise<void>`

Routes assets from a source account to Zcash.

**Parameters:**
- `sourceAccount: AccountFull` - Source account (e.g., Solana)
- `zcashAccount: AccountFull` - Destination Zcash account
- `amount: string` - Amount to swap in source asset units
- `onSwapStatusChange: (event: SwapStateChangeEvent) => void` - Callback for status updates

#### `routeFromZcash(params): Promise<void>`

Routes assets from Zcash to a destination account.

**Parameters:**
- `zcashAccount: AccountFull` - Source Zcash account
- `destinationAccount: AccountAddressOnly` - Destination account
- `amount: string` - Amount to swap in ZEC
- `onSwapStatusChange: (event: SwapStateChangeEvent) => void` - Callback for status updates

### Swap API Functions

#### `getSwapApiAssets(): Promise<SwapApiAsset[]>`

Gets all available assets for swapping.

**Returns:** Array of available swap assets

#### `getSwapQuote(params: GetQuoteParams): Promise<SwapQuoteResponse>`

Gets a quote for a swap.

**Parameters:**
- `dry: boolean` - If true, returns a dry-run quote
- `senderAddress: string` - Sender address
- `recipientAddress: string` - Recipient address
- `originAsset: string` - Origin asset ID
- `destinationAsset: string` - Destination asset ID
- `amount: string` - Amount in base units
- `slippageTolerance: number` - Slippage tolerance in basis points
- `deadline?: string` - Optional deadline
- `referral?: string` - Optional referral code

### Types

#### `AccountFull`

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

#### `AccountAddressOnly`

```typescript
interface AccountAddressOnly {
  readonly type: 'addressOnly';
  readonly asset: RouteAsset;
  
  getAddress(): Promise<string>;
  assetToBaseUnits(amount: string): bigint;
}
```

#### `SwapStateChangeEvent`

```typescript
type SwapStateChangeEvent =
  | { status: 'QUOTE_RECEIVED'; depositAddress: string }
  | { status: 'DEPOSIT_SENT'; txHash: string }
  | { status: CheckStatusResponse; statusResponse: GetExecutionStatusResponse };
```

#### `SwapApiAsset`

```typescript
interface SwapApiAsset {
  assetId: string;
  priceUpdatedAt: string;
  price: number;
  decimals: number;
  symbol: string;
  blockchain: string;
  contractAddress?: string;
}
```

### Constants

#### `SWAP_HAPPY_PATH_TIMELINE`

Expected status progression for a successful swap:

```typescript
['PENDING_DEPOSIT', 'KNOWN_DEPOSIT_TX', 'PROCESSING', 'SUCCESS']
```

#### `SWAP_END_STATES`

Final states that terminate the swap:

```typescript
Set(['SUCCESS', 'FAILED', 'REFUNDED'])
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
