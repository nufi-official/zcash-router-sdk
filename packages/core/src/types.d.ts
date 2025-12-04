import { SendDepositFn } from './swapApi/domain';
export type RouteAsset = {
    blockchain: 'sol';
    tokenId: string | undefined;
} | {
    blockchain: 'zec';
    tokenId: undefined;
};
type AccountBase = {
    asset: RouteAsset;
    getAddress: () => Promise<string>;
    assetToBaseUnits: (amount: string) => bigint;
};
export type AccountAddressOnly = AccountBase & {
    type: 'addressOnly';
};
export type AccountFull = AccountBase & {
    type: 'full';
    getBalance: () => Promise<bigint>;
    sendDeposit: SendDepositFn;
};
export {};
//# sourceMappingURL=types.d.ts.map