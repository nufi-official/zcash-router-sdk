import type { AccountFull, RouteAsset } from '@asset-route-sdk/core';
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import type { SolanaAddress, SolanaNetwork } from './types';
import { deriveKeypairFromMnemonic } from './utils/keyDerivation';

/**
 * Solana Account (Full)
 * Provides complete account functionality including balance fetching and transaction signing
 */
export class SolanaAccountFull implements AccountFull {
  readonly type = 'full' as const;
  readonly asset: RouteAsset;

  private readonly mnemonic: string;
  private readonly accountIndex: number;
  private readonly network: SolanaNetwork;
  private readonly connection: Connection;
  private cachedKeypair?: Keypair;
  private cachedAddress?: SolanaAddress;

  constructor(params: {
    mnemonic: string;
    accountIndex: number;
    network: SolanaNetwork;
    tokenId: string | undefined;
    rpcUrl?: string;
  }) {
    this.mnemonic = params.mnemonic;
    this.accountIndex = params.accountIndex;
    this.network = params.network;

    // Initialize connection with provided RPC URL or default
    const rpcUrl = params.rpcUrl || this.getDefaultRpcUrl();
    // eslint-disable-next-line no-console
    console.log('[SolanaAccountFull] Using RPC URL:', rpcUrl);
    this.connection = new Connection(rpcUrl, 'confirmed');

    this.asset = {
      blockchain: 'sol',
      tokenId: params.tokenId,
    };
  }

  /**
   * Get default RPC URL based on network
   * Uses free public endpoints as fallback
   */
  private getDefaultRpcUrl(): string {
    switch (this.network) {
      case 'mainnet':
        // Try these free public endpoints in order:
        // 1. Helius free tier (no auth needed for basic calls)
        // 2. Ankr public endpoint
        // 3. Triton/Rpcpool public endpoint
        return 'https://solana-mainnet.nu.fi';
      default:
        throw new Error(`Unsupported network: ${this.network}`);
    }
  }

  /**
   * Derive Keypair from mnemonic using BIP44 derivation path
   * Path: m/44'/501'/accountIndex'/0' (Solana's standard derivation path)
   */
  private getKeypair(): Keypair {
    if (this.cachedKeypair) {
      return this.cachedKeypair;
    }

    // Use the existing key derivation utility
    const keypair = deriveKeypairFromMnemonic(this.mnemonic, this.accountIndex);

    this.cachedKeypair = keypair;
    return keypair;
  }

  /**
   * Get the Solana address for this account
   * Bound to preserve `this` context when passed as callback
   * @returns Base58 encoded Solana public key
   */
  getAddress = async (): Promise<string> => {
    if (this.cachedAddress) {
      return this.cachedAddress;
    }

    const keypair = this.getKeypair();
    this.cachedAddress = keypair.publicKey.toBase58();

    return this.cachedAddress;
  };

  /**
   * Get the balance of this account in lamports, minus fee reserve
   * Bound to preserve `this` context when passed as callback
   * @returns Balance in lamports minus 10,000 lamports reserved for fees (1 SOL = 1,000,000,000 lamports)
   */
  getBalance = async (): Promise<bigint> => {
    try {
      const keypair = this.getKeypair();
      const publicKey = keypair.publicKey;

      // Get balance in lamports
      const balance = await this.connection.getBalance(publicKey);

      // Reserve 10,000 lamports for transaction fees
      const FEE_RESERVE = 20000n;
      const balanceBigInt = BigInt(balance);

      // Return balance minus fee reserve, or 0 if balance is less than fee
      return balanceBigInt > FEE_RESERVE ? balanceBigInt - FEE_RESERVE : 0n;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[SolanaAccountFull] Failed to get balance:', error);
      throw new Error(
        `Failed to fetch Solana balance: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  /**
   * Convert SOL amount to lamports (base units)
   * Bound to preserve `this` context when passed as callback
   * @param amount - Amount in SOL as a string (e.g., "1.5")
   * @returns Amount in lamports (1 SOL = 1,000,000,000 lamports)
   */
  assetToBaseUnits = (amount: string): bigint => {
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
  };

  /**
   * Send SOL to a destination address (deposit)
   * Bound to preserve `this` context when passed as callback
   * @param address - Destination Solana address (base58)
   * @param amount - Amount in lamports as a string
   * @returns Transaction signature
   */
  sendDeposit = async ({
    address,
    amount,
  }: {
    address: string;
    amount: string;
  }): Promise<string> => {
    // Amount is expected to be in lamports (base units) as a string
    const amountLamports = BigInt(amount);

    if (amountLamports <= 0n) {
      throw new Error(`Invalid amount: ${amount}`);
    }

    const keypair = this.getKeypair();
    const fromPubkey = keypair.publicKey;
    const toPubkey = new PublicKey(address);

    // Check if we have sufficient balance
    const balance = await this.getBalance();
    if (balance < amountLamports) {
      throw new Error(
        `Insufficient balance. Required: ${amountLamports}, Available: ${balance}`
      );
    }

    // Create transfer transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: Number(amountLamports),
      })
    );

    // Send and confirm transaction
    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [keypair],
      {
        commitment: 'confirmed',
      }
    );

    // Transaction successfully sent
    // eslint-disable-next-line no-console
    console.log('[SolanaAccountFull] Transaction sent:', {
      signature,
      from: fromPubkey.toBase58(),
      to: toPubkey.toBase58(),
      amount: amountLamports.toString(),
    });

    return signature;
  };
}
