import { SolanaAccountFull } from './solanaAccountFull';
export async function createSolanaAccountFull(params) {
    const { mnemonic, accountIndex, network, tokenId, rpcUrl } = params;
    return new SolanaAccountFull({
        mnemonic,
        accountIndex,
        network,
        tokenId,
        rpcUrl,
    });
}
//# sourceMappingURL=createSolanaAccountFull.js.map