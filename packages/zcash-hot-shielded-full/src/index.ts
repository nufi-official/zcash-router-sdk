import type { AccountFull } from '@asset-route-sdk/core';
import type { ZcashNetwork } from '@asset-route-sdk/zcash-core';
import { createZcashAccount } from '@asset-route-sdk/zcash-core';

export interface CreateZcashShieldedAccountParams {
  mnemonic: string;
  accountIndex: number;
  network: ZcashNetwork;
  lightwalletdUrl: string;
  minConfirmations: number;
}

/**
 * Factory function to create a Zcash shielded account with simplified parameters
 */
export async function createZcashShieldedAccount(
  params: CreateZcashShieldedAccountParams
): Promise<AccountFull> {
  return createZcashAccount({
    ...params,
    addressType: 'shielded',
  });
}

// Re-export common types and classes for convenience
export {
  ZcashAccount,
  ZCASH_ASSET,
  type ZcashAccountParams,
  type ZcashAddressType,
} from '@asset-route-sdk/zcash-core';
