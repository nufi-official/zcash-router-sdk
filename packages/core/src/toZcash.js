import { swapApi } from './swapApi/application';
import { swap } from './swapApi';
export async function routeToZcash(params) {
    const swapApiAssets = await swapApi.getTokens();
    const sourceSwapApiAsset = swapApiAssets.find((asset) => asset.blockchain === params.sourceAccount.asset.blockchain &&
        asset.contractAddress === params.sourceAccount.asset.tokenId);
    if (!sourceSwapApiAsset) {
        throw new Error('Source swap API asset not found');
    }
    const zecSwapApiAsset = swapApiAssets.find((asset) => asset.blockchain === 'zec' && asset.contractAddress === undefined);
    if (!zecSwapApiAsset) {
        throw new Error('ZEC swap API asset not found');
    }
    await swap({
        swapApi,
        quote: {
            dry: false,
            senderAddress: await params.sourceAccount.getAddress(),
            recipientAddress: await params.zcashAccount.getAddress(),
            originAsset: sourceSwapApiAsset.assetId,
            destinationAsset: zecSwapApiAsset.assetId,
            amount: params.sourceAccount.assetToBaseUnits(params.amount).toString(),
            slippageTolerance: 100,
        },
        sendDeposit: params.sourceAccount.type === 'full'
            ? (depositParams) => params.sourceAccount.sendDeposit(depositParams)
            : undefined,
        onStatusChange: params.onSwapStatusChange,
    });
}
//# sourceMappingURL=toZcash.js.map