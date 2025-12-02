import type { AccountFull } from '@asset-route-sdk/core';
import { createZcashShieldedAccount } from '@asset-route-sdk/zcash-hot-shielded-full';
import { createZcashTransparentAccount } from '@asset-route-sdk/zcash-hot-transparent-full';
import { loadAndInitWebZjs } from '@asset-route-sdk/zcash-core';

// Singleton instances stored at module level
let shieldedAccountInstance: AccountFull | null = null;
let transparentAccountInstance: AccountFull | null = null;

// Track the mnemonic used to create the accounts
let currentMnemonic: string | null = null;

interface GetAccountParams {
  addressType: 'transparent' | 'shielded';
  mnemonic: string;
  lightwalletdUrl: string;
}

/**
 * Get or create a Zcash account (singleton pattern).
 * If the account already exists with the same mnemonic, return it.
 * If the mnemonic changed, recreate the account.
 */
export async function getZcashAccount(params: GetAccountParams): Promise<AccountFull> {
  const { addressType, mnemonic, lightwalletdUrl } = params;

  // Ensure WASM is initialized before creating accounts
  await loadAndInitWebZjs();

  // If mnemonic changed, clear all cached instances
  if (currentMnemonic !== mnemonic) {
    shieldedAccountInstance = null;
    transparentAccountInstance = null;
    currentMnemonic = mnemonic;
  }

  // Return existing instance if available
  if (addressType === 'shielded' && shieldedAccountInstance) {
    return shieldedAccountInstance;
  }

  if (addressType === 'transparent' && transparentAccountInstance) {
    return transparentAccountInstance;
  }

  // Create new account
  const account = addressType === 'shielded'
    ? await createZcashShieldedAccount({
        mnemonic: mnemonic.trim(),
        accountIndex: 0,
        network: 'main',
        lightwalletdUrl,
        minConfirmations: 1,
      })
    : await createZcashTransparentAccount({
        mnemonic: mnemonic.trim(),
        accountIndex: 0,
        network: 'main',
        lightwalletdUrl,
        minConfirmations: 1,
      });

  // Cache the instance
  if (addressType === 'shielded') {
    shieldedAccountInstance = account;
  } else {
    transparentAccountInstance = account;
  }

  return account;
}

/**
 * Clear all cached account instances.
 * Useful for logout or when switching wallets.
 */
export function clearZcashAccounts(): void {
  shieldedAccountInstance = null;
  transparentAccountInstance = null;
  currentMnemonic = null;
}

/**
 * Check if an account instance exists for the given type.
 */
export function hasZcashAccount(addressType: 'transparent' | 'shielded'): boolean {
  if (addressType === 'shielded') {
    return shieldedAccountInstance !== null;
  }
  return transparentAccountInstance !== null;
}
