import { NewType } from '../utils';
export type ZCashTransparentAddress = NewType<'ZCashTransparentAddress'>;
export type ZCashShieldedAddress = NewType<'ZCashShieldedAddress'>;
export type ZCashAddress = ZCashTransparentAddress | ZCashShieldedAddress;
//# sourceMappingURL=address.d.ts.map