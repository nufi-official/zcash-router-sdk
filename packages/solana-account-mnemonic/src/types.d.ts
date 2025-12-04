import type { RouteAsset } from '@zcash-router-sdk/core';
export type SolanaNetwork = 'mainnet';
export type SolanaAddress = string;
export interface CreateSolanaAccountFullParams {
    mnemonic: string;
    accountIndex: number;
    network: SolanaNetwork;
    tokenId?: string | undefined;
    rpcUrl?: string;
}
export declare const SOLANA_ASSET: RouteAsset;
export declare const SOLANA_DECIMALS = 9;
export declare const LAMPORTS_PER_SOL = 1000000000n;
//# sourceMappingURL=types.d.ts.map