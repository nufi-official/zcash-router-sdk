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
 * Parameters for creating a Solana account (address only)
 */
export interface CreateSolanaAccountParams {
  mnemonic: string;
  accountIndex: number;
  network: SolanaNetwork;
  tokenId?: string | undefined; // Optional SPL token, defaults to SOL (native)
}

/**
 * Parameters for creating a full Solana account
 */
export interface CreateSolanaAccountFullParams {
  mnemonic: string;
  accountIndex: number;
  network: SolanaNetwork;
  tokenId?: string | undefined; // Optional SPL token, defaults to SOL (native)
  rpcUrl?: string; // Optional custom RPC URL
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
