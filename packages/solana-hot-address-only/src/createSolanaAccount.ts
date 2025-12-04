import type { AccountAddressOnly } from '@asset-route-sdk/core';
import type { CreateSolanaAccountParams } from './types';
import { SolanaAccountAddressOnly } from './solanaAccountAddressOnly';

/**
 * Factory function to create a Solana address-only account
 *
 * This creates a lightweight account that can only derive addresses
 * without the ability to fetch balances or sign transactions.
 *
 * @param params - Account creation parameters
 * @returns AccountAddressOnly instance
 *
 * @example
 * ```typescript
 * const account = await createSolanaAccount({
 *   mnemonic: 'your twelve word mnemonic phrase here...',
 *   accountIndex: 0,
 *   network: 'mainnet-beta',
 *   tokenId: 'native', // or SPL token mint address
 * });
 *
 * const address = await account.getAddress();
 * console.log('Solana address:', address);
 * ```
 */
export async function createSolanaAccount(
  params: CreateSolanaAccountParams
): Promise<AccountAddressOnly> {
  const { mnemonic, accountIndex, network, tokenId } = params;

  return new SolanaAccountAddressOnly({
    mnemonic,
    accountIndex,
    network,
    tokenId,
  });
}
