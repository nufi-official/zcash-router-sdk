import type { AccountFull, RouteAsset } from '@zcash-router-sdk/core';
import type { SolanaNetwork } from './types';
export declare class SolanaAccountFull implements AccountFull {
    readonly type: "full";
    readonly asset: RouteAsset;
    private readonly mnemonic;
    private readonly accountIndex;
    private readonly network;
    private readonly connection;
    private cachedKeypair?;
    private cachedAddress?;
    constructor(params: {
        mnemonic: string;
        accountIndex: number;
        network: SolanaNetwork;
        tokenId: string | undefined;
        rpcUrl?: string;
    });
    private getDefaultRpcUrl;
    private getKeypair;
    getAddress: () => Promise<string>;
    getBalance: () => Promise<bigint>;
    assetToBaseUnits: (amount: string) => bigint;
    sendDeposit: ({ address, amount, }: {
        address: string;
        amount: string;
    }) => Promise<string>;
}
//# sourceMappingURL=solanaAccountFull.d.ts.map