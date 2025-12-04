import { swapApi } from './swapApi/application';
import { swap } from './swapApi';
export async function routeFromZcash(params) {
    const swapApiAssets = await swapApi.getTokens();
    const zecSwapApiAsset = swapApiAssets.find((asset) => asset.blockchain === 'zec' && asset.contractAddress === undefined);
    if (!zecSwapApiAsset) {
        throw new Error('ZEC swap API asset not found');
    }
    const destinationSwapApiAsset = swapApiAssets.find((asset) => asset.blockchain === params.destinationAccount.asset.blockchain &&
        asset.contractAddress === params.destinationAccount.asset.tokenId);
    if (!destinationSwapApiAsset) {
        throw new Error('Destination swap API asset not found');
    }
    await swap({
        swapApi,
        quote: {
            dry: false,
            senderAddress: await params.zcashAccount.getAddress(),
            recipientAddress: await params.destinationAccount.getAddress(),
            originAsset: zecSwapApiAsset.assetId,
            destinationAsset: destinationSwapApiAsset.assetId,
            amount: params.zcashAccount.assetToBaseUnits(params.amount).toString(),
            slippageTolerance: 100,
        },
        sendDeposit: (depositParams) => params.zcashAccount.sendDeposit(depositParams),
        onStatusChange: params.onSwapStatusChange,
    });
}
//# sourceMappingURL=fromZcash.js.map