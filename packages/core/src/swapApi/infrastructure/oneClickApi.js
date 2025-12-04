import { OpenAPI, OneClickService, QuoteRequest, } from '@defuse-protocol/one-click-sdk-typescript';
import { sleep } from '../../utils';
export const OneClickApi = (config) => {
    OpenAPI.BASE = config.apiBaseUrl;
    OpenAPI.TOKEN = config.jwtToken;
    return {
        getTokens: async () => {
            return await OneClickService.getTokens();
        },
        getQuote: async (params) => {
            const quoteRequest = {
                dry: params.dry,
                swapType: QuoteRequest.swapType.EXACT_INPUT,
                slippageTolerance: params.slippageTolerance,
                originAsset: params.originAsset,
                depositType: QuoteRequest.depositType.ORIGIN_CHAIN,
                destinationAsset: params.destinationAsset,
                amount: params.amount,
                refundTo: params.senderAddress,
                refundType: QuoteRequest.refundType.ORIGIN_CHAIN,
                recipient: params.recipientAddress,
                recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN,
                deadline: params.deadline ?? new Date(Date.now() + 3 * 60 * 1000).toISOString(),
                referral: params.referral,
                quoteWaitingTimeMs: 3000,
            };
            return OneClickService.getQuote(quoteRequest);
        },
        submitTxHash: async (params) => {
            await OneClickService.submitDepositTx({
                txHash: params.transactionHash,
                depositAddress: params.depositAddress,
            });
        },
        pollStatus: async (params) => {
            await sleep(params.initialDelay);
            let attempts = 0;
            let statusResponse = null;
            while (attempts < params.maxAttempts) {
                try {
                    const newStatusResponse = await OneClickService.getExecutionStatus(params.depositAddress);
                    if (params.onStatusChange &&
                        newStatusResponse.status !== statusResponse?.status) {
                        params?.onStatusChange({
                            status: newStatusResponse.status,
                            statusResponse: newStatusResponse,
                        });
                    }
                    if (newStatusResponse.status === 'SUCCESS' ||
                        newStatusResponse.status === 'FAILED' ||
                        newStatusResponse.status === 'REFUNDED') {
                        return newStatusResponse;
                    }
                    statusResponse = newStatusResponse;
                }
                finally {
                    attempts++;
                    await sleep(params.pollingInterval);
                }
            }
            return statusResponse;
        },
    };
};
//# sourceMappingURL=oneClickApi.js.map