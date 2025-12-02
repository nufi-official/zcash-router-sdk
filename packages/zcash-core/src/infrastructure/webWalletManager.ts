import type { ZcashAccountStoredData } from '../domain/accountManager';
import type {
  ZCashShieldedAddress,
  ZCashTransparentAddress,
} from '../domain/address';
import type {
  Zatoshis,
  ZcashPcztHex,
  ZcashProvedPcztHex,
  ZcashSignedPcztHex,
} from '../domain/transaction';
import type {
  WebWalletConfig,
  WebWalletManager,
} from '../domain/webWalletManager';
import { ensure } from '../utils';

import { webzJsWallet } from './chainsafe-webzjs-wrapper';
import type { WebZjsWallet } from './chainsafe-webzjs-wrapper';

/**
 * Manager for WebWallet instances
 *
 * Handles creation, account import, sync, caching, tx creation, shielding, proof generation, and address retrieval for Zcash wallets
 */
export class WebWalletManagerImpl implements WebWalletManager {
  private wallet: WebZjsWallet.WebWallet | null = null;
  private readonly config: WebWalletConfig;

  private accountIdCache: Map<string, number> = new Map();
  private pendingSync: Promise<void> | null = null;

  constructor(config: WebWalletConfig) {
    this.config = config;
  }

  /**
   * Initialize and return a WebWallet instance
   * @private
   */
  private async getOrCreateWallet(): Promise<WebZjsWallet.WebWallet> {
    if (!this.wallet) {
      this.wallet = new webzJsWallet.WebWallet(
        this.config.network,
        this.config.lightwalletdUrl,
        this.config.minConfirmations
      );
    }
    return this.wallet;
  }

  /**
   * Get the current block height from the lightwalletd server
   * Returns current height minus 5 blocks for safety margin
   */
  private async getCurrentBlockHeight(): Promise<bigint> {
    const wallet = await this.getOrCreateWallet();
    try {
      // Get latest block height and subtract 5 blocks for safety
      const latestBlock = await wallet.get_latest_block();
      return latestBlock - BigInt(20);
    } catch (error) {
      // If we can't get the summary, fall back to a reasonable default
      console.warn('Could not get current block height, using default:', error);
    }
    // Fallback to a recent block height if we can't fetch it
    return BigInt(1);
  }

  /**
   * Import an account using a UFVK with spending capability
   *
   * @param account
   * @returns Account ID
   */
  private async importOrGetAccount(
    account: ZcashAccountStoredData
  ): Promise<number> {
    const ufvk = account.unifiedFullViewingKey;
    const accountName = `wallet-${account.seedFingerprintHex}-account-${account.accountIndex}`;
    const seedFingerprint = new Uint8Array(
      Buffer.from(account.seedFingerprintHex, 'hex')
    );
    const accountIndex = account.accountIndex;

    const cacheKey = `${Buffer.from(seedFingerprint).toString('hex')}-${accountIndex}`;
    const cachedAccountId = this.accountIdCache.get(cacheKey);

    if (cachedAccountId) {
      return cachedAccountId;
    }

    const birthdayHeight = await this.getCurrentBlockHeight();

    console.log('birthdayHeight', birthdayHeight);

    const wallet = await this.getOrCreateWallet();
    const sfp = webzJsWallet.SeedFingerprint.from_bytes(seedFingerprint);

    const accountId = await wallet.create_account_ufvk(
      accountName,
      ufvk,
      sfp,
      accountIndex,
      Number(birthdayHeight.toString())
    );
    this.accountIdCache.set(cacheKey, accountId);
    return accountId;
  }

  /**
   * Synchronize wallet with the blockchain
   *
   * If a sync is already in progress, this will await the pending sync
   * instead of creating a new one to prevent concurrent syncs.
   */
  private async sync(): Promise<void> {
    const wallet = await this.getOrCreateWallet();

    // if there are no accounts, the sync fails
    if (this.accountIdCache.size === 0) {
      return Promise.resolve();
    }

    // If there's already a sync in progress, wait for it
    if (this.pendingSync) {
      return this.pendingSync;
    }

    this.pendingSync = (async () => {
      try {
        await wallet.sync();
      } finally {
        // Clear the pending sync when done (success or failure)
        this.pendingSync = null;
      }
    })();

    return this.pendingSync;
  }

  /**
   * Get the current unified address for an account
   *
   * @param account - The account to get the address for
   * @returns Unified address as a string
   */
  async getCurrentAddress(
    account: ZcashAccountStoredData
  ): Promise<ZCashShieldedAddress> {
    const accountId = await this.importOrGetAccount(account);
    const wallet = await this.getOrCreateWallet();
    return (await wallet.get_current_address(
      accountId
    )) as ZCashShieldedAddress;
  }

  /**
   * Get the current transparent address for an account
   *
   * @param account - The account to get the transparent address for
   * @returns Transparent address as a string
   */
  async getCurrentTransparentAddress(
    account: ZcashAccountStoredData
  ): Promise<ZCashTransparentAddress> {
    const accountId = await this.importOrGetAccount(account);
    const wallet = await this.getOrCreateWallet();
    return (await wallet.get_current_address_transparent(
      accountId
    )) as ZCashTransparentAddress;
  }

  /**
   * Create a PCZT (Partially Constructed Zcash Transaction)
   *
   * @param account - The account to send from
   * @param toAddress - ZIP316 encoded address to send funds to
   * @param valueZatoshis - Amount to send in zatoshis (1 ZEC = 100,000,000 zatoshis)
   * @returns Hex-encoded PCZT
   */
  async createPczt(
    account: ZcashAccountStoredData,
    toAddress: string,
    amount: Zatoshis
  ): Promise<ZcashPcztHex> {
    const accountId = await this.importOrGetAccount(account);
    const wallet = await this.getOrCreateWallet();
    await this.sync();
    const pczt = await wallet.pczt_create(
      accountId,
      toAddress,
      BigInt(amount.toString())
    );

    try {
      // Serialize PCZT to bytes and convert to hex
      const pcztBytes = pczt.serialize();
      return Buffer.from(pcztBytes).toString('hex') as ZcashPcztHex;
    } finally {
      // Clean up WASM memory
      pczt.free();
    }
  }

  /**
   * Generate proofs for a signed PCZT
   *
   * @param signedPcztHex - Hex-encoded signed PCZT
   * @returns Hex-encoded PCZT with proofs
   */
  async provePczt(
    signedPcztHex: ZcashSignedPcztHex
  ): Promise<ZcashProvedPcztHex> {
    const wallet = await this.getOrCreateWallet();
    await this.sync();

    const pcztBytes = new Uint8Array(Buffer.from(signedPcztHex, 'hex'));
    const pczt = webzJsWallet.Pczt.from_bytes(pcztBytes);

    const provedPczt = await wallet.pczt_prove(pczt);

    try {
      // Serialize proved PCZT to bytes and convert to hex
      const provedPcztBytes = provedPczt.serialize();
      return Buffer.from(provedPcztBytes).toString('hex') as ZcashProvedPcztHex;
    } finally {
      // Clean up WASM memory
      if (provedPczt && typeof provedPczt.free === 'function') {
        provedPczt.free();
      }
    }
  }

  /**
   * Submit a proved PCZT transaction to the blockchain
   *
   * @param provedPcztHex - Hex-encoded PCZT with proofs
   * @returns Transaction ID (txid) as hex string
   */
  async submitTransaction(provedPcztHex: string): Promise<string> {
    const wallet = await this.getOrCreateWallet();

    const pcztBytes = new Uint8Array(Buffer.from(provedPcztHex, 'hex'));
    const pczt = webzJsWallet.Pczt.from_bytes(pcztBytes);
    const txHash = await wallet.pczt_send(pczt);
    return txHash;
  }

  /**
   * Get wallet summary including account balances
   *
   * @returns Wallet summary with account balances, or undefined if not synced
   */
  async getAccountBalances(account: ZcashAccountStoredData): Promise<{
    shieldedBalance: Zatoshis;
    unshieldedBalance: Zatoshis;
  }> {
    const wallet = await this.getOrCreateWallet();
    const accountId = await this.importOrGetAccount(account);

    console.log('[WebWalletManager] Syncing wallet for account:', accountId);
    await this.sync();
    const summary = ensure(await wallet.get_wallet_summary());

    console.log('[WebWalletManager] Wallet summary:', {
      chain_tip_height: summary.chain_tip_height,
      fully_scanned_height: summary.fully_scanned_height,
      account_balances: summary.account_balances,
    });

    const accountBalances = summary.account_balances as [
      number,
      {
        sapling_balance: number;
        orchard_balance: number;
        unshielded_balance: number;
      },
    ][];

    const accountBalanceEntry = accountBalances.find(
      ([id]) => id === accountId
    );

    const [, accountBalance] = ensure(accountBalanceEntry);

    if (!accountBalance) {
      throw new Error(`No balance found for account ${accountId}`);
    }

    const samplingBalance = accountBalance.sapling_balance;
    const orchardBalance = accountBalance.orchard_balance;

    console.log('[WebWalletManager] Account balances:', {
      accountId,
      sapling_balance: samplingBalance,
      orchard_balance: orchardBalance,
      unshielded_balance: accountBalance.unshielded_balance,
      total_shielded: samplingBalance + orchardBalance,
    });

    return {
      shieldedBalance: BigInt(samplingBalance + orchardBalance) as Zatoshis,
      unshieldedBalance: BigInt(accountBalance.unshielded_balance) as Zatoshis,
    };
  }

  /**
   * Clean up resources and reset wallet state
   */
  destroy(): void {
    if (this.wallet && typeof this.wallet.free === 'function') {
      this.wallet.free();
    }
    this.wallet = null;
    this.accountIdCache.clear();
    this.pendingSync = null;
  }
}
