export const ZCashAccountManager = (cryptoProviders, webWalletManager) => {
    const getAccountOfflineInfo = async (account) => {
        return {
            shieldedAddress: await webWalletManager.getCurrentAddress(account),
            transparentAddress: await webWalletManager.getCurrentTransparentAddress(account),
        };
    };
    const getAccountNetworkInfo = async (account) => {
        return await webWalletManager.getAccountBalances(account);
    };
    const getAccountInfo = async (account) => {
        const networkInfo = await getAccountNetworkInfo(account);
        const offlineInfo = await getAccountOfflineInfo(account);
        return { ...account, ...networkInfo, ...offlineInfo };
    };
    const signPczt = async (account, txPlan) => {
        const pcztHex = await webWalletManager.createPczt(account, txPlan.toAddress, txPlan.amount);
        const signedPcztHex = await cryptoProviders[account.cryptoProviderType].signPczt(pcztHex, account.accountIndex);
        return await webWalletManager.provePczt(signedPcztHex);
    };
    const shieldTransparentFunds = async (account) => {
        const shieldPcztHex = await webWalletManager.createShieldPczt(account);
        const signedShieldPcztHex = await cryptoProviders[account.cryptoProviderType].signPczt(shieldPcztHex, account.accountIndex);
        const provedShieldPcztHex = await webWalletManager.provePczt(signedShieldPcztHex);
        await webWalletManager.submitTransaction(provedShieldPcztHex);
        await new Promise((resolve) => setTimeout(resolve, 30000));
        await webWalletManager.sync();
    };
    return {
        signPczt,
        getAccountOfflineInfo,
        getAccountNetworkInfo,
        getAccountInfo,
        shieldTransparentFunds,
    };
};
//# sourceMappingURL=accountManager.js.map