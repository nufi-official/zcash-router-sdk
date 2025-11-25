import { AccountAddressOnly, AccountFull } from './types';
import { swapApi } from './swapApi/application';
import { swap, SwapStateChangeEvent } from './swapApi';

export async function routeFromZcash(params: {
  zcashAccount: Extract<
    AccountFull & {
      asset: {
        blockchain: 'zcash';
        contractAddress: undefined;
      };
    },
    AccountFull
  >;
  destinationAccount: AccountAddressOnly;
  amount: string;
  onSwapStatusChange: (event: SwapStateChangeEvent) => void;
}) {
  const swapApiAssets = await swapApi.getTokens();

  // destination asset is ZEC
  const zecSwapApiAsset = swapApiAssets.find(
    (asset) =>
      asset.blockchain === 'zcash' && asset.contractAddress === undefined
  );

  if (!zecSwapApiAsset) {
    throw new Error('ZEC swap API asset not found');
  }

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
    sendDeposit: params.zcashAccount.sendDeposit,
    onStatusChange: params.onSwapStatusChange,
  });
}
