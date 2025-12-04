import type { GetExecutionStatusResponse } from '@defuse-protocol/one-click-sdk-typescript';

import type {
  GetQuoteParams,
  SendDepositFn,
  SwapApi,
  CheckStatusResponse,
  SwapQuoteResponse,
} from './swapApi.ts';

export type SwapStateChangeEvent =
  | {
      status: 'QUOTE_RECEIVED';
      depositAddress: string;
    }
  | {
      status: 'DEPOSIT_SENT';
      txHash: string;
    }
  | {
      status: CheckStatusResponse;
      statusResponse: GetExecutionStatusResponse;
    };
// TODO: timeout event

export type SwapParams = {
  swapApi: SwapApi;
  quote: GetQuoteParams;
  sendDeposit?: SendDepositFn;
  onStatusChange?: (event: SwapStateChangeEvent) => void;
};

export const swap = async (params: SwapParams): Promise<SwapQuoteResponse> => {
  const { swapApi, quote: quoteParams, sendDeposit, onStatusChange } = params;

  // Step 1: Get quote and extract deposit address
  const quoteResponse = await swapApi.getQuote(quoteParams);

  const depositAddress = quoteResponse.quote?.depositAddress;
  if (!depositAddress) {
    throw new Error('No deposit address found in quote response');
  }

  // Emit quote received event with deposit address
  onStatusChange?.({ status: 'QUOTE_RECEIVED', depositAddress });

  // Step 2: Send deposit if provided

  if (sendDeposit) {
    const txHash = await sendDeposit({
      address: depositAddress,
      amount: quoteParams.amount,
    });

    onStatusChange?.({ status: 'DEPOSIT_SENT', txHash });

    // Step 3: Submit transaction hash to speed up processing (optional)
    await swapApi.submitTxHash({
      transactionHash: txHash,
      depositAddress,
    });
  }

  // Step 4: Poll for status
  await swapApi.pollStatus({
    depositAddress,
    maxAttempts: 100,
    pollingInterval: 10000,
    initialDelay: 5000,
    onStatusChange,
  });

  return quoteResponse;
};
