import type { AccountAddressOnly, RouteAsset } from '@asset-route-sdk/core';
import type { SolanaAddress, SolanaNetwork, SolanaTokenId } from './types';
import { deriveAddressFromMnemonic } from './utils/keyDerivation';

/**
 * Solana Account (Address Only)
 * Provides address derivation without balance fetching or transaction signing
 */
export class SolanaAccountAddressOnly implements AccountAddressOnly {
  readonly type = 'addressOnly' as const;
  readonly asset: RouteAsset;

  private readonly mnemonic: string;
  private readonly accountIndex: number;
  private cachedAddress?: SolanaAddress;

  constructor(params: {
    mnemonic: string;
    accountIndex: number;
    network: SolanaNetwork;
    tokenId: SolanaTokenId;
  }) {
    this.mnemonic = params.mnemonic;
    this.accountIndex = params.accountIndex;

    this.asset = {
      blockchain: 'solana',
      tokenId: params.tokenId,
    };
  }

  /**
   * Get the Solana address for this account
   * @returns Base58 encoded Solana public key
   */
  async getAddress(): Promise<string> {
    if (this.cachedAddress) {
      return this.cachedAddress;
    }

    this.cachedAddress = deriveAddressFromMnemonic(
      this.mnemonic,
      this.accountIndex
    );

    return this.cachedAddress;
  }

  /**
   * Convert SOL amount to lamports (base units)
   * @param amount - Amount in SOL as a string (e.g., "1.5")
   * @returns Amount in lamports (1 SOL = 1,000,000,000 lamports)
   */
  assetToBaseUnits(amount: string): bigint {
    // Parse the amount as a float and convert to lamports
    const amountFloat = parseFloat(amount);

    if (isNaN(amountFloat) || amountFloat < 0) {
      throw new Error(`Invalid amount: ${amount}`);
    }

    // Convert to lamports: multiply by 10^9
    // Use string manipulation to avoid floating point errors
    const [whole = '0', decimal = ''] = amount.split('.');
    const paddedDecimal = decimal.padEnd(9, '0').slice(0, 9);
    const lamportsStr = whole + paddedDecimal;

    return BigInt(lamportsStr);
  }
}
