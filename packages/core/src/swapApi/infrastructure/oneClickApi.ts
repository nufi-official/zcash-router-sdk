import type {
  GetExecutionStatusResponse,
  TokenResponse,
} from '@defuse-protocol/one-click-sdk-typescript'
import {
  OpenAPI,
  OneClickService,
  QuoteRequest,
} from '@defuse-protocol/one-click-sdk-typescript'

import {sleep} from '../../utils'

import type {
  CheckStatusParams,
  GetQuoteParams,
  SubmitTxHashParams,
  SwapApi,
  SwapApiAsset,
  SwapApiAssetBlockchain,
} from '../domain'

export type OneClickApiConfig = {
  jwtToken: string
  apiBaseUrl: string
}

const tokenBlockchainSwapApiBlockchainMap: Record<
  string,
  SwapApiAssetBlockchain
> = {
  sol: 'solana',
}

const parseTokens = (tokens: TokenResponse[]): SwapApiAsset[] => {
  return tokens
    .map((token) => {
      return {
        assetId: token.assetId,
        priceUpdatedAt: token.priceUpdatedAt,
        tokenId: token.contractAddress,
        blockchain: tokenBlockchainSwapApiBlockchainMap[token.blockchain],
        price: token.price,
        decimals: token.decimals,
      }
    })
    .filter((token): token is SwapApiAsset => token.blockchain !== undefined)
}

export const OneClickApi = (config: OneClickApiConfig): SwapApi => {
  OpenAPI.BASE = config.apiBaseUrl
  OpenAPI.TOKEN = config.jwtToken

  return {
    getTokens: async () => {
      const tokens = await OneClickService.getTokens()

      return parseTokens(tokens)
    },

    getQuote: async (params: GetQuoteParams) => {
      const quoteRequest: QuoteRequest = {
        dry: params.dry,
        swapType: QuoteRequest.swapType.EXACT_INPUT,
        slippageTolerance: params.slippageTolerance,
        originAsset: params.originAsset,
        depositType: QuoteRequest.depositType.ORIGIN_CHAIN,
        destinationAsset: params.destinationAsset,
        amount: params.amount,
        refundTo: params.senderAddress,
        refundType: QuoteRequest.refundType.ORIGIN_CHAIN, // TODO:
        recipient: params.recipientAddress,
        recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN, // TODO:
        deadline:
          params.deadline ?? new Date(Date.now() + 3 * 60 * 1000).toISOString(), // TODO: 3 minutes default
        referral: params.referral, // TODO:
        quoteWaitingTimeMs: 3000,
        //  TODO: add appFees
      }

      return OneClickService.getQuote(quoteRequest)
    },

    submitTxHash: async (params: SubmitTxHashParams) => {
      await OneClickService.submitDepositTx({
        txHash: params.transactionHash,
        depositAddress: params.depositAddress,
      })
    },

    pollStatus: async (
      params: CheckStatusParams,
    ): Promise<GetExecutionStatusResponse | null> => {
      await sleep(params.initialDelay)
      let attempts = 0
      let statusResponse: GetExecutionStatusResponse | null = null
      while (attempts < params.maxAttempts) {
        try {
          const newStatusResponse = await OneClickService.getExecutionStatus(
            params.depositAddress,
          )

          if (
            params.onStatusChange &&
            newStatusResponse.status !== statusResponse?.status
          ) {
            params?.onStatusChange({
              status: newStatusResponse.status,
              statusResponse: newStatusResponse,
            })
          }

          if (newStatusResponse.status === 'SUCCESS') {
            return statusResponse
          }

          statusResponse = newStatusResponse
        } finally {
          attempts++
          await sleep(params.pollingInterval)
        }
      }
      return statusResponse
    },
  }
}
