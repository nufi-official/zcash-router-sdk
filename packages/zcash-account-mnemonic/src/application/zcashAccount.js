import { ZCashAccountManager } from '../domain/accountManager';
import { zecToZatoshis } from '../domain/parseUtils';
import { ZEC_FEE_ZATOSHIS } from '../domain';
export const ZCASH_ASSET = {
    blockchain: 'zec',
    tokenId: undefined,
};
export class ZcashAccount {
    constructor(params) {
        this.type = 'full';
        this.asset = ZCASH_ASSET;
        this.wallet = params.wallet;
        this.account = params.account;
        this.addressType = params.addressType;
        this.accountManager = ZCashAccountManager(params.cryptoProviders, params.webWalletManager);
    }
    async getAddress() {
        const offlineInfo = await this.accountManager.getAccountOfflineInfo(this.account);
        return this.addressType === 'transparent'
            ? offlineInfo.transparentAddress
            : offlineInfo.shieldedAddress;
    }
    async getBalance() {
        const networkInfo = await this.accountManager.getAccountNetworkInfo(this.account);
        return this.addressType === 'transparent'
            ? networkInfo.unshieldedBalance
            : (networkInfo.shieldedBalance - ZEC_FEE_ZATOSHIS);
    }
    assetToBaseUnits(amount) {
        return zecToZatoshis(amount);
    }
    async sendDeposit({ address, amount, }) {
        const amountZatoshis = BigInt(amount);
        const balances = await this.accountManager.getAccountNetworkInfo(this.account);
        const shieldedBalance = balances.shieldedBalance;
        const transparentBalance = balances.unshieldedBalance;
        if (shieldedBalance < amountZatoshis && transparentBalance > 0n) {
            await this.accountManager.shieldTransparentFunds(this.account);
        }
        const txPlan = {
            toAddress: address,
            amount: amountZatoshis,
        };
        const provedPcztHex = await this.accountManager.signPczt(this.account, txPlan);
        return await this.wallet.submitTransaction(provedPcztHex);
    }
}
//# sourceMappingURL=zcashAccount.js.map