import type { ZCashAddress } from './address';
import type { NewType } from '../utils';

export type Zatoshis = NewType<'Zatoshis', bigint>;

export type ZcashTxPlan = {
  toAddress: ZCashAddress;
  amount: Zatoshis;
};

export type ZcashPcztHex = NewType<'ZcashPcztHex', string>;

export type ZcashSignedPcztHex = NewType<'ZcashSignedPcztHex', ZcashPcztHex>;

export type ZcashProvedPcztHex = NewType<
  'ZcashProvedPcztHex',
  ZcashSignedPcztHex
>;
