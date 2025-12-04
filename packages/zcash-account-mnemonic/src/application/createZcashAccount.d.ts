import type { AccountFull } from '@zcash-router-sdk/core';
import type { ZcashNetwork } from '../domain/network';
import { type ZcashAddressType } from './zcashAccount';
export interface CreateZcashAccountParams {
    mnemonic: string;
    accountIndex: number;
    network: ZcashNetwork;
    lightwalletdUrl: string;
    minConfirmations: number;
    addressType: ZcashAddressType;
}
export interface CreateZcashShieldedAccountParams {
    mnemonic: string;
    accountIndex: number;
    network: ZcashNetwork;
    lightwalletdUrl: string;
    minConfirmations: number;
}
export interface CreateZcashTransparentAccountParams {
    mnemonic: string;
    accountIndex: number;
    network: ZcashNetwork;
    lightwalletdUrl: string;
    minConfirmations: number;
}
export declare function createZcashAccount(params: CreateZcashAccountParams): Promise<AccountFull>;
export declare function createZcashShieldedAccount(params: CreateZcashShieldedAccountParams): Promise<AccountFull>;
export declare function createZcashTransparentAccount(params: CreateZcashTransparentAccountParams): Promise<AccountFull>;
//# sourceMappingURL=createZcashAccount.d.ts.map