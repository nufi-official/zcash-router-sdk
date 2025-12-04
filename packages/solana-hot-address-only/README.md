# @asset-route-sdk/solana-hot-address-only

Solana hot address-only account management library for the Asset Route SDK.

## Features

- 🔑 Derive Solana addresses from BIP39 mnemonic phrases
- 🪶 Lightweight implementation (address-only, no balance fetching or transactions)
- 🎯 Support for native SOL and SPL tokens
- 🌐 Multi-network support (mainnet-beta, devnet, testnet)
- 💯 Full TypeScript support with type definitions
- ✅ Implements AccountAddressOnly interface from @asset-route-sdk/core

## Installation

```bash
pnpm add @asset-route-sdk/solana-hot-address-only
```

## Usage

### Basic Example

```typescript
import { createSolanaAccount } from '@asset-route-sdk/solana-hot-address-only';

// Create a Solana account (address-only)
const account = await createSolanaAccount({
  mnemonic: 'your twelve word mnemonic phrase here...',
  accountIndex: 0,
  network: 'mainnet-beta',
  tokenId: undefined, // optional, defaults to 'native' (SOL)
});

// Get the Solana address
const address = await account.getAddress();
console.log('Solana address:', address);

// Convert SOL amount to lamports
const lamports = account.assetToBaseUnits('1.5'); // 1.5 SOL
console.log('Lamports:', lamports); // 1500000000n
```

### SPL Token Support

```typescript
import { createSolanaAccount } from '@asset-route-sdk/solana-hot-address-only';

// Create an account for USDC token
const usdcAccount = await createSolanaAccount({
  mnemonic: 'your twelve word mnemonic phrase here...',
  accountIndex: 0,
  network: 'mainnet-beta',
  tokenId: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC mint
});

const address = await usdcAccount.getAddress();
console.log('USDC account address:', address);
```

### Using Different Networks

```typescript
// Mainnet
const mainnetAccount = await createSolanaAccount({
  mnemonic: 'your mnemonic...',
  accountIndex: 0,
  network: 'mainnet-beta',
});

// Devnet
const devnetAccount = await createSolanaAccount({
  mnemonic: 'your mnemonic...',
  accountIndex: 0,
  network: 'devnet',
});

// Testnet
const testnetAccount = await createSolanaAccount({
  mnemonic: 'your mnemonic...',
  accountIndex: 0,
  network: 'testnet',
});
```

### Multiple Accounts from Same Mnemonic

```typescript
// Derive multiple accounts using different indices
const account0 = await createSolanaAccount({
  mnemonic: 'your mnemonic...',
  accountIndex: 0,
  network: 'mainnet-beta',
});

const account1 = await createSolanaAccount({
  mnemonic: 'your mnemonic...',
  accountIndex: 1,
  network: 'mainnet-beta',
});

const address0 = await account0.getAddress();
const address1 = await account1.getAddress();
// These will be different addresses
```

## API Reference

### `createSolanaAccount(params)`

Creates a Solana address-only account.

**Parameters:**

```typescript
interface CreateSolanaAccountParams {
  mnemonic: string; // BIP39 mnemonic phrase
  accountIndex: number; // Account derivation index
  network: SolanaNetwork; // 'mainnet-beta' | 'devnet' | 'testnet'
  tokenId?: SolanaTokenId; // Optional SPL token mint, defaults to 'native'
}
```

**Returns:** `Promise<AccountAddressOnly>`

### `SolanaAccountAddressOnly`

The account class that implements the `AccountAddressOnly` interface.

**Methods:**

- `getAddress(): Promise<string>` - Get the Solana address (base58 encoded)
- `assetToBaseUnits(amount: string): bigint` - Convert SOL amount to lamports
- `getNetwork(): SolanaNetwork` - Get the network
- `getTokenId(): SolanaTokenId` - Get the token ID
- `getAccountIndex(): number` - Get the account index

**Properties:**

- `type: 'addressOnly'` - Account type identifier
- `asset: RouteAsset` - Asset information

## Key Derivation

This package uses the standard Solana BIP44 derivation path:

```
m/44'/501'/account'/change'
```

- `501` is the Solana coin type
- `account` is the account index you provide
- `change` is always `0` for Solana

## Constants

```typescript
import {
  SOLANA_ASSET,
  SOLANA_DECIMALS,
  LAMPORTS_PER_SOL,
} from '@asset-route-sdk/solana-hot-address-only';

console.log(SOLANA_DECIMALS); // 9
console.log(LAMPORTS_PER_SOL); // 1000000000n
console.log(SOLANA_ASSET); // { blockchain: 'sol', tokenId: 'native' }
```

## Utilities

### Key Derivation Utilities

```typescript
import {
  deriveKeypairFromMnemonic,
  getAddressFromKeypair,
  deriveAddressFromMnemonic,
} from '@asset-route-sdk/solana-hot-address-only';

// Derive keypair
const keypair = deriveKeypairFromMnemonic('your mnemonic...', 0);

// Get address from keypair
const address = getAddressFromKeypair(keypair);

// Or derive address directly
const address2 = deriveAddressFromMnemonic('your mnemonic...', 0);
```

## Type Definitions

```typescript
type SolanaNetwork = 'mainnet-beta' | 'devnet' | 'testnet';
type SolanaAddress = string; // Base58 encoded public key
type SolanaTokenId = string; // Token mint address or 'native'
```

## AccountAddressOnly vs AccountFull

This package implements **AccountAddressOnly**, which provides:

- ✅ Address derivation
- ✅ Unit conversion
- ❌ Balance fetching (not available)
- ❌ Transaction signing (not available)

For full account functionality with balance and transactions, use `@asset-route-sdk/solana-full` (coming soon).

## License

MIT

## Repository

https://github.com/tkviet/asset-route-sdk
