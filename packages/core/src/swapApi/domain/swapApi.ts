import type { GetExecutionStatusResponse } from '@defuse-protocol/one-click-sdk-typescript'; // TODO: have a domain defined type to avoid using the sdk for it

import type { SwapStateChangeEvent } from './swap';

export type TokensResponse = Record<string, string>;

export type SwapQuote = {
  amountInFormatted: string;
  amountOutFormatted: string;
  depositAddress: string;
  estimatedFees?: {
    network?: string;
    protocol?: string;
  };
};

export type SwapQuoteResponse = {
  timestamp: string;
  signature: string;
  quote: { depositAddress?: string };
};

export type SubmitTxHashParams = {
  transactionHash: string;
  depositAddress: string;
};

export type GetQuoteParams = {
  dry: boolean;
  senderAddress: string;
  recipientAddress: string;
  originAsset: string;
  destinationAsset: string;
  amount: string;
  slippageTolerance: number;
  deadline?: string;
  referral?: string;
};

export type CheckStatusParams = {
  depositAddress: string;
  maxAttempts: number;
  pollingInterval: number;
  initialDelay: number;
  onStatusChange?: (event: SwapStateChangeEvent) => void;
};
export const checkStatusResponse = [
  'KNOWN_DEPOSIT_TX',
  'PENDING_DEPOSIT',
  'INCOMPLETE_DEPOSIT',
  'PROCESSING',
  'SUCCESS',
  'REFUNDED',
  'FAILED',
] as const;

export type CheckStatusResponse = (typeof checkStatusResponse)[number];

// Happy path timeline - normal successful swap flow
export const SWAP_HAPPY_PATH_TIMELINE: readonly CheckStatusResponse[] = [
  'PENDING_DEPOSIT',
  'KNOWN_DEPOSIT_TX', // Deposit detected on-chain
  'PROCESSING',
  'SUCCESS',
] as const;

// End states that terminate the swap (no more progression)
export const SWAP_END_STATES = new Set<CheckStatusResponse>([
  'SUCCESS',
  'FAILED',
  'REFUNDED',
]);

export type SwapApi = {
  getTokens: () => Promise<SwapApiAsset[]>;
  getQuote: (params: GetQuoteParams) => Promise<SwapQuoteResponse>;
  submitTxHash: (params: SubmitTxHashParams) => Promise<void>;
  pollStatus: (
    params: CheckStatusParams
  ) => Promise<GetExecutionStatusResponse | null>;
};

export type SendDepositFn = ({
  address,
  amount,
}: {
  address: string;
  amount: string;
}) => Promise<string>; // Returns transaction hash

export type SwapApiAsset = {
  assetId: string;
  priceUpdatedAt: string;
  price: number;
  decimals: number;
  symbol: string;
  blockchain: string;
  contractAddress?: string | undefined;
};
