import type { AccountFull } from '@asset-route-sdk/core';
import type { ZcashNetwork } from '@asset-route-sdk/zcash-core';
import { createZcashAccount } from '@asset-route-sdk/zcash-core';

export interface CreateZcashTransparentAccountParams {
  mnemonic: string;
  accountIndex: number;
  network: ZcashNetwork;
  lightwalletdUrl: string;
  minConfirmations: number;
}

/**
 * Factory function to create a Zcash transparent account with simplified parameters
 */
export async function createZcashTransparentAccount(
  params: CreateZcashTransparentAccountParams
): Promise<AccountFull> {
  return createZcashAccount({
    ...params,
    addressType: 'transparent',
  });
}

// Re-export common types and classes for convenience
export {
  ZcashAccount,
  ZCASH_ASSET,
  type ZcashAccountParams,
  type ZcashAddressType,
} from '@asset-route-sdk/zcash-core';
