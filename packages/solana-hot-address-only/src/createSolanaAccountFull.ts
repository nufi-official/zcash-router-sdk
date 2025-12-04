import type { AccountFull } from '@asset-route-sdk/core';
import type { CreateSolanaAccountFullParams } from './types';
import { SolanaAccountFull } from './solanaAccountFull';

/**
 * Factory function to create a full Solana account
 *
 * This creates a complete account that can:
 * - Derive addresses from mnemonic
 * - Fetch account balances from the network
 * - Sign and send transactions
 *
 * @param params - Account creation parameters
 * @returns AccountFull instance
 *
 * @example
 * ```typescript
 * const account = await createSolanaAccountFull({
 *   mnemonic: 'your twelve word mnemonic phrase here...',
 *   accountIndex: 0,
 *   network: 'mainnet',
 *   tokenId: 'native', // or SPL token mint address
 *   rpcUrl: 'https://api.mainnet-beta.solana.com', // optional
 * });
 *
 * const address = await account.getAddress();
 * const balance = await account.getBalance();
 * const txSig = await account.sendDeposit({
 *   address: 'destinationAddress...',
 *   amount: '1000000000', // 1 SOL in lamports
 * });
 * ```
 */
export async function createSolanaAccountFull(
  params: CreateSolanaAccountFullParams
): Promise<AccountFull> {
  const { mnemonic, accountIndex, network, tokenId, rpcUrl } = params;

  return new SolanaAccountFull({
    mnemonic,
    accountIndex,
    network,
    tokenId,
    rpcUrl,
  });
}
