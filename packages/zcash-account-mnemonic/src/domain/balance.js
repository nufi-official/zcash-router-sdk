export const ZEC_FEE_ZATOSHIS = BigInt(40000);
export const getMaxSendableAmount = (accountInfo) => {
    const shieldedMax = accountInfo.shieldedBalance - ZEC_FEE_ZATOSHIS;
    const transparentMax = accountInfo.unshieldedBalance - ZEC_FEE_ZATOSHIS;
    return {
        shielded: shieldedMax <= 0 ? BigInt(0) : shieldedMax,
        transparent: transparentMax <= 0
            ? BigInt(0)
            : transparentMax,
    };
};
//# sourceMappingURL=balance.js.map