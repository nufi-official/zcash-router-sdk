export const swap = async (params) => {
    const { swapApi, quote: quoteParams, sendDeposit, onStatusChange } = params;
    const quoteResponse = await swapApi.getQuote(quoteParams);
    const depositAddress = quoteResponse.quote?.depositAddress;
    if (!depositAddress) {
        throw new Error('No deposit address found in quote response');
    }
    onStatusChange?.({ status: 'QUOTE_RECEIVED', depositAddress });
    if (sendDeposit) {
        const txHash = await sendDeposit({
            address: depositAddress,
            amount: quoteParams.amount,
        });
        onStatusChange?.({ status: 'DEPOSIT_SENT', txHash });
        await swapApi.submitTxHash({
            transactionHash: txHash,
            depositAddress,
        });
    }
    await swapApi.pollStatus({
        depositAddress,
        maxAttempts: 100,
        pollingInterval: 10000,
        initialDelay: 5000,
        onStatusChange,
    });
    return quoteResponse;
};
//# sourceMappingURL=swap.js.map