import type { Zatoshis } from './transaction';

const ZATOSHIS_PER_ZEC = BigInt(10) ** BigInt(8); // 100,000,000

export const zecToZatoshis = (zec: string | bigint): Zatoshis => {
  const zecString = typeof zec === 'string' ? zec : zec.toString();
  return (BigInt(zecString) * ZATOSHIS_PER_ZEC) as Zatoshis;
};

export const zatoshisToZec = (zatoshis: Zatoshis): string =>
  (zatoshis / ZATOSHIS_PER_ZEC).toString();
