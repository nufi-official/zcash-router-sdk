import type { Zatoshis } from './transaction';

const ZCASH_DECIMALS = 8;
const ZATOSHIS_PER_ZEC = BigInt(10) ** BigInt(8); // 100,000,000

/**
 * Convert ZEC amount string to zatoshis (1 ZEC = 100,000,000 zatoshis)
 * Handles decimal values correctly (e.g., "1.5" => 150000000n)
 */
export const zecToZatoshis = (zec: string | bigint): Zatoshis => {
  if (typeof zec === 'bigint') {
    return (zec * ZATOSHIS_PER_ZEC) as Zatoshis;
  }

  // Handle decimal string values
  const [whole = '0', fraction = ''] = zec.split('.');
  const paddedFraction = fraction
    .padEnd(ZCASH_DECIMALS, '0')
    .slice(0, ZCASH_DECIMALS);
  const zatoshis =
    BigInt(whole) * ZATOSHIS_PER_ZEC + BigInt(paddedFraction);
  return zatoshis as Zatoshis;
};

export const zatoshisToZec = (zatoshis: Zatoshis): string =>
  (zatoshis / ZATOSHIS_PER_ZEC).toString();
