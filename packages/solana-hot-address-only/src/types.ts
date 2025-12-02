import type { RouteAsset } from '@asset-route-sdk/core';

/**
 * Solana network types
 */
export type SolanaNetwork = 'mainnet';

/**
 * Solana address (base58 encoded public key)
 */
export type SolanaAddress = string;

/**
 * Solana token mint address
 */
export type SolanaTokenId = string;

/**
 * Parameters for creating a Solana account
 */
export interface CreateSolanaAccountParams {
  mnemonic: string;
  accountIndex: number;
  network: SolanaNetwork;
  tokenId?: SolanaTokenId; // Optional SPL token, defaults to SOL (native)
}

/**
 * Solana asset definition
 */
export const SOLANA_ASSET: RouteAsset = {
  blockchain: 'sol',
  tokenId: undefined, // Native SOL
};

/**
 * Solana decimals (lamports)
 */
export const SOLANA_DECIMALS = 9;

/**
 * Lamports per SOL
 */
export const LAMPORTS_PER_SOL = 1_000_000_000n;
