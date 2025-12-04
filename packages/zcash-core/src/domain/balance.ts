import type { ZcashAccountInfo } from './accountManager';
import type { Zatoshis } from './transaction';

export const ZEC_FEE_ZATOSHIS = BigInt(40_000) as Zatoshis;

export const getMaxSendableAmount = (
  accountInfo: ZcashAccountInfo
): {
  shielded: Zatoshis;
  transparent: Zatoshis;
} => {
  const shieldedMax = accountInfo.shieldedBalance - ZEC_FEE_ZATOSHIS;
  const transparentMax = accountInfo.unshieldedBalance - ZEC_FEE_ZATOSHIS;

  return {
    shielded:
      shieldedMax <= 0 ? (BigInt(0) as Zatoshis) : (shieldedMax as Zatoshis),
    transparent:
      transparentMax <= 0
        ? (BigInt(0) as Zatoshis)
        : (transparentMax as Zatoshis),
  };
};
