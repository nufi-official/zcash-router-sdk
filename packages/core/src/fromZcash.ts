import { AccountAddressOnly, AccountFull } from './types';
import { swapApi } from './swapApi/application';
import { swap, SwapStateChangeEvent } from './swapApi';

export async function routeFromZcash(params: {
  zcashAccount: AccountFull;
  destinationAccount: AccountAddressOnly;
  amount: string;
  onSwapStatusChange: (event: SwapStateChangeEvent) => void;
}) {
  const swapApiAssets = await swapApi.getTokens();

  console.log('swapApiAssets', swapApiAssets);

  // destination asset is ZEC
  const zecSwapApiAsset = swapApiAssets.find(
    (asset) => asset.blockchain === 'zec' && asset.contractAddress === undefined
  );

  if (!zecSwapApiAsset) {
    throw new Error('ZEC swap API asset not found');
  }

  console.log('destinationSwapApiAsset', params.destinationAccount.asset);

  const destinationSwapApiAsset = swapApiAssets.find(
    (asset) =>
      asset.blockchain === params.destinationAccount.asset.blockchain &&
      asset.contractAddress === params.destinationAccount.asset.tokenId
  );

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
      slippageTolerance: 100, // TODO: adjust in ui
    },
    sendDeposit: (depositParams) =>
      params.zcashAccount.sendDeposit(depositParams),
    onStatusChange: params.onSwapStatusChange,
  });
}
