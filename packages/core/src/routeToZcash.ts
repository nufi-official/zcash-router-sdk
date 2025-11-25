import { AccountAddressOnly, AccountFull } from "./types"
import { swapApi } from "./swapApi/application"
import { swap, SwapStateChangeEvent } from "./swapApi"

export async function routeToZcash(params: {
  sourceAccount: AccountAddressOnly | AccountFull
  zcashAccount: Extract<AccountFull & { asset: {
    blockchain: 'zcash'
    contractAddress: undefined
  } }, AccountFull>
  amount: string
  onSwapStatusChange: (event: SwapStateChangeEvent) => void
}) {
  const swapApiAssets = await swapApi.getTokens()

  const sourceSwapApiAsset = swapApiAssets.find((asset) => asset.blockchain === params.sourceAccount.asset.blockchain && asset.contractAddress === params.sourceAccount.asset.tokenId)

  if (!sourceSwapApiAsset) {
    throw new Error('Source swap API asset not found')
  }

  // destination asset is ZECo
  const zecSwapApiAsset = 
    swapApiAssets.find((asset) => asset.blockchain === 'zcash' && asset.contractAddress === undefined)

  if (!zecSwapApiAsset) {
    throw new Error('ZEC swap API asset not found')
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
      slippageTolerance: 100, // TODO: adjust in ui
    },
    sendDeposit: params.sourceAccount.type === 'full' ? params.sourceAccount.sendDeposit : undefined,
    onStatusChange: params.onSwapStatusChange,
  })
}