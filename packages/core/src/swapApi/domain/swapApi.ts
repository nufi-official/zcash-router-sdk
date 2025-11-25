import type {GetExecutionStatusResponse} from '@defuse-protocol/one-click-sdk-typescript' // TODO: have a domain defined type to avoid using the sdk for it

import type {SwapStateChangeEvent} from './swap'

export type TokensResponse = Record<string, string>

export type SwapQuote = {
  amountInFormatted: string
  amountOutFormatted: string
  depositAddress: string
  estimatedFees?: {
    network?: string
    protocol?: string
  }
}

export type SwapQuoteResponse = {
  timestamp: string
  signature: string
  quote: {depositAddress?: string}
}

export type SwapResult = {
  quote: SwapQuoteResponse
  finalStatus: GetExecutionStatusResponse | null
}

export type SubmitTxHashParams = {
  transactionHash: string
  depositAddress: string
}

export type GetQuoteParams = {
  dry: boolean
  senderAddress: string
  recipientAddress: string
  originAsset: string
  destinationAsset: string
  amount: string
  slippageTolerance: number
  deadline?: string
  referral?: string
}

export type CheckStatusParams = {
  depositAddress: string
  maxAttempts: number
  pollingInterval: number
  initialDelay: number
  onStatusChange?: (event: SwapStateChangeEvent) => void
}

export type CheckStatusResponse =
  | 'KNOWN_DEPOSIT_TX'
  | 'PENDING_DEPOSIT'
  | 'INCOMPLETE_DEPOSIT'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'REFUNDED'
  | 'FAILED'

export type SwapApi = {
  getTokens: () => Promise<SwapApiAsset[]>
  getQuote: (params: GetQuoteParams) => Promise<SwapQuoteResponse>
  submitTxHash: (params: SubmitTxHashParams) => Promise<void>
  pollStatus: (
    params: CheckStatusParams,
  ) => Promise<GetExecutionStatusResponse | null>
}

export type SendDepositFn = ({
  address,
  amount,
}: {
  address: string
  amount: string
}) => Promise<string> // Returns transaction hash

export type SwapApiAssetBlockchain = SwapApiAsset['blockchain']

export type SwapApiAsset = {
  assetId: string
  priceUpdatedAt: string
  price: number
  decimals: number
  symbol: string
} & (
  | {
      blockchain: 'solana'
      tokenId: undefined // not supporting tokens
    }
)
